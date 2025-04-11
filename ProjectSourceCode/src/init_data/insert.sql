-- Insert 10 sample users
INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES
('alice', 'hashedpassword1', 'alice@example.com', false, 'Painter based in NYC', 'http://aliceart.com', 'New York'),
('bob', 'hashedpassword2', 'bob@example.com', true, 'Art collector', NULL, 'Los Angeles'),
('carla', 'hashedpassword3', 'carla@example.com', false, 'Digital artist', 'http://carladraws.io', 'Austin'),
('dan', 'hashedpassword4', 'dan@example.com', false, NULL, NULL, 'Chicago'),
('eva', 'hashedpassword5', 'eva@example.com', true, NULL, NULL, 'Miami'),
('frank', 'hashedpassword6', 'frank@example.com', false, 'Sculptor', NULL, 'Denver'),
('grace', 'hashedpassword7', 'grace@example.com', false, NULL, NULL, 'Seattle'),
('henry', 'hashedpassword8', 'henry@example.com', false, 'Animator', NULL, 'Boston'),
('irene', 'hashedpassword9', 'irene@example.com', false, 'Pottery artist', NULL, 'San Diego'),
('jack', 'hashedpassword10', 'jack@example.com', true, 'Gallery owner', NULL, 'San Francisco');

-- Insert 10 sample posts with full timestamps
INSERT INTO posts (user_id, title, date_created, description, category) VALUES
(1, 'Sunset Dreams', '2024-01-05 15:00:00', 'An abstract sunset with warm tones.', 'Painting'),
(2, 'City Reflections', '2023-11-12 09:30:00', 'Nighttime reflections in LA streets.', 'Photography'),
(3, 'Fragments of Thought', '2024-02-20 11:15:00', 'A chaotic composition of shapes.', 'Digital Art'),
(4, 'Bloom', '2024-03-10 14:45:00', 'Detailed study of a blooming flower.', 'Illustration'),
(5, 'The Last Light', '2023-12-01 17:20:00', 'A lonely mountain at dusk.', 'Painting'),
(6, 'Pixel Storm', '2024-01-18 08:00:00', 'A colorful digital storm.', 'Digital Art'),
(7, 'Form in Space', '2023-10-27 13:35:00', 'A 3D sculpture playing with shadows.', 'Sculpture'),
(8, 'Collapse', '2024-02-14 10:10:00', 'Installation of falling chairs.', 'Installation'),
(9, 'The Alleyway', '2023-11-30 19:00:00', 'Candid moment from city backstreets.', 'Photography'),
(10, 'Waves of Color', '2024-03-05 16:40:00', 'Experimental visual series.', 'Painting');
