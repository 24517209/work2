const { Router } = require('express');
const { query } = require('../db/event_db.js');

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rows = await query('SELECT id, name FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;


