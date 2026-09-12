-- ==========================================================
-- CampusFind — Cloud-Based Campus Lost & Found System
-- Database Schema (PostgreSQL DDL)
-- ==========================================================

-- Drop existing tables in reverse-dependency order for safe re-runs
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(150) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(10) NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('STUDENT', 'ADMIN')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Items Table
-- Note: Images are NOT stored directly in the database.
-- Only Cloudinary image_url and image_public_id are stored here.
CREATE TABLE items (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(150) NOT NULL,
  description     TEXT,
  type            VARCHAR(5) NOT NULL CHECK (type IN ('LOST', 'FOUND')),
  location        VARCHAR(150) NOT NULL,
  item_date       DATE NOT NULL,
  status          VARCHAR(10) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLAIMED', 'RETURNED')),
  image_url       TEXT,
  image_public_id TEXT,
  category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Claims Table
CREATE TABLE claims (
  id             SERIAL PRIMARY KEY,
  item_id        INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message        TEXT NOT NULL,
  status         VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (item_id, user_id)
);

-- 5. Performance Indexes
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_claims_item_id ON claims(item_id);
