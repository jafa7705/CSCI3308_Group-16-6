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