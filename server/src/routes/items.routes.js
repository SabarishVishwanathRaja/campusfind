const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');
const { uploadBuffer, deleteImage } = require('../cloudinary');

// Multer memory storage configuration
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter
});

// Wrapper to handle multer errors gracefully
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Image size exceeds the 5 MB limit.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

/**
 * GET /api/items
 * List items with filters, search, and pagination (Public)
 */
router.get('/', async (req, res, next) => {
  try {
    const { type, status, category_id, q, page = 1, limit = 12 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (type && ['LOST', 'FOUND'].includes(type.toUpperCase())) {
      conditions.push(`i.type = $${paramIndex++}`);
      values.push(type.toUpperCase());
    }

    if (status && ['OPEN', 'CLAIMED', 'RETURNED'].includes(status.toUpperCase())) {
      conditions.push(`i.status = $${paramIndex++}`);
      values.push(status.toUpperCase());
    }

    if (category_id) {
      const catId = parseInt(category_id, 10);
      if (!isNaN(catId)) {
        conditions.push(`i.category_id = $${paramIndex++}`);
        values.push(catId);
      }
    }

    if (q && q.trim()) {
      conditions.push(`(i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR i.location ILIKE $${paramIndex})`);
      values.push(`%${q.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN users u ON i.user_id = u.id
      ${whereClause}
    `;
    const countResult = await db.query(countSql, values);
    const total = countResult.rows[0].total;

    // Get paginated items
    const queryValues = [...values, limitNum, offset];
    const dataSql = `
      SELECT i.id, i.title, i.description, i.type, i.location, i.item_date, i.status,
             i.image_url, i.image_public_id, i.category_id, i.user_id, i.created_at,
             c.name AS category_name,
             u.name AS reporter_name
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN users u ON i.user_id = u.id
      ${whereClause}
      ORDER BY i.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    const dataResult = await db.query(dataSql, queryValues);

    res.json({
      data: dataResult.rows,
      page: pageNum,
      limit: limitNum,
      total
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/items/mine/list
 * Items reported by current user (Auth required)
 * MUST be defined before /:id to prevent route clash!
 */
router.get('/mine/list', authRequired, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT i.id, i.title, i.description, i.type, i.location, i.item_date, i.status,
              i.image_url, i.image_public_id, i.category_id, i.user_id, i.created_at,
              c.name AS category_name,
              u.name AS reporter_name
       FROM items i
       JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.user_id = u.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/items/:id
 * Get single item details (Public)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID.' });
    }

    const result = await db.query(
      `SELECT i.id, i.title, i.description, i.type, i.location, i.item_date, i.status,
              i.image_url, i.image_public_id, i.category_id, i.user_id, i.created_at,
              c.name AS category_name,
              u.name AS reporter_name
       FROM items i
       JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/items
 * Report a new item (Auth required)
 * Multipart form data with optional image file
 */
router.post('/', authRequired, handleUpload, async (req, res, next) => {
  try {
    const { title, description, type, location, item_date, category_id } = req.body;

    if (!title || !type || !location || !item_date || !category_id) {
      return res.status(400).json({
        error: 'Title, type (LOST/FOUND), location, item_date, and category_id are required.'
      });
    }

    const upperType = type.trim().toUpperCase();
    if (!['LOST', 'FOUND'].includes(upperType)) {
      return res.status(400).json({ error: 'Item type must be LOST or FOUND.' });
    }

    const parsedCategoryId = parseInt(category_id, 10);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    // Verify category exists
    const categoryCheck = await db.query('SELECT id FROM categories WHERE id = $1', [parsedCategoryId]);
    if (categoryCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Category does not exist.' });
    }

    // Cloudinary upload if image file attached
    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      const uploadRes = await uploadBuffer(req.file.buffer);
      imageUrl = uploadRes.url;
      imagePublicId = uploadRes.publicId;
    }

    // Insert into items table
    const insertResult = await db.query(
      `INSERT INTO items (
         title, description, type, location, item_date, status,
         image_url, image_public_id, category_id, user_id
       ) VALUES ($1, $2, $3, $4, $5, 'OPEN', $6, $7, $8, $9)
       RETURNING *`,
      [
        title.trim(),
        description ? description.trim() : null,
        upperType,
        location.trim(),
        item_date,
        imageUrl,
        imagePublicId,
        parsedCategoryId,
        req.user.id
      ]
    );

    const newItem = insertResult.rows[0];

    // Fetch full item joined with category and user
    const fullResult = await db.query(
      `SELECT i.id, i.title, i.description, i.type, i.location, i.item_date, i.status,
              i.image_url, i.image_public_id, i.category_id, i.user_id, i.created_at,
              c.name AS category_name,
              u.name AS reporter_name
       FROM items i
       JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [newItem.id]
    );

    res.status(201).json(fullResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/items/:id
 * Update an item (Owner or Admin)
 */
router.put('/:id', authRequired, handleUpload, async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID.' });
    }

    const existing = await db.query('SELECT * FROM items WHERE id = $1', [itemId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const currentItem = existing.rows[0];
    const isOwner = currentItem.user_id === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own items.' });
    }

    const { title, description, type, location, item_date, category_id, remove_image } = req.body;

    let updatedTitle = currentItem.title;
    if (title && title.trim()) updatedTitle = title.trim();

    let updatedDescription = currentItem.description;
    if (description !== undefined) updatedDescription = description ? description.trim() : null;

    let updatedType = currentItem.type;
    if (type) {
      const upperType = type.trim().toUpperCase();
      if (!['LOST', 'FOUND'].includes(upperType)) {
        return res.status(400).json({ error: 'Item type must be LOST or FOUND.' });
      }
      updatedType = upperType;
    }

    let updatedLocation = currentItem.location;
    if (location && location.trim()) updatedLocation = location.trim();

    let updatedItemDate = currentItem.item_date;
    if (item_date) updatedItemDate = item_date;

    let updatedCategoryId = currentItem.category_id;
    if (category_id) {
      const catId = parseInt(category_id, 10);
      if (isNaN(catId)) return res.status(400).json({ error: 'Invalid category ID.' });
      const catCheck = await db.query('SELECT id FROM categories WHERE id = $1', [catId]);
      if (catCheck.rows.length === 0) return res.status(400).json({ error: 'Category does not exist.' });
      updatedCategoryId = catId;
    }

    let updatedImageUrl = currentItem.image_url;
    let updatedImagePublicId = currentItem.image_public_id;

    // Handle new image upload or removal
    if (req.file) {
      // Delete previous image from Cloudinary if existed
      if (currentItem.image_public_id) {
        await deleteImage(currentItem.image_public_id);
      }
      const uploadRes = await uploadBuffer(req.file.buffer);
      updatedImageUrl = uploadRes.url;
      updatedImagePublicId = uploadRes.publicId;
    } else if (remove_image === 'true') {
      if (currentItem.image_public_id) {
        await deleteImage(currentItem.image_public_id);
      }
      updatedImageUrl = null;
      updatedImagePublicId = null;
    }

    await db.query(
      `UPDATE items
       SET title = $1, description = $2, type = $3, location = $4,
           item_date = $5, category_id = $6, image_url = $7, image_public_id = $8
       WHERE id = $9`,
      [
        updatedTitle,
        updatedDescription,
        updatedType,
        updatedLocation,
        updatedItemDate,
        updatedCategoryId,
        updatedImageUrl,
        updatedImagePublicId,
        itemId
      ]
    );

    const updatedResult = await db.query(
      `SELECT i.id, i.title, i.description, i.type, i.location, i.item_date, i.status,
              i.image_url, i.image_public_id, i.category_id, i.user_id, i.created_at,
              c.name AS category_name,
              u.name AS reporter_name
       FROM items i
       JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [itemId]
    );

    res.json(updatedResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/items/:id
 * Delete item and clean up Cloudinary asset (Owner or Admin)
 */
router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID.' });
    }

    const existing = await db.query('SELECT * FROM items WHERE id = $1', [itemId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const currentItem = existing.rows[0];
    const isOwner = currentItem.user_id === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own items.' });
    }

    // Delete image from Cloudinary if present
    if (currentItem.image_public_id) {
      await deleteImage(currentItem.image_public_id);
    }

    await db.query('DELETE FROM items WHERE id = $1', [itemId]);

    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/items/:id/status
 * Update item status directly (Admin only)
 */
router.patch('/:id/status', authRequired, adminOnly, async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID.' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const upperStatus = status.trim().toUpperCase();
    if (!['OPEN', 'CLAIMED', 'RETURNED'].includes(upperStatus)) {
      return res.status(400).json({ error: 'Status must be OPEN, CLAIMED, or RETURNED.' });
    }

    const check = await db.query('SELECT id FROM items WHERE id = $1', [itemId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const result = await db.query(
      `UPDATE items
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [upperStatus, itemId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
