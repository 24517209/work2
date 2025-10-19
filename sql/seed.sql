USE charityevents_db;

-- Insert sample events
INSERT INTO events (name, date, location, description, status, latitude, longitude) VALUES
('City Marathon for Health', '2025-01-15', 'Harbour Park, Sydney', 'Join us for a charity marathon to support local health clinics. All proceeds go to providing free medical care for underserved communities.', 'upcoming', -33.8688, 151.2093),
('Back-to-School Drive', '2025-01-20', 'Community Hall, Sydney', 'Help us collect school supplies and donations for children in need. We aim to provide backpacks, books, and stationery for 500 students.', 'upcoming', -33.8688, 151.2093),
('Tree Planting Day', '2025-01-12', 'Central Park, Melbourne', 'Volunteer event to plant 1000 trees in our city parks. Help us make Melbourne greener and combat climate change.', 'upcoming', -37.8136, 144.9631),
('Community Cleanup', '2025-01-05', 'Beachfront, Brisbane', 'Join us to clean the coastline and protect marine life. We will provide all necessary equipment and refreshments.', 'completed', -27.4698, 153.0251),
('Health Awareness Workshop', '2025-01-25', 'City Clinic, Adelaide', 'Free health checkups and educational workshops. Doctors and nurses will provide basic health screenings and health education.', 'upcoming', -34.9285, 138.6007),
('Coding for Kids', '2025-01-18', 'Tech Hub, Perth', 'Introduction to programming for children aged 8-12. Learn basic coding concepts through fun games and projects.', 'upcoming', -31.9505, 115.8605),
('Recycling Fair', '2025-01-10', 'Exhibition Centre, Canberra', 'Learn about recycling and sustainable living. Workshops, stalls, and demonstrations on how to reduce waste and protect the environment.', 'upcoming', -35.2809, 149.1300),
('Neighborhood Food Drive', '2025-01-22', 'Town Square, Hobart', 'Collect and distribute food items to local food banks. Help us fight hunger in our community.', 'upcoming', -42.8821, 147.3272),
('Art Therapy Session', '2025-01-28', 'Community Center, Darwin', 'Creative art therapy sessions for mental health support. All materials provided, no experience necessary.', 'upcoming', -12.4634, 130.8456),
('Senior Citizens Lunch', '2025-01-30', 'Senior Center, Gold Coast', 'Free lunch and social gathering for senior citizens. Help us combat loneliness and provide nutritious meals.', 'upcoming', -28.0167, 153.4000);

-- Insert sample registrations (at least 10 as required)
INSERT INTO registrations (event_id, user_name, email, phone, ticket_count, registration_date) VALUES
(1, 'Alice Johnson', 'alice.johnson@email.com', '0412345678', 2, '2025-01-01 10:00:00'),
(1, 'Bob Smith', 'bob.smith@email.com', '0423456789', 1, '2025-01-01 11:30:00'),
(2, 'Carol Davis', 'carol.davis@email.com', '0434567890', 3, '2025-01-02 09:15:00'),
(2, 'David Wilson', 'david.wilson@email.com', '0445678901', 1, '2025-01-02 14:20:00'),
(3, 'Emma Brown', 'emma.brown@email.com', '0456789012', 2, '2025-01-03 08:45:00'),
(3, 'Frank Miller', 'frank.miller@email.com', '0467890123', 1, '2025-01-03 16:30:00'),
(4, 'Grace Lee', 'grace.lee@email.com', '0478901234', 4, '2024-12-28 12:00:00'),
(5, 'Henry Taylor', 'henry.taylor@email.com', '0489012345', 1, '2025-01-04 10:15:00'),
(6, 'Ivy Chen', 'ivy.chen@email.com', '0490123456', 2, '2025-01-05 13:45:00'),
(7, 'Jack Anderson', 'jack.anderson@email.com', '0401234567', 1, '2025-01-06 15:20:00'),
(8, 'Kate Thompson', 'kate.thompson@email.com', '0412345679', 3, '2025-01-07 11:10:00'),
(9, 'Liam O\'Connor', 'liam.oconnor@email.com', '0423456780', 1, '2025-01-08 09:30:00'),
(10, 'Maya Patel', 'maya.patel@email.com', '0434567891', 2, '2025-01-09 14:00:00');


