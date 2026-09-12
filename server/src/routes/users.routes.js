const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

/**
 * GET /api/users
 * List all users (Admin only)
 */
router.get('/', authRequired, adminOnly, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id
 * Get single user by ID (Self or Admin)
 */
router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    if (req.user.role !== 'ADMIN' && req.user.id !== targetId) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    const result = await db.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = $1`,
      [targetId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users
 * Create user with specific role (Admin only)
 */
router.post('/', authRequired, adminOnly, async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const assignedRole = role && ['STUDENT', 'ADMIN'].includes(role.toUpperCase())
      ? role.toUpperCase()
      : 'STUDENT';

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [trimmedEmail]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [trimmedName, trimmedEmail, passwordHash, assignedRole]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id
 * Update user profile/role (Self or Admin)
 * Only Admin may change role.
 */
router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const isAdmin = req.user.role === 'ADMIN';
    const isSelf = req.user.id === targetId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    // Check existing user
    const existing = await db.query('SELECT * FROM users WHERE id = $1', [targetId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const currentUser = existing.rows[0];

    const { name, email, password, role } = req.body;

    if (role && role !== currentUser.role && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Only administrators can change roles.' });
    }

    let updatedRole = currentUser.role;
    if (isAdmin && role) {
      const upperRole = role.toUpperCase();
      if (!['STUDENT', 'ADMIN'].includes(upperRole)) {
        return res.status(400).json({ error: 'Role must be STUDENT or ADMIN.' });
      }
      updatedRole = upperRole;
    }

    let updatedName = currentUser.name;
    if (name && name.trim()) {
      updatedName = name.trim();
    }

    let updatedEmail = currentUser.email;
    if (email && email.trim().toLowerCase() !== currentUser.email) {
      const trimmedEmail = email.trim().toLowerCase();
      const duplicate = await db.query('SELECT id FROM users WHERE LOWER(email) = $1 AND id != $2', [trimmedEmail, targetId]);
      if (duplicate.rows.length > 0) {
        return res.status(400).json({ error: 'An account with this email already exists.' });
      }
      updatedEmail = trimmedEmail;
    }

    let updatedPasswordHash = currentUser.password_hash;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }
      updatedPasswordHash = await bcrypt.hash(password, 10);
    }

    const result = await db.query(
      `UPDATE users
       SET name = $1, email = $2, password_hash = $3, role = $4
       WHERE id = $5
       RETURNING id, name, email, role, created_at`,
      [updatedName, updatedEmail, updatedPasswordHash, updatedRole, targetId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (Admin only)
 */
router.delete('/:id', authRequired, adminOnly, async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id, 10);
    if (isNaN(targetId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    if (req.user.id === targetId) {
      return res.status(400).json({ error: 'Cannot delete your own admin account.' });
    }

    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [targetId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
