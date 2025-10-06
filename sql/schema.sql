-- Create database and tables
CREATE DATABASE IF NOT EXISTS charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  website VARCHAR(255)
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT,
  name VARCHAR(200) NOT NULL,
  description_short VARCHAR(300),
  description_long TEXT,
  city VARCHAR(120),
  venue VARCHAR(200),
  address VARCHAR(255),
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  ticket_price DECIMAL(10,2) DEFAULT 0,
  is_free TINYINT(1) DEFAULT 0,
  fund_goal DECIMAL(12,2) DEFAULT 0,
  fund_raised DECIMAL(12,2) DEFAULT 0,
  is_hidden TINYINT(1) DEFAULT 0,
  CONSTRAINT fk_events_org FOREIGN KEY (org_id) REFERENCES organizations(id),
  CONSTRAINT fk_events_cat FOREIGN KEY (category_id) REFERENCES categories(id)
);


