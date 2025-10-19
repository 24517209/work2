const { Router } = require('express');
const { query } = require('../db/event_db.js');

const router = Router();

// GET /api/admin/events - get all events for admin
router.get('/events', async (_req, res) => {
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

// POST /api/admin/events - create new event
router.post('/events', async (req, res) => {
  try {
    const { name, date, location, description, status, latitude, longitude } = req.body;
    
    // Validate required fields
    if (!name || !date || !location) {
      return res.status(400).json({ error: 'Name, date, and location are required' });
    }
    
    const result = await query(
      `INSERT INTO events (name, date, location, description, status, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, date, location, description || null, status || 'upcoming', latitude || null, longitude || null]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Event created successfully' 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to create event' });
  }
});

// PUT /api/admin/events/:id - update event
router.put('/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, date, location, description, status, latitude, longitude } = req.body;
    
    // Check if event exists
    const existingEvent = await query(
      'SELECT id FROM events WHERE id = ?',
      [id]
    );
    
    if (!existingEvent.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Build dynamic update query
    const updates = [];
    const params = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (date !== undefined) {
      updates.push('date = ?');
      params.push(date);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      params.push(location);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (latitude !== undefined) {
      updates.push('latitude = ?');
      params.push(latitude);
    }
    if (longitude !== undefined) {
      updates.push('longitude = ?');
      params.push(longitude);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(id);
    
    await query(
      `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/admin/events/:id - delete event
router.delete('/events/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Check if event exists
    const existingEvent = await query(
      'SELECT id FROM events WHERE id = ?',
      [id]
    );
    
    if (!existingEvent.length) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check if event has registrations
    const registrations = await query(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ?',
      [id]
    );
    
    if (registrations[0].count > 0) {
      return res.status(400).json({ 
        error: '该活动已有用户注册，无法删除' 
      });
    }
    
    // Delete the event
    await query('DELETE FROM events WHERE id = ?', [id]);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
