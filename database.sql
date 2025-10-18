PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT CHECK(role IN ('Content Creator', 'Reel Maker', 'Editor', 'Manager')),
  email TEXT,
  active INTEGER DEFAULT 1
);
CREATE TABLE scripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  creator_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  script_text TEXT,
  status TEXT CHECK(status IN ('Draft', 'Approved', 'Rejected', 'Used')) DEFAULT 'Draft',
  date_created TEXT DEFAULT CURRENT_TIMESTAMP,
  date_approved TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);
CREATE TABLE shoots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  reel_maker_id INTEGER NOT NULL,
  shoot_date TEXT NOT NULL,
  num_videos INTEGER DEFAULT 0,
  material_delivered_date TEXT,
  notes TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (reel_maker_id) REFERENCES users(id)
);
CREATE TABLE edits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  editor_id INTEGER NOT NULL,
  shoot_id INTEGER,
  script_id INTEGER,
  video_title TEXT NOT NULL,
  date_started TEXT DEFAULT CURRENT_TIMESTAMP,
  date_completed TEXT,
  status TEXT CHECK(status IN ('In Progress', 'Completed', 'Revision Needed')) DEFAULT 'In Progress',
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (editor_id) REFERENCES users(id),
  FOREIGN KEY (shoot_id) REFERENCES shoots(id),
  FOREIGN KEY (script_id) REFERENCES scripts(id)
);
CREATE TABLE edit_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edit_id INTEGER NOT NULL,
  revision_number INTEGER NOT NULL,
  reason TEXT,
  date_requested TEXT DEFAULT CURRENT_TIMESTAMP,
  date_completed TEXT,
  requested_by INTEGER,
  FOREIGN KEY (edit_id) REFERENCES edits(id),
  FOREIGN KEY (requested_by) REFERENCES users(id)
);
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,              -- Brand Name
  industry TEXT,
  start_date TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Active',
  videos_in_contract INTEGER DEFAULT 0,
  posts_in_contract INTEGER DEFAULT 0
, leave_reason TEXT);
INSERT INTO "clients" VALUES(1,'Hala Qishta','Desserts','','','Lost',5,10,'stupid');
INSERT INTO "clients" VALUES(2,'Kitcheneer','Kitchen Renovation & Design','2025-09-01','He has a lot of data on drive that needs to be edited and published soon.','Active',12,12,NULL);
CREATE TABLE publishes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  edit_id INTEGER NOT NULL,
  content_type TEXT CHECK(content_type IN ('Video', 'Post')) NOT NULL,
  platform TEXT CHECK(platform IN ('Instagram', 'Facebook', 'TikTok', 'YouTube', 'Other')) DEFAULT 'Instagram',
  publish_date TEXT,
  link TEXT,
  posted_by INTEGER,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (edit_id) REFERENCES edits(id),
  FOREIGN KEY (posted_by) REFERENCES users(id)
);
DELETE FROM sqlite_sequence;
INSERT INTO "sqlite_sequence" VALUES('clients',2);
CREATE TRIGGER auto_log_revision
AFTER UPDATE ON edits
WHEN NEW.status = 'Revision Needed' AND OLD.status = 'Completed'
BEGIN
  INSERT INTO edit_revisions (edit_id, revision_number, reason)
  VALUES (
    NEW.id,
    COALESCE((SELECT MAX(revision_number) + 1 FROM edit_revisions WHERE edit_id = NEW.id), 1),
    'Auto-detected status change: Revision Needed'
  );
END;
CREATE TRIGGER auto_complete_revision
AFTER UPDATE ON edits
WHEN NEW.status = 'Completed' AND OLD.status = 'Revision Needed'
BEGIN
  UPDATE edit_revisions
  SET date_completed = CURRENT_TIMESTAMP
  WHERE id = (
    SELECT id FROM edit_revisions
    WHERE edit_id = NEW.id
      AND date_completed IS NULL
    ORDER BY revision_number DESC
    LIMIT 1
  );
END;
