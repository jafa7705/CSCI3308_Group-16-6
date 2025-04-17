CREATE EXTENSION pgcrypto;

-- Drop existing tables if they exist (safe for re-runs during dev)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS messages;

-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  isclient BOOLEAN DEFAULT FALSE,
  bio TEXT,
  website TEXT,
  location TEXT,
  profile_image VARCHAR(200)
);

-- Create posts table with TIMESTAMP for full date + time
CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  category TEXT NOT NULL,
  image VARCHAR(200)
);

-- Messages Table
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Connection Requests Table
CREATE TABLE connections (
  connection_id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  -- defines foreign key relationship to users table
  artist_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  -- same as before but through artist instead
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  -- CHECK sees that status only has one of the three values
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);