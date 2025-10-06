const { Router } = require('express');
const { query } = require('../db/event_db.js');

const router = Router();

// GET /api/events - current and upcoming (not expired) events for home
router.get('/', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT e.id, e.name, e.description_short AS descriptionShort, e.city, e.venue,
              e.start_datetime AS startDateTime, e.end_datetime AS endDateTime,
              e.ticket_price AS ticketPrice, e.is_free AS isFree,
              e.fund_goal AS fundGoal, e.fund_raised AS fundRaised,
              c.name AS categoryName
         FROM events e
         LEFT JOIN categories c ON e.category_id = c.id
        WHERE e.is_hidden = 0 AND e.end_datetime >= NOW()
        ORDER BY e.start_datetime ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/search - with filters
router.get('/search', async (req, res) => {
  try {
    const { dateFrom, dateTo, city, categoryId, keyword } = req.query;
    const conditions = ['e.is_hidden = 0'];
    const params = [];

    if (dateFrom) {
      conditions.push('e.start_datetime >= ?');
      params.push(dateFrom);
    }
    if (dateTo) {
      conditions.push('e.end_datetime <= ?');
      params.push(dateTo);
    }
    if (city) {
      conditions.push('e.city LIKE ?');
      params.push(`%${city}%`);
    }
    if (categoryId) {
      conditions.push('e.category_id = ?');
      params.push(Number(categoryId));
    }
    if (keyword) {
      conditions.push('(e.name LIKE ? OR e.description_long LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = await query(
      `SELECT e.id, e.name, e.description_short AS descriptionShort, e.city, e.venue,
              e.start_datetime AS startDateTime, e.end_datetime AS endDateTime,
              e.ticket_price AS ticketPrice, e.is_free AS isFree,
              e.fund_goal AS fundGoal, e.fund_raised AS fundRaised,
              c.name AS categoryName
         FROM events e
         LEFT JOIN categories c ON e.category_id = c.id
        ${where}
        ORDER BY e.start_datetime ASC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search events' });
  }
});

// GET /api/events/:id - details
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await query(
      `SELECT e.id, e.name, e.description_short AS descriptionShort, e.description_long AS descriptionLong,
              e.city, e.venue, e.address,
              e.start_datetime AS startDateTime, e.end_datetime AS endDateTime,
              e.ticket_price AS ticketPrice, e.is_free AS isFree,
              e.fund_goal AS fundGoal, e.fund_raised AS fundRaised,
              e.is_hidden AS isHidden,
              c.id AS categoryId, c.name AS categoryName,
              o.id AS orgId, o.name AS orgName, o.description AS orgDescription, o.website AS orgWebsite
         FROM events e
         LEFT JOIN categories c ON e.category_id = c.id
         LEFT JOIN organizations o ON e.org_id = o.id
        WHERE e.id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
});

module.exports = router;


