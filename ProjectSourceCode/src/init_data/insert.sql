-- Insert 10 users
INSERT INTO users (username, password, email, isClient, bio, website, location, phone) VALUES
('alice', 'password123', 'alice@example.com', true, 'Painter based in NYC.', 'http://aliceart.com', 'New York, NY', '123-456-7890'),
('bob', 'password456', 'bob@example.com', false, 'Photographer from LA.', 'http://bobphotos.com', 'Los Angeles, CA', '987-654-3210'),
('charlie', 'charliepass', 'charlie@example.com', true, 'Abstract artist.', 'http://charliecreates.com', 'Chicago, IL', '555-555-5555'),
('diana', 'diana321', 'diana@example.com', true, 'Digital illustrator.', 'http://dianaillustrates.com', 'Seattle, WA', '111-222-3333'),
('eric', 'passeric', 'eric@example.com', false, 'Concept artist and animator.', 'http://ericconcepts.com', 'Austin, TX', '444-333-2222'),
('frank', 'frankpass', 'frank@example.com', true, 'Printmaker from Denver.', 'http://frankprints.com', 'Denver, CO', '777-888-9999'),
('grace', 'grace123', 'grace@example.com', false, 'Sculptor and 3D artist.', 'http://gracesculpts.com', 'Portland, OR', '666-777-8888'),
('henry', 'henrypass', 'henry@example.com', true, 'Installation artist.', 'http://henryinstalls.com', 'Boston, MA', '333-222-1111'),
('irene', 'irene777', 'irene@example.com', false, 'Street photographer.', 'http://irenephotos.com', 'San Diego, CA', '888-999-0000'),
('jack', 'jack1234', 'jack@example.com', true, 'Modern visual artist.', 'http://jackvisual.com', 'Miami, FL', '999-111-2222');

-- Insert 10 artworks
INSERT INTO artworks (artist_id, title, creation_date, description, category, image_path) VALUES
(1, 'Sunset Dreams', '2024-01-05', 'An abstract sunset with warm tones.', 'Painting', '/artworks/artwork1.jpg'),
(2, 'City Reflections', '2023-11-12', 'Nighttime reflections in LA streets.', 'Photography', '/artworks/artwork2.jpg'),
(3, 'Fragments of Thought', '2024-02-20', 'A chaotic composition of shapes.', 'Digital Art', '/artworks/artwork3.jpg'),
(4, 'Bloom', '2024-03-10', 'Detailed study of a blooming flower.', 'Illustration', '/artworks/artwork4.jpg'),
(5, 'The Last Light', '2023-12-01', 'A lonely mountain at dusk.', 'Painting', '/artworks/artwork5.jpg'),
(6, 'Pixel Storm', '2024-01-18', 'A colorful digital storm.', 'Digital Art', '/artworks/artwork6.jpg'),
(7, 'Form in Space', '2023-10-27', 'A 3D sculpture playing with shadows.', 'Sculpture', '/artworks/artwork7.jpg'),
(8, 'Collapse', '2024-02-14', 'Installation of falling chairs.', 'Installation', '/artworks/artwork8.jpg'),
(9, 'The Alleyway', '2023-11-30', 'Candid moment from city backstreets.', 'Photography', '/artworks/artwork9.jpg'),
(10, 'Waves of Color', '2024-03-05', 'Experimental visual series.', 'Painting', '/artworks/artwork10.jpg');