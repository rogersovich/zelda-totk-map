-- Cloudflare D1 Database Schema for Zelda: Tears of the Kingdom Interactive Map
-- Run this migration in your Cloudflare D1 database:
-- wrangler d1 execute totk-map-db --file=./schema.sql

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. User State Storage (JSON blobs for flexibility and speed)
CREATE TABLE IF NOT EXISTS user_states (
  user_id TEXT PRIMARY KEY,
  completed_items TEXT NOT NULL DEFAULT '{}',
  custom_pins TEXT NOT NULL DEFAULT '[]',
  settings TEXT NOT NULL DEFAULT '{}',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for ultra-fast lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_token ON users(token);
CREATE INDEX IF NOT EXISTS idx_user_states_user_id ON user_states(user_id);
