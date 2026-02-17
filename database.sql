PRAGMA defer_foreign_keys=TRUE;

-- 1. Users Table (Internal Team)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('Content Creator', 'Reel Maker', 'Editor', 'Manager', 'Specialist', 'Admin')) NOT NULL,
  email TEXT UNIQUE,
  active INTEGER DEFAULT 1,
  rate_per_item REAL, -- Optional: for cost tracking
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clients Table
DROP TABLE IF EXISTS clients;
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  industry TEXT,
  status TEXT CHECK(status IN ('Active', 'On Hold', 'Churned', 'Lead')) DEFAULT 'Active',
  start_date TEXT,
  contract_end_date TEXT,
  
  -- Contract Deliverables (Monthly)
  videos_per_month INTEGER DEFAULT 0,
  posts_per_month INTEGER DEFAULT 0,
  
  -- Financials
  budget REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  
  notes TEXT,
  leave_reason TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. Scripts (Step 1: Ideation & Text)
DROP TABLE IF EXISTS scripts;
CREATE TABLE scripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  creator_id INTEGER NOT NULL,
  
  title TEXT NOT NULL,
  type TEXT CHECK(type IN ('Video', 'Post')) DEFAULT 'Video',
  script_text TEXT,
  
  status TEXT CHECK(status IN ('Draft', 'Approved', 'Rejected', 'Used')) DEFAULT 'Draft',
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT,
  
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 4. Shoots (Step 2: Filming)
DROP TABLE IF EXISTS shoots;
CREATE TABLE shoots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  reel_maker_id INTEGER NOT NULL,
  
  shoot_date TEXT NOT NULL,
  location TEXT,
  
  num_videos_filmed INTEGER DEFAULT 0,
  raw_footage_link TEXT,
  
  status TEXT CHECK(status IN ('Scheduled', 'Completed', 'Canceled')) DEFAULT 'Scheduled',
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT, -- When footage was uploaded/delivered
  
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (reel_maker_id) REFERENCES users(id)
);

-- 5. Edits (Step 3: Post-Production)
DROP TABLE IF EXISTS edits;
CREATE TABLE edits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  editor_id INTEGER NOT NULL,
  
  -- Link to previous stages (optional, as some edits might not have a specific script/shoot)
  script_id INTEGER,
  shoot_id INTEGER,
  
  video_title TEXT NOT NULL,
  render_link TEXT,
  
  status TEXT CHECK(status IN ('In Progress', 'Review', 'Revision Needed', 'Completed')) DEFAULT 'In Progress',
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP, -- Assignment date
  delivered_at TEXT, -- When first version was sent
  finalized_at TEXT, -- When status became Completed
  
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (editor_id) REFERENCES users(id),
  FOREIGN KEY (script_id) REFERENCES scripts(id),
  FOREIGN KEY (shoot_id) REFERENCES shoots(id)
);

-- 6. Edit Revisions (Tracking feedback loops)
DROP TABLE IF EXISTS edit_revisions;
CREATE TABLE edit_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edit_id INTEGER NOT NULL,
  revision_number INTEGER NOT NULL,
  feedback_text TEXT,
  requested_by INTEGER, -- User ID
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT,
  
  FOREIGN KEY (edit_id) REFERENCES edits(id),
  FOREIGN KEY (requested_by) REFERENCES users(id)
);

-- 7. Publishes (Step 4: Distribution)
DROP TABLE IF EXISTS publishes;
CREATE TABLE publishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  specialist_id INTEGER, -- Who posted it
  
  edit_id INTEGER, -- If it was a video
  script_id INTEGER, -- If it was a text post
  
  platform TEXT CHECK(platform IN ('Instagram', 'Facebook', 'TikTok', 'YouTube', 'LinkedIn', 'Other')) DEFAULT 'Instagram',
  content_type TEXT CHECK(content_type IN ('Reel', 'Post', 'Story', 'Carousel')) DEFAULT 'Reel',
  
  post_link TEXT,
  
  -- Performance Metrics (Updated later)
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  
  published_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (specialist_id) REFERENCES users(id),
  FOREIGN KEY (edit_id) REFERENCES edits(id),
  FOREIGN KEY (script_id) REFERENCES scripts(id)
);

-- 8. Payments (Financials)
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  due_date TEXT,
  paid_date TEXT,
  
  status TEXT CHECK(status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')) DEFAULT 'Pending',
  invoice_url TEXT,
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- 9. Daily Analytics (Snapshot for fast dashboard loading)
DROP TABLE IF EXISTS daily_analytics;
CREATE TABLE daily_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT DEFAULT (DATE('now')),
  client_id INTEGER NOT NULL,
  
  -- Daily Activity Counts
  scripts_created INTEGER DEFAULT 0,
  shoots_completed INTEGER DEFAULT 0,
  edits_completed INTEGER DEFAULT 0,
  posts_published INTEGER DEFAULT 0,
  
  -- Rolling 30-Day Metrics (Snapshot)
  delivery_rate_30d REAL DEFAULT 0,
  
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Triggers to auto-update timestamps
CREATE TRIGGER IF NOT EXISTS update_script_approved_at
AFTER UPDATE ON scripts
WHEN NEW.status = 'Approved' AND OLD.status != 'Approved'
BEGIN
  UPDATE scripts SET approved_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_shoot_completed_at
AFTER UPDATE ON shoots
WHEN NEW.status = 'Completed' AND OLD.status != 'Completed'
BEGIN
  UPDATE shoots SET completed_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_edit_finalized_at
AFTER UPDATE ON edits
WHEN NEW.status = 'Completed' AND OLD.status != 'Completed'
BEGIN
  UPDATE edits SET finalized_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Seed Data (Optional - for testing)
INSERT INTO users (name, role, email) VALUES 
('Nour Admin', 'Admin', 'nour@agency.com'),
('Ahmed Creator', 'Content Creator', 'ahmed@agency.com'),
('Sarah Editor', 'Editor', 'sarah@agency.com');

INSERT INTO clients (name, industry, videos_per_month, posts_per_month, budget) VALUES 
('Kitcheneer', 'Renovation', 12, 12, 2000.00),
('Hala Qishta', 'Food', 5, 10, 800.00);
