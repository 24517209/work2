const { Router } = require('express');
const { query } = require('../db/event_db.js');

const router = Router();

// GET /api/events - get all events
router.get('/', async (_req, res) => {
  try {
    const rows = await query(
      `SELECT id, name, date, location, description, status, latitude, longitude
       FROM events
       ORDER BY date ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - get event details with registrations
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Get event details
    const eventRows = await query(
      `SELECT id, name, date, location, description, status, latitude, longitude
       FROM events
       WHERE id = ?`,
      [id]
    );
    
    if (!eventRows.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Get registrations for this event
    const registrationRows = await query(
      `SELECT user_name, email, phone, ticket_count, registration_date
       FROM registrations
       WHERE event_id = ?
       ORDER BY registration_date DESC`,
      [id]
    );
    
    res.json({
      event: eventRows[0],
      registrations: registrationRows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
});

module.exports = router;


