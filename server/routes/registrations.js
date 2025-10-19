const { Router } = require('express');
const { query } = require('../db/event_db.js');

const router = Router();

// POST /api/registrations - create new registration
router.post('/', async (req, res) => {
  try {
    const { event_id, user_name, email, phone, ticket_count } = req.body;
    
    // Validate required fields
    if (!event_id || !user_name || !email) {
      return res.status(400).json({ error: 'Event ID, user name, and email are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check if event exists
    const event = await query(
      'SELECT id, name FROM events WHERE id = ?',
      [event_id]
    );
    
    if (!event.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if user already registered for this event
    const existingRegistration = await query(
      'SELECT id FROM registrations WHERE event_id = ? AND email = ?',
      [event_id, email]
    );
    
    if (existingRegistration.length > 0) {
      return res.status(400).json({ 
        error: 'You have already registered for this event' 
      });
    }
    
    // Create registration
    const result = await query(
      `INSERT INTO registrations (event_id, user_name, email, phone, ticket_count)
       VALUES (?, ?, ?, ?, ?)`,
      [event_id, user_name, email, phone || null, ticket_count || 1]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Registration successful',
      event_name: event[0].name
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create registration' });
  }
});

module.exports = router;
