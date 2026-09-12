const jwt = require('jsonwebtoken');

/**
 * Middleware: Verify JWT and attach req.user = { id, role, email, name }
 */
const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'campusfind_super_secret_jwt_key_2026');
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Middleware: Ensure the authenticated user has ADMIN role
 * Must run after authRequired
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin access required.' });
  }

  next();
};

module.exports = {
  authRequired,
  adminOnly
};
