-- Run this after creating portfolio_db.
-- The application does not require an ORM; SQL is kept explicit and interview-friendly.

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(150) NOT NULL,
  bio TEXT NOT NULL,
  email VARCHAR(150) NOT NULL,
  location VARCHAR(150) DEFAULT '',
  github VARCHAR(255) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL DEFAULT 80 CHECK (level BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  live_url VARCHAR(255) DEFAULT '',
  github_url VARCHAR(255) DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_technologies (
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology VARCHAR(100) NOT NULL,
  PRIMARY KEY (project_id, technology)
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Starter data. ON CONFLICT keeps repeated schema runs safe.
INSERT INTO profile (id, name, role, bio, email, location, github, linkedin)
VALUES (
  1,
  'Your Name',
  'Full-Stack Developer',
  'I build responsive, accessible and scalable web applications.',
  'you@example.com',
  'India',
  'https://github.com/',
  'https://linkedin.com/'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO skills (name, category, level)
SELECT * FROM (VALUES
  ('HTML', 'Frontend', 95),
  ('CSS', 'Frontend', 90),
  ('JavaScript', 'Frontend', 90),
  ('Node.js', 'Backend', 85),
  ('Express.js', 'Backend', 85),
  ('PostgreSQL', 'Database', 85)
) AS seed(name, category, level)
WHERE NOT EXISTS (SELECT 1 FROM skills);

INSERT INTO projects (title, description, live_url, github_url, featured)
SELECT
  'Portfolio Website',
  'A responsive full-stack portfolio with dynamic content and contact management.',
  '',
  '',
  TRUE
WHERE NOT EXISTS (SELECT 1 FROM projects);

INSERT INTO project_technologies (project_id, technology)
SELECT p.id, t.technology
FROM projects p
CROSS JOIN (VALUES ('HTML'), ('CSS'), ('JavaScript'), ('Node.js'), ('Express.js'), ('PostgreSQL')) AS t(technology)
WHERE p.title = 'Portfolio Website'
ON CONFLICT DO NOTHING;
