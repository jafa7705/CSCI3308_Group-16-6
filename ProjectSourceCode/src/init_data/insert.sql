CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    hashedPassword TEXT;
BEGIN
    hashedPassword := crypt('hashedpassword1', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('alice', hashedPassword, 'alice@example.com', false, 'Painter based in NYC', 'http://aliceart.com', 'New York');

    hashedPassword := crypt('hashedpassword2', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('bob', hashedPassword, 'bob@example.com', true, 'Art collector', NULL, 'Los Angeles');

    hashedPassword := crypt('hashedpassword3', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('carla', hashedPassword, 'carla@example.com', false, 'Digital artist', 'http://carladraws.io', 'Austin');

    hashedPassword := crypt('hashedpassword4', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('dan', hashedPassword, 'dan@example.com', false, NULL, NULL, 'Chicago');

    hashedPassword := crypt('hashedpassword5', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('eva', hashedPassword, 'eva@example.com', true, NULL, NULL, 'Miami');

    hashedPassword := crypt('hashedpassword6', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('frank', hashedPassword, 'frank@example.com', false, 'Sculptor', NULL, 'Denver');

    hashedPassword := crypt('hashedpassword7', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('grace', hashedPassword, 'grace@example.com', false, NULL, NULL, 'Seattle');

    hashedPassword := crypt('hashedpassword8', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('henry', hashedPassword, 'henry@example.com', false, 'Animator', NULL, 'Boston');

    hashedPassword := crypt('hashedpassword9', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('irene', hashedPassword, 'irene@example.com', false, 'Pottery artist', NULL, 'San Diego');

    hashedPassword := crypt('hashedpassword10', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('jack', hashedPassword, 'jack@example.com', true, 'Gallery owner', NULL, 'San Francisco');
END $$;

INSERT INTO posts (user_id, title, date_created, description, category, tags) VALUES
(1, 'Sunset Dreams', '2024-01-05 15:00:00', 'An abstract sunset with warm tones.', 'Painting', 'sunset, abstract, warm'),
(2, 'City Reflections', '2023-11-12 09:30:00', 'Nighttime reflections in LA streets.', 'Photography', 'urban, night, reflections'),
(3, 'Fragments of Thought', '2024-02-20 11:15:00', 'A chaotic composition of shapes.', 'Digital Art', 'chaotic, geometric, experimental'),
(4, 'Bloom', '2024-03-10 14:45:00', 'Detailed study of a blooming flower.', 'Illustration', 'flowers, nature, spring'),
(5, 'The Last Light', '2023-12-01 17:20:00', 'A lonely mountain at dusk.', 'Painting', 'mountains, dusk, solitude'),
(6, 'Pixel Storm', '2024-01-18 08:00:00', 'A colorful digital storm.', 'Digital Art', 'pixel, color, glitch'),
(7, 'Form in Space', '2023-10-27 13:35:00', 'A 3D sculpture playing with shadows.', 'Sculpture', '3D, shadows, modern'),
(8, 'Collapse', '2024-02-14 10:10:00', 'Installation of falling chairs.', 'Installation', 'chairs, installation, gravity'),
(9, 'The Alleyway', '2023-11-30 19:00:00', 'Candid moment from city backstreets.', 'Photography', 'street, candid, black-and-white'),
(10, 'Waves of Color', '2024-03-05 16:40:00', 'Experimental visual series.', 'Painting', 'waves, experimental, vibrant');

INSERT INTO messages (sender_id, receiver_id, message_text, timestamp) VALUES
(1, 2, 'Hi Bob, I loved your collection!', '2024-03-15 10:00:00'),
(2, 1, 'Thanks Alice! Your paintings are amazing.', '2024-03-15 10:05:00'),
(3, 4, 'Dan, check out my latest digital piece.', '2024-03-16 12:00:00'),
(4, 3, 'Carla, it''s fantastic!', '2024-03-16 12:10:00'),
(5, 10, 'Jack, do you have any openings this week?', '2024-03-17 14:00:00'),
(10, 5, 'Eva, I have a slot on Thursday.', '2024-03-17 14:05:00'),
(6, 7, 'Grace, your work is inspiring!', '2024-03-18 16:00:00'),
(7, 6, 'Frank, thank you so much!', '2024-03-18 16:10:00'),
(8, 9, 'Irene, I really liked the photos of the alleyway', '2024-03-19 18:00:00'),
(9, 8, 'Henry, I am glad you liked them', '2024-03-19 18:05:00'),
(1, 4, 'Dan, are you working on any new illustrations?', '2024-03-20 09:00:00'),
(4, 1, 'Alice, I am working on a new series right now', '2024-03-20 09:10:00'),
(2, 3, 'Carla, what software do you use for your digital art?', '2024-03-21 11:00:00'),
(3, 2, 'Bob, I use procreate', '2024-03-21 11:10:00'),
(5, 6, 'Frank, I am thinking of commissioning a sculpture, are you avalible?', '2024-03-22 13:00:00'),
(6, 5, 'Eva, yes I am avalible, send me some details', '2024-03-22 13:10:00'),
(7, 8, 'Henry, I really liked your animations', '2024-03-23 15:00:00'),
(8, 7, 'Grace, thank you, I am working on a new one', '2024-03-23 15:10:00'),
(9, 10, 'Jack, do you know of any galleries that might be interested in my work?', '2024-03-24 17:00:00'),
(10, 9, 'Irene, I might know of a few, send me some photos', '2024-03-24 17:10:00');

-- Connections
INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'bob'), (SELECT user_id FROM users WHERE username = 'alice'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'eva'), (SELECT user_id FROM users WHERE username = 'carla'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'jack'), (SELECT user_id FROM users WHERE username = 'carla'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'jack'), (SELECT user_id FROM users WHERE username = 'frank'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'eva'), (SELECT user_id FROM users WHERE username = 'frank'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'irene'), (SELECT user_id FROM users WHERE username = 'grace'));
