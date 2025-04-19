CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    hashedPassword TEXT;
BEGIN
    hashedPassword := crypt('hashedpassword1', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Alice_Wonder', hashedPassword, 'alice@example.com', false, 'Painter based in NYC', 'http://aliceart.com', 'New York');

    hashedPassword := crypt('hashedpassword2', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Bob_Marley', hashedPassword, 'bob@example.com', true, 'Art collector', NULL, 'Los Angeles');

    hashedPassword := crypt('hashedpassword3', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Carla_Gugino', hashedPassword, 'carla@example.com', false, 'Digital artist', 'http://carladraws.io', 'Austin');

    hashedPassword := crypt('hashedpassword4', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Dan_Stan', hashedPassword, 'dan@example.com', false, NULL, NULL, 'Chicago');

    hashedPassword := crypt('hashedpassword5', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Eva_Steller', hashedPassword, 'eva@example.com', true, NULL, NULL, 'Miami');

    hashedPassword := crypt('hashedpassword6', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Frank_Devito', hashedPassword, 'frank@example.com', false, 'Sculptor', NULL, 'Denver');

    hashedPassword := crypt('hashedpassword7', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Grace_Kennedy', hashedPassword, 'grace@example.com', false, NULL, NULL, 'Seattle');

    hashedPassword := crypt('hashedpassword8', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Henry_Haden', hashedPassword, 'henry@example.com', false, 'Animator', NULL, 'Boston');

    hashedPassword := crypt('hashedpassword9', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Demo_Artist', hashedPassword, 'artist@example.com', false, 'I’m a ceramic artist crafting functional, earthy pottery inspired by nature and simple moments. Each piece is handmade with care — designed to be used, loved, and part of your daily rituals.', NULL, 'San Diego');

    hashedPassword := crypt('hashedpassword10', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location) VALUES ('Demo_Employer', hashedPassword, 'employer@example.com', true, 'I’m the owner and curator of Lumen Gallery, a space dedicated to showcasing emerging and established artists across a range of mediums. With a passion for storytelling through visual art, I strive to create exhibitions that inspire conversation, connection, and curiosity.', NULL, 'San Francisco');
END $$;

INSERT INTO posts (user_id, title, date_created, description, tags, image) VALUES
(1, 'A Cloud Study, Sunset', '2024-03-10 14:45:00', 'By John Constable, ca.1821 ', 'Oil Painting', 'sunset.png'),
(2, 'Buffalo Trail','2024-03-05 16:40:00', 'The Impending Storm, 1869, by Albert Bierstadt', 'Oil Painting', 'buffalo.png'),
(3, 'Fujimigahara in Owari Province', '2024-02-20 11:15:00', 'By Katsushika Hokusai, ca. 1830-32,  from the series Thirty-six Views of Mount Fuji', 'Ink', 'owari.png'),
(4, 'Poseidon, Apollo, and Artemis, east Parthenon Frieze', '2024-01-05 15:00:00', 'Greek sculpture by Phidias, 447-32 BC', 'Sculpture', 'greek.jpg'),
(5, 'Nepal Tiger Tops','2023-11-12 09:30:00', 'By George Silk, 1972, Katmandu looking northeast to the Himalayas.', 'Photography', 'nepal.png'),
(5, 'Untitled', '2024-01-18 08:00:00', 'By George Silk, 1962, Prince Philip at helm of his yawl, Bloodhound, during Cowes Regatta.', 'Photography', 'boat.png'),
(7, 'Snowy', '2023-10-27 13:35:00', 'By Brian Edward Miller, a beautiful landscape of snowy ranges.', 'Digital Art', 'snowy.png'),
(8, 'Caipira', '2024-02-14 10:10:00', 'Installation of falling chairs.', 'Painting', 'caipira.png'),
(9, 'Amaryllis Twists Ceramic Pottery Vase', '2023-11-30 19:00:00', 'The Amaryllis Twists Vase reinterprets the twisting buds and elegant form of the long-retired Ephraim Pottery Perennial Vase.', 'Pottery', 'leaf.png'),
(9, 'Acorn and Oak Ceramic Pottery Vase', '2023-12-01 17:20:00', 'A simple bowing oak branch bends at the rim of this sweet vase.', 'Pottery', 'vase.png');

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
VALUES ((SELECT user_id FROM users WHERE username = 'Bob_Marley'), (SELECT user_id FROM users WHERE username = 'Alice_Wonder'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Bob_Marley'), (SELECT user_id FROM users WHERE username = 'Carla_Gugino'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Eva_Steller'), (SELECT user_id FROM users WHERE username = 'Carla_Gugino'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Frank_Devito'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Alice_Wonder'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Demo_Artist'));
