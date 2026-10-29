const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'campusfind_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Helper to generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * POST /api/auth/register
 * Public registration for students
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already registered
    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // Hash password with bcryptjs cost 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user with role 'STUDENT'
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'STUDENT')
       RETURNING id, name, email, role, created_at`,
      [trimmedName, trimmedEmail, passwordHash]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      token,
      user: newUser
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Public authentication
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const result = await db.query(
      `SELECT id, name, email, password_hash, role, mfa_enabled, mfa_secret, created_at
       FROM users
       WHERE LOWER(email) = $1`,
      [trimmedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if MFA is enabled
    if (user.mfa_enabled && user.mfa_secret) {
      const tempToken = jwt.sign(
        { id: user.id, mfaPending: true },
        JWT_SECRET,
        { expiresIn: '5m' }
      );
      return res.json({
        mfaRequired: true,
        tempToken,
        message: 'Two-Factor Authentication required. Enter the 6-digit code from your authenticator app.'
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mfa_enabled: !!user.mfa_enabled,
      created_at: user.created_at
    };

    const token = generateToken(safeUser);

    return res.json({
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/mfa/setup
 * Generates TOTP secret and QR code for Google / Microsoft Authenticator (Authenticated)
 */
router.post('/mfa/setup', authRequired, async (req, res, next) => {
  try {
    const userResult = await db.query(
      'SELECT id, email, mfa_enabled FROM users WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];
    const secret = speakeasy.generateSecret({
      name: `CampusFind (${user.email})`,
      issuer: 'CampusFind'
    });

    const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      qrCode: qrCodeDataUrl,
      instructions: 'Scan this QR code with Google Authenticator or Microsoft Authenticator, then call /api/auth/mfa/verify with the 6-digit code.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/mfa/verify
 * Verifies 6-digit TOTP code and activates MFA on the account (Authenticated)
 */
router.post('/mfa/verify', authRequired, async (req, res, next) => {
  try {
    const { token, secret } = req.body;

    if (!token || !secret) {
      return res.status(400).json({ error: 'Verification token (6-digit code) and secret are required.' });
    }

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: token.trim(),
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ error: 'Invalid 6-digit authenticator code. Check your device time and try again.' });
    }

    await db.query(
      'UPDATE users SET mfa_secret = $1, mfa_enabled = TRUE WHERE id = $2',
      [secret, req.user.id]
    );

    res.json({
      success: true,
      message: 'Multi-factor authentication (TOTP) successfully enabled.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/mfa/login
 * Validates 6-digit TOTP code during login and issues final JWT token
 */
router.post('/mfa/login', async (req, res, next) => {
  try {
    const { tempToken, token } = req.body;

    if (!tempToken || !token) {
      return res.status(400).json({ error: 'tempToken and 6-digit TOTP token are required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'MFA login session expired or invalid. Please log in again.' });
    }

    if (!decoded.mfaPending) {
      return res.status(400).json({ error: 'Invalid MFA login token.' });
    }

    const userResult = await db.query(
      'SELECT id, name, email, role, mfa_secret, mfa_enabled, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = userResult.rows[0];

    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token: token.trim(),
      window: 1
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid 6-digit authenticator code.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mfa_enabled: true,
      created_at: user.created_at
    };

    const finalToken = generateToken(safeUser);

    res.json({
      token: finalToken,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/mfa/disable
 * Disables MFA (Authenticated)
 */
router.post('/mfa/disable', authRequired, async (req, res, next) => {
  try {
    await db.query(
      'UPDATE users SET mfa_secret = NULL, mfa_enabled = FALSE WHERE id = $1',
      [req.user.id]
    );

    res.json({
      success: true,
      message: 'Multi-factor authentication disabled.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user
 */
router.get('/me', authRequired, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
