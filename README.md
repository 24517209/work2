# Charity Events Website

A complete dynamic charity events website built with Node.js, Express, MySQL, and vanilla JavaScript.

## Features

### 🎯 Core Functionality
- **Event Management**: Create, read, update, and delete charity events
- **User Registration**: Users can register for events with validation
- **Admin Panel**: Complete administrative interface for event management
- **Weather Integration**: Display weather forecast for events with coordinates
- **Responsive Design**: Modern, mobile-friendly interface

### 🏗️ Architecture
- **Backend**: Node.js + Express RESTful API
- **Database**: MySQL with proper relationships and constraints
- **Frontend**: Vanilla JavaScript with DOM manipulation
- **Styling**: Modern CSS with dark theme

## Database Schema

### Events Table
```sql
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('upcoming', 'completed') DEFAULT 'upcoming',
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  ticket_count INT DEFAULT 1,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

## API Endpoints

### Public Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details with registrations
- `POST /api/registrations` - Register for an event

### Admin Endpoints
- `GET /api/admin/events` - Get all events (admin view)
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event (with validation)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd charity-events
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create database and tables
   mysql -u root -p < sql/schema.sql
   
   # Insert sample data
   mysql -u root -p < sql/seed.sql
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=charityevents_db
   PORT=3000
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the application**
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/index.html

## Usage Guide

### For Users
1. **Browse Events**: Visit the homepage to see upcoming events
2. **Search Events**: Use the search page to filter events by date, location, or keywords
3. **View Event Details**: Click on any event to see full details and registered participants
4. **Register for Events**: Click "Register for this Event" to sign up
5. **Weather Information**: Events with coordinates will show weather forecasts

### For Administrators
1. **Access Admin Panel**: Navigate to `/admin/index.html`
2. **Manage Events**: 
   - View all events in a grid layout
   - Add new events with optional coordinates for weather
   - Edit existing events
   - Delete events (only if no registrations exist)
3. **Event Validation**: The system prevents deletion of events with existing registrations

## Key Features Explained

### Business Logic
- **One Registration Per User Per Event**: Users cannot register multiple times for the same event
- **Event Deletion Protection**: Events with registrations cannot be deleted
- **Input Validation**: Both frontend and backend validation for all forms
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Weather Integration
- Uses Open-Meteo API (free, no API key required)
- Displays weather icons, temperature, and descriptions
- Only shows for events with valid coordinates
- Graceful fallback if weather data unavailable

### Security Features
- SQL injection prevention with parameterized queries
- XSS protection with HTML escaping
- Input validation and sanitization
- Proper error handling without information leakage

## File Structure

```
├── server/
│   ├── index.js              # Main server file
│   ├── db/
│   │   └── event_db.js       # Database connection
│   └── routes/
│       ├── events.js         # Public event routes
│       ├── admin.js          # Admin event routes
│       └── registrations.js  # Registration routes
├── public/
│   ├── index.html            # Homepage
│   ├── search.html           # Search page
│   ├── event-detail.html     # Event details page
│   ├── register.html         # Registration page
│   ├── admin/
│   │   ├── index.html        # Admin dashboard
│   │   ├── add-event.html    # Add event form
│   │   └── edit-event.html   # Edit event form
│   ├── js/
│   │   ├── home.js           # Homepage logic
│   │   ├── search.js         # Search functionality
│   │   ├── event-detail.js   # Event details logic
│   │   ├── register.js       # Registration logic
│   │   └── admin/
│   │       ├── admin-events.js
│   │       ├── add-event.js
│   │       └── edit-event.js
│   └── styles.css            # Main stylesheet
├── sql/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Sample data
└── package.json
```

## Testing the Application

1. **Start the server** and visit http://localhost:3000
2. **Browse events** on the homepage
3. **Search for events** using different filters
4. **View event details** and see registrations
5. **Register for an event** with the registration form
6. **Access admin panel** to manage events
7. **Test weather integration** with events that have coordinates

## Sample Data

The application comes with 10 sample events and 13 sample registrations covering various scenarios:
- Different event types (marathon, workshops, cleanup, etc.)
- Various locations across Australia
- Mix of upcoming and completed events
- Multiple registrations per event
- Events with and without coordinates for weather testing

## Browser Compatibility

- Modern browsers with ES6+ support
- Responsive design works on mobile and desktop
- No external dependencies for frontend (except weather API)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Feel free to use and modify as needed.