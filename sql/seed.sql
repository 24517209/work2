USE charityevents_db;

INSERT INTO organizations (name, description, website) VALUES
('Hope Foundation', 'Supporting local communities with essential services', 'https://hope.example.org'),
('Green Earth', 'Environmental protection and awareness', 'https://green.example.org');

INSERT INTO categories (name) VALUES
('Health'), ('Education'), ('Environment'), ('Community');

-- 8 sample events
INSERT INTO events (
  org_id, category_id, name, description_short, description_long, city, venue, address,
  start_datetime, end_datetime, ticket_price, is_free, fund_goal, fund_raised, is_hidden
) VALUES
(1, 1, 'City Marathon for Health', 'Run to support local clinics', 'Full marathon with charity fundraising', 'Sydney', 'Harbour Park', '1 Harbour St', NOW() + INTERVAL 5 DAY, NOW() + INTERVAL 5 DAY + INTERVAL 4 HOUR, 25.00, 0, 10000.00, 2500.00, 0),
(1, 2, 'Back-to-School Drive', 'Provide supplies for students', 'Collecting supplies and donations', 'Sydney', 'Community Hall', '10 Main Rd', NOW() + INTERVAL 10 DAY, NOW() + INTERVAL 10 DAY + INTERVAL 2 HOUR, 0.00, 1, 5000.00, 1200.00, 0),
(2, 3, 'Tree Planting Day', 'Plant trees in city parks', 'Volunteer event to plant 1000 trees', 'Melbourne', 'Central Park', '22 Park Ave', NOW() + INTERVAL 2 DAY, NOW() + INTERVAL 2 DAY + INTERVAL 6 HOUR, 0.00, 1, 3000.00, 800.00, 0),
(2, 4, 'Community Cleanup', 'Clean local beaches', 'Join us to clean the coastline', 'Brisbane', 'Beachfront', '5 Ocean Dr', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 3 HOUR, 0.00, 1, 2000.00, 2000.00, 0),
(1, 1, 'Health Awareness Workshop', 'Free health checkups', 'Doctors provide checkups and talks', 'Adelaide', 'City Clinic', '12 Health St', NOW() + INTERVAL 20 DAY, NOW() + INTERVAL 20 DAY + INTERVAL 3 HOUR, 0.00, 1, 1500.00, 300.00, 0),
(1, 2, 'Coding for Kids', 'Teach programming basics', 'Intro to coding for children', 'Perth', 'Tech Hub', '88 Code Ln', NOW() + INTERVAL 15 DAY, NOW() + INTERVAL 15 DAY + INTERVAL 2 HOUR, 10.00, 0, 2500.00, 400.00, 0),
(2, 3, 'Recycling Fair', 'Learn about recycling', 'Workshops and stalls on recycling', 'Canberra', 'Exhibition Centre', '77 Green Rd', NOW() + INTERVAL 1 DAY, NOW() + INTERVAL 1 DAY + INTERVAL 8 HOUR, 5.00, 0, 1800.00, 500.00, 1),
(2, 4, 'Neighborhood Food Drive', 'Support food banks', 'Collect and distribute food items', 'Hobart', 'Town Square', '3 Market St', NOW() + INTERVAL 8 DAY, NOW() + INTERVAL 8 DAY + INTERVAL 5 HOUR, 0.00, 1, 2200.00, 600.00, 0);


