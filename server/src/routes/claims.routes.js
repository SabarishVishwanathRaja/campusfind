const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

/**
 * GET /api/claims
 * List all claims (Admin only, optional ?status= filter)
 */
router.get('/', authRequired, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.query;
    const conditions = [];
    const values = [];

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status.toUpperCase())) {
      conditions.push('c.status = $1');
      values.push(status.toUpperCase());
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT c.id, c.item_id, c.user_id, c.message, c.status, c.created_at,
             i.title AS item_title, i.type AS item_type, i.status AS item_status,
             u.name AS claimant_name, u.email AS claimant_email
      FROM claims c
      JOIN items i ON c.item_id = i.id
      JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/claims/mine/list
 * Claims made by the current user (Auth required)
 * MUST be defined before /:id!
 */
router.get('/mine/list', authRequired, async (req, res, next) => {
  try {
    const sql = `
      SELECT c.id, c.item_id, c.user_id, c.message, c.status, c.created_at,
             i.title AS item_title, i.type AS item_type, i.location AS item_location,
             i.item_date AS item_date, i.status AS item_status, i.image_url AS item_image_url
      FROM claims c
      JOIN items i ON c.item_id = i.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(sql, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/claims/:id
 * Get single claim details (Owner or Admin)
 */
router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const claimId = parseInt(req.params.id, 10);
    if (isNaN(claimId)) {
      return res.status(400).json({ error: 'Invalid claim ID.' });
    }

    const sql = `
      SELECT c.id, c.item_id, c.user_id, c.message, c.status, c.created_at,
             i.title AS item_title, i.type AS item_type, i.status AS item_status,
             u.name AS claimant_name, u.email AS claimant_email
      FROM claims c
      JOIN items i ON c.item_id = i.id
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;

    const result = await pool.query(sql, [claimId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found.' });
    }

    const claim = result.rows[0];
    const isOwner = claim.user_id === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    res.json(claim);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/claims
 * Submit a claim on an item (Auth required)
 */
router.post('/', authRequired, async (req, res, next) => {
  try {
    const { item_id, message } = req.body;

    if (!item_id || !message || !message.trim()) {
      return res.status(400).json({ error: 'Item ID and message are required.' });
    }

    const parsedItemId = parseInt(item_id, 10);
    if (isNaN(parsedItemId)) {
      return res.status(400).json({ error: 'Invalid item ID.' });
    }

    // Verify item exists
    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [parsedItemId]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const item = itemResult.rows[0];

    // Reject with 400 if user is the item's reporter
    if (item.user_id === req.user.id) {
      return res.status(400).json({ error: 'You cannot submit a claim on an item you reported.' });
    }

    // Reject with 409 if item status is not OPEN
    if (item.status !== 'OPEN') {
      return res.status(409).json({ error: `Cannot submit claim: item is currently marked as ${item.status}.` });
    }

    // Reject with 409 if user already claimed this item
    const existingClaim = await pool.query(
      'SELECT id FROM claims WHERE item_id = $1 AND user_id = $2',
      [parsedItemId, req.user.id]
    );
    if (existingClaim.rows.length > 0) {
      return res.status(409).json({ error: 'You have already submitted a claim for this item.' });
    }

    // Create claim
    const insertResult = await pool.query(
      `INSERT INTO claims (item_id, user_id, message, status)
       VALUES ($1, $2, $3, 'PENDING')
       RETURNING *`,
      [parsedItemId, req.user.id, message.trim()]
    );

    const newClaim = insertResult.rows[0];

    const fullClaimResult = await pool.query(
      `SELECT c.id, c.item_id, c.user_id, c.message, c.status, c.created_at,
              i.title AS item_title, i.type AS item_type, i.status AS item_status,
              u.name AS claimant_name
       FROM claims c
       JOIN items i ON c.item_id = i.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [newClaim.id]
    );

    res.status(201).json(fullClaimResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/claims/:id
 * Edit claim message (Owner only, while PENDING)
 */
router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const claimId = parseInt(req.params.id, 10);
    if (isNaN(claimId)) {
      return res.status(400).json({ error: 'Invalid claim ID.' });
    }

    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const check = await pool.query('SELECT * FROM claims WHERE id = $1', [claimId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found.' });
    }

    const claim = check.rows[0];

    if (claim.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own claims.' });
    }

    if (claim.status !== 'PENDING') {
      return res.status(400).json({ error: 'Claims can only be edited while in PENDING status.' });
    }

    const updateResult = await pool.query(
      `UPDATE claims
       SET message = $1
       WHERE id = $2
       RETURNING *`,
      [message.trim(), claimId]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/claims/:id/status
 * Approve or Reject claim (Admin only)
 * Executes inside an ACID database transaction using a dedicated client
 */
router.patch('/:id/status', authRequired, adminOnly, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const claimId = parseInt(req.params.id, 10);
    if (isNaN(claimId)) {
      client.release();
      return res.status(400).json({ error: 'Invalid claim ID.' });
    }

    const { status } = req.body;
    if (!status) {
      client.release();
      return res.status(400).json({ error: 'Status is required.' });
    }

    const upperStatus = status.trim().toUpperCase();
    if (!['APPROVED', 'REJECTED'].includes(upperStatus)) {
      client.release();
      return res.status(400).json({ error: 'Status must be APPROVED or REJECTED.' });
    }

    // Begin dedicated transaction
    await client.query('BEGIN');

    // Lock claim row for update
    const claimResult = await client.query('SELECT * FROM claims WHERE id = $1 FOR UPDATE', [claimId]);
    if (claimResult.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ error: 'Claim not found.' });
    }

    const targetClaim = claimResult.rows[0];

    if (upperStatus === 'APPROVED') {
      // 1. Set this target claim to APPROVED
      await client.query(
        "UPDATE claims SET status = 'APPROVED' WHERE id = $1",
        [claimId]
      );

      // 2. Set every other PENDING claim on this item to REJECTED
      await client.query(
        "UPDATE claims SET status = 'REJECTED' WHERE item_id = $1 AND id != $2 AND status = 'PENDING'",
        [targetClaim.item_id, claimId]
      );

      // 3. Set the item's status to CLAIMED
      await client.query(
        "UPDATE items SET status = 'CLAIMED' WHERE id = $1",
        [targetClaim.item_id]
      );
    } else {
      // REJECTED: Only this specific claim changes to REJECTED
      await client.query(
        "UPDATE claims SET status = 'REJECTED' WHERE id = $1",
        [claimId]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    // Retrieve updated claim with join information
    const finalResult = await pool.query(
      `SELECT c.id, c.item_id, c.user_id, c.message, c.status, c.created_at,
              i.title AS item_title, i.status AS item_status,
              u.name AS claimant_name, u.email AS claimant_email
       FROM claims c
       JOIN items i ON c.item_id = i.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [claimId]
    );

    res.json(finalResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

/**
 * DELETE /api/claims/:id
 * Delete/cancel claim (Owner or Admin)
 */
router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const claimId = parseInt(req.params.id, 10);
    if (isNaN(claimId)) {
      return res.status(400).json({ error: 'Invalid claim ID.' });
    }

    const check = await pool.query('SELECT * FROM claims WHERE id = $1', [claimId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found.' });
    }

    const claim = check.rows[0];
    const isOwner = claim.user_id === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Access denied.' });
    }

    await pool.query('DELETE FROM claims WHERE id = $1', [claimId]);

    res.json({ message: 'Claim deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
