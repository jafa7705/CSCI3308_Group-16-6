CREATE EXTENSION pgcrypto;

-- Drop existing tables if they exist (safe for re-runs during dev)
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  isClient BOOLEAN DEFAULT FALSE,
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
