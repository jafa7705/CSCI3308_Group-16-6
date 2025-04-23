CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    hashedPassword TEXT;
BEGIN
    hashedPassword := crypt('hashedpassword1', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Alice_Wonder', hashedPassword, 'alice@example.com', false, 'Painter based in NYC', 'http://aliceart.com', 'New York, New York','alicePic.jpg');

    hashedPassword := crypt('hashedpassword2', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location,profile_image) VALUES ('Bob_Marley', hashedPassword, 'bob@example.com', true, 'Art collector', NULL, 'Los Angeles, California', 'bobPic.jpg');

    hashedPassword := crypt('hashedpassword3', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Carla_Gugino', hashedPassword, 'carla@example.com', false, 'Digital artist', 'http://carladraws.io', 'Austin, Texas', 'carlaPic.jpg');

    hashedPassword := crypt('hashedpassword4', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Dan_Stan', hashedPassword, 'dan@example.com', false, NULL, NULL, 'Chicago, Illinois', 'dan.jpg');

    hashedPassword := crypt('hashedpassword5', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Eva_Steller', hashedPassword, 'eva@example.com', true, NULL, NULL, 'Miami, Florida', 'evastel.jpg');

    hashedPassword := crypt('hashedpassword6', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Frank_Arren', hashedPassword, 'frank@example.com', false, 'Painter', NULL, 'Denver, Colorado', 'frank.jpeg');

    hashedPassword := crypt('hashedpassword7', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Bob_Ross', hashedPassword, 'bobRoss@example.com', false, 'We do not make mistakes, just happy little accidents', 'bobross.com', 'Orlando, Florida', 'bobRoss.jpg');

    hashedPassword := crypt('hashedpassword8', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Takashi_Murakami', hashedPassword, 'murakami@example.com', false, 'We want to see the newest things. That is because we want to see the future if only momentarily.', 'popart.com', 'Tokyo, Japan', 'murakami.jpg');

    hashedPassword := crypt('hashedpassword9', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Demo_Artist', hashedPassword, 'irene@example.com', false, 'I am a ceramic artist crafting functional, earthy pottery inspired by nature and simple moments. Each piece is handmade with care — designed to be used, loved, and part of your daily rituals.', 'ArtistPottery.com', 'San Diego', 'sampleArtist.jpg');

    hashedPassword := crypt('hashedpassword10', gen_salt('bf'));
    INSERT INTO users (username, password, email, isClient, bio, website, location, profile_image) VALUES ('Demo_Employer', hashedPassword, 'jack@example.com', true, 'I am the owner and curator of Lumen Gallery, a space dedicated to showcasing emerging and established artists across a range of mediums. With a passion for storytelling through visual art, I strive to create exhibitions that inspire conversation, connection, and curiosity.', 'LumenGallery.com', 'San Francisco', 'employer.jpg');
END $$;

INSERT INTO posts (user_id, title, date_created, description, tags, image) VALUES
(1, 'A Cloud Study, Sunset', '2024-03-10 14:45:00', 'By John Constable, ca.1821 ', 'Oil Painting', 'sunset.png'),
(2, 'Buffalo Trail','2024-03-05 16:40:00', 'The Impending Storm, 1869, by Albert Bierstadt', 'Oil Painting', 'buffalo.png'),
(2, 'Fujimigahara in Owari Province', '2024-02-20 11:15:00', 'By Katsushika Hokusai, ca. 1830-32,  from the series Thirty-six Views of Mount Fuji', 'Ink', 'owari.png'),
(4, 'Poseidon, Apollo, and Artemis, east Parthenon Frieze', '2024-01-05 15:00:00', 'Greek sculpture by Phidias, 447-32 BC', 'Sculpture', 'greek.jpg'),
(5, 'Nepal Tiger Tops','2023-11-12 09:30:00', 'By George Silk, 1972, Katmandu looking northeast to the Himalayas.', 'Photography', 'nepal.png'),
(5, 'Untitled', '2024-01-18 08:00:00', 'By George Silk, 1962, Prince Philip at helm of his yawl, Bloodhound, during Cowes Regatta.', 'Photography', 'boat.png'),
(3, 'Snowy', '2023-10-27 13:35:00', 'By Brian Edward Miller, a beautiful landscape of snowy ranges.', 'Digital Art', 'snowy.png'),
(6, 'Caipira', '2024-02-14 10:10:00', 'Installation of falling chairs.', 'Painting', 'caipira.png'),
(6, 'The Spanish Landscape', '2023-01-14 10:10:00', 'A landscape of Spain.', 'Painting', 'spanish.jpg'),
(6, 'Footsteps', '2022-02-14 10:10:00', 'Spanish art by David Noalia', 'Painting', 'footstep.jpg'),
(9, 'Amaryllis Twists Ceramic Pottery Vase', '2023-11-30 19:00:00', 'The Amaryllis Twists Vase reinterprets the twisting buds and elegant form of the long-retired Ephraim Pottery Perennial Vase.', 'Pottery', 'leaf.png'),
(9, 'Acorn and Oak Ceramic Pottery Vase', '2023-12-01 17:20:00', 'A simple bowing oak branch bends at the rim of this sweet vase.', 'Pottery', 'vase.png'),
(9, 'Wave', '2023-11-01 12:16:00', 'An intricate wave representation.', 'Pottery', 'wave.jpg'),
(9, 'Earthy Teapot', '2020-11-01 12:16:00', 'An intricate teapot with Earth motifs.', 'Pottery', 'tea.jpg'),
(9, 'The Red Teapot', '2023-11-01 12:16:00', 'An intricate teapot with Red earth motifs.', 'Pottery', 'redtea.jpg'),
(10, 'Bounded by Light', '2024-12-01 9:20:00', 'An abstract landscape.', 'Painting', 'abstract.jpg'),
(10, 'Spectacle of Fancy', '2020-5-01 6:24:00', 'Abstract cascade of colors.', 'Painting', 'abstract2.jpg'),
(10, 'Air', '2023-5-01 6:24:00', 'Arifah Aronson depiction of air.', 'Painting', 'air.jpg'),
(7, 'Mountain Retreat', '2021-5-01 6:24:00', 'Apart of the happy accidents collection', 'Painting', 'retreat.jpg'),
(8, 'Monsterized', '2021-5-01 3:24:00', 'Displayed in the Asian Art Museum', 'Pop Art', 'monster.jpg'),
(7, 'Winter Frost', '2024-5-01 3:24:00', 'Happy Trees', 'Painting', 'winterFrost.jpg');




INSERT INTO messages (sender_id, receiver_id, message_text, timestamp) VALUES
(1, 2, 'Hi Bob, I loved your collection!', '2024-03-15 10:00:00'),
(2, 1, 'Thanks Alice! Your paintings are amazing.', '2024-03-15 10:05:00'),
(3, 4, 'Dan, check out my latest digital piece.', '2024-03-16 12:00:00'),
(4, 3, 'Carla, it''s fantastic!', '2024-03-16 12:10:00'),
(5, 10, 'Jack, do you have any openings this week?', '2024-03-17 14:00:00'),
(10, 5, 'Eva, I have a slot on Thursday.', '2024-03-17 14:05:00'),
(6, 7, 'Bob, your work is inspiring!', '2024-03-18 16:00:00'),
(7, 6, 'Frank, thank you so much!', '2024-03-18 16:10:00'),
(8, 9, 'Irene, I really liked monster feature!', '2024-03-19 18:00:00'),
(9, 8, 'Takashi, I am glad you liked them', '2024-03-19 18:05:00'),
(1, 4, 'Dan, are you working on any new illustrations?', '2024-03-20 09:00:00'),
(4, 1, 'Alice, I am working on a new series right now', '2024-03-20 09:10:00'),
(2, 3, 'Carla, what software do you use for your digital art?', '2024-03-21 11:00:00'),
(3, 2, 'Bob, I use procreate', '2024-03-21 11:10:00'),
(5, 6, 'Frank, I am thinking of commissioning a sculpture, are you avalible?', '2024-03-22 13:00:00'),
(6, 5, 'Eva, yes I am avalible, send me some details', '2024-03-22 13:10:00'),
(7, 8, 'Takashi, I really liked your paintings', '2024-03-23 15:00:00'),
(8, 7, 'Bob, thank you, I am working on a new one', '2024-03-23 15:10:00'),
(8, 9, 'Your pottery has such a unique, grounded quality, Irene. I especially admire the "Earthy Teapot."', '2024-03-25 10:30:00'),
(9, 8, 'Takashi, that is very kind of you to say. I find inspiration in the simple forms of nature.', '2024-03-25 10:45:00'),
(8, 9, 'The way you interpret those forms in clay is quite compelling. Do you often exhibit your work in San Diego?', '2024-03-26 14:00:00'),
(9, 8, 'I do show my pieces at a few local galleries and markets. It''s always a joy to connect with people who appreciate handmade objects.', '2024-03-26 14:15:00'),
(8, 9, 'Perhaps one day my Superflat flowers could find a happy home alongside your earthy creations in an exhibition.', '2024-03-27 11:00:00'),
(9, 8, 'Oh, that would be a fascinating juxtaposition, Takashi! I can imagine the vibrant energy of your work contrasting beautifully with the textures of my pottery.', '2024-03-27 11:20:00'),
(8, 9, 'Indeed! Different worlds, perhaps, but both striving for a certain emotional resonance. Do you ever experiment with glazes that have a more... unexpected color palette?', '2024-03-28 16:45:00'),
(9, 8, 'That''s an interesting thought. I tend to stick to more natural, muted tones, but I''ve been considering exploring some brighter, more playful glazes. Your work is definitely inspiring me to think outside my usual palette!', '2024-03-28 17:00:00'),
(8, 9, 'Excellent! Embrace the unexpected. Sometimes the happiest accidents lead to the most intriguing results. Keep creating, Irene!', '2024-03-29 09:30:00'),
(9, 8, 'Thank you for the encouragement, Takashi! Your perspective is truly appreciated.', '2024-03-29 09:40:00');

-- Connections
INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Bob_Marley'), (SELECT user_id FROM users WHERE username = 'Alice_Wonder'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Bob_Marley'), (SELECT user_id FROM users WHERE username = 'Carla_Gugino'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Eva_Steller'), (SELECT user_id FROM users WHERE username = 'Carla_Gugino'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Bob_Ross'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Alice_Wonder'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Demo_Artist'));

INSERT INTO connections (employer_id, artist_id) 
VALUES ((SELECT user_id FROM users WHERE username = 'Demo_Employer'), (SELECT user_id FROM users WHERE username = 'Takashi_Murakami'));

INSERT INTO connections (employer_id, artist_id, status)
VALUES ((SELECT user_id FROM users WHERE username = 'Takashi_Murakami'), (SELECT user_id FROM users WHERE username = 'Demo_Artist'), 'accepted');