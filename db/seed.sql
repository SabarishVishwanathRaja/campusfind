-- ==========================================================
-- CampusFind — Seed Data
-- ==========================================================

-- Clean tables before seeding (users cascade to items and claims)
TRUNCATE TABLE claims, items, categories, users RESTART IDENTITY CASCADE;

-- 1. Insert Categories (6 categories)
INSERT INTO categories (id, name) VALUES
  (1, 'Electronics'),
  (2, 'Books'),
  (3, 'ID Cards'),
  (4, 'Accessories'),
  (5, 'Documents'),
  (6, 'Other');
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- 2. Insert Users (1 Admin, 3 Students)
-- Passwords verified with bcryptjs cost 10:
-- admin@campusfind.edu  -> Admin@123
-- arjun@student.edu      -> Student@123
-- priya@student.edu      -> Student@123
-- rahul@student.edu      -> Student@123
INSERT INTO users (id, name, email, password_hash, role) VALUES
  (1, 'Campus Admin', 'admin@campusfind.edu', '$2a$10$LBXMFg2cR5nir8bKN3i6qOw//ZiJDZ7JJaVNy3r2cOKy77Tlk2Mra', 'ADMIN'),
  (2, 'Arjun Patel', 'arjun@student.edu', '$2a$10$QMsUyk0gV6H8NUZRj6oQ9eVjovP9dhRIa2vp36aDhmUORSVrAu9dK', 'STUDENT'),
  (3, 'Priya Sharma', 'priya@student.edu', '$2a$10$QMsUyk0gV6H8NUZRj6oQ9eVjovP9dhRIa2vp36aDhmUORSVrAu9dK', 'STUDENT'),
  (4, 'Rahul Verma', 'rahul@student.edu', '$2a$10$QMsUyk0gV6H8NUZRj6oQ9eVjovP9dhRIa2vp36aDhmUORSVrAu9dK', 'STUDENT');
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- 3. Insert 8 Sample Items (Mix of LOST and FOUND, varied categories and statuses)
-- Notice: image_url and image_public_id are NULL for initial seed items.
-- Images uploaded via the app will store Cloudinary URLs directly.
INSERT INTO items (id, title, description, type, location, item_date, status, image_url, image_public_id, category_id, user_id) VALUES
  (1, 'Blue Dell Inspiron Laptop 15"', 'Lost near Central Library 2nd floor silent reading zone. Has a NASA sticker on top cover.', 'LOST', 'Central Library, 2nd Floor', '2026-09-01', 'OPEN', NULL, NULL, 1, 2),
  (2, 'Student ID Card - Priya Sharma', 'Found on cafeteria table near Counter 3 around lunch time. Clean condition.', 'FOUND', 'Student Cafeteria', '2026-09-02', 'OPEN', NULL, NULL, 3, 4),
  (3, 'Advanced Engineering Mathematics (10th Ed)', 'Hardcover textbook left on the wooden bench outside Block C lecture hall.', 'FOUND', 'Block C Hallway Bench', '2026-09-03', 'OPEN', NULL, NULL, 2, 3),
  (4, 'Wireless Noise-Canceling Sony Headphones', 'Black Sony WH-1000XM4 lost near sports complex basketball court in a zippered case.', 'LOST', 'Sports Complex Pavilion', '2026-09-02', 'OPEN', NULL, NULL, 1, 4),
  (5, 'Brown Leather Wallet with Metro Pass', 'Lost near Main Gate bus stop. Contains student transit card and library pass.', 'LOST', 'Main Gate Bus Stop', '2026-08-28', 'CLAIMED', NULL, NULL, 4, 2),
  (6, 'Scientific Calculator Casio fx-991EX', 'Found inside Engineering Lab 104 on workbench 7.', 'FOUND', 'Engineering Lab 104', '2026-08-25', 'RETURNED', NULL, NULL, 1, 3),
  (7, 'Campus Hostel Room Key with Metal Keychain', 'Found near Football ground bleachers after evening practice.', 'FOUND', 'Sports Ground Bleachers', '2026-09-04', 'OPEN', NULL, NULL, 4, 2),
  (8, 'Semester Grade Sheet & Transcripts Folder', 'Green plastic folder containing official academic documents left in Seminar Hall A.', 'FOUND', 'Seminar Hall A', '2026-09-05', 'OPEN', NULL, NULL, 5, 4);
SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));

-- 4. Insert 3 Sample Claims (in PENDING status)
INSERT INTO claims (id, item_id, user_id, message, status) VALUES
  (1, 2, 3, 'This is my college ID card! My roll number is 21CS042 and my photo is on it. Can I collect it from the security desk?', 'PENDING'),
  (2, 3, 2, 'I believe this is my textbook. My name is written on the inside front cover in pencil on page 1.', 'PENDING'),
  (3, 7, 4, 'I lost my room key yesterday afternoon! The keychain has a miniature bronze guitar attached to the ring.', 'PENDING');
SELECT setval('claims_id_seq', (SELECT MAX(id) FROM claims));
