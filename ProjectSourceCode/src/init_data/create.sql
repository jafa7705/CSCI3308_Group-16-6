DROP TABLE IF EXISTS users;
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  isClient BOOLEAN NOT NULL, --if we want to revert: role VARCHAR(20) NOT NULL CHECK (role IN ('artist', 'client')),
  bio TEXT,
  website VARCHAR(200),
  location VARCHAR(100),
  phone VARCHAR(20)
);

DROP TABLE IF EXISTS artworks;
CREATE TABLE artworks (
  artwork_id SERIAL PRIMARY KEY,
  artist_id INTEGER NOT NULL REFERENCES users (user_id),
  title VARCHAR(100) NOT NULL,
  creation_date DATE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL
  -- TODO: Add a key to store the image and the text.
);
