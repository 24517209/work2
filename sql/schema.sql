-- Create database and tables
CREATE DATABASE IF NOT EXISTS charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;

-- Create events table with simplified structure as per requirements
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

-- Create registrations table
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


