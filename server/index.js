const express = require('express');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');

const eventsRouter = require('./routes/events.js');
const categoriesRouter = require('./routes/categories.js');

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/categories', categoriesRouter);

// Static frontend
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Fallback to index.html for root
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


