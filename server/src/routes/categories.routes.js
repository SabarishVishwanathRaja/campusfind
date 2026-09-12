const express = require('express');
const router = express.Router();
const db = require('../db');
const { authRequired, adminOnly } = require('../middleware/auth');

/**
 * GET /api/categories
 * List all categories (Public)
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/categories/:id
 * Get single category by ID (Public)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    const result = await db.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/categories
 * Create a new category (Admin only)
 */
router.post('/', authRequired, adminOnly, async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const trimmedName = name.trim();

    // Check duplicate
    const existing = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER($1)', [trimmedName]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'A category with this name already exists.' });
    }

    const result = await db.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [trimmedName]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/categories/:id
 * Update category name (Admin only)
 */
router.put('/:id', authRequired, adminOnly, async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required.' });
    }

    const trimmedName = name.trim();

    // Check if category exists
    const check = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Check duplicate name on another category
    const duplicate = await db.query(
      'SELECT id FROM categories WHERE LOWER(name) = LOWER($1) AND id != $2',
      [trimmedName, categoryId]
    );
    if (duplicate.rows.length > 0) {
      return res.status(400).json({ error: 'A category with this name already exists.' });
    }

    const result = await db.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [trimmedName, categoryId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/categories/:id
 * Delete category (Admin only)
 * Must return 409 if items still reference this category
 */
router.delete('/:id', authRequired, adminOnly, async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    // Check if category exists
    const check = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Check if items reference this category
    const itemsCount = await db.query(
      'SELECT COUNT(*)::int AS count FROM items WHERE category_id = $1',
      [categoryId]
    );

    if (itemsCount.rows[0].count > 0) {
      return res.status(409).json({
        error: `Cannot delete category: ${itemsCount.rows[0].count} item(s) are still referencing this category.`
      });
    }

    await db.query('DELETE FROM categories WHERE id = $1', [categoryId]);
    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
