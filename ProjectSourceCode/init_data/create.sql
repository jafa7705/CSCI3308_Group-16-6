-- Drop tables if they exist (for clean re-runs during development)
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
  location TEXT
);

-- Create posts table
CREATE TABLE posts (
  post_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_created DATE NOT NULL,
  category TEXT NOT NULL
);
