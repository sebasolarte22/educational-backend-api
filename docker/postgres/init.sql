-- =====================
-- USERS
-- =====================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  revoked BOOLEAN DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- =====================
-- COURSES
-- =====================
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  language VARCHAR(50),
  subject VARCHAR(50),
  level VARCHAR(50),
  views INTEGER DEFAULT 0,
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

-- =====================
-- SECTIONS
-- =====================
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_sections_course ON sections(course_id);

-- =====================
-- LESSONS
-- =====================
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lessons_section ON lessons(section_id);

-- =====================
-- ENROLLMENTS
-- =====================
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- =====================
-- LESSON PROGRESS
-- =====================
CREATE TABLE lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- =====================
-- FAVORITES
-- =====================
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, course_id)
);

-- =====================
-- AI LOGS
-- =====================
CREATE TABLE ai_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  input_data JSONB NOT NULL,
  output_data TEXT,
  mode TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- =====================
-- DOCUMENT TYPES
-- =====================
CREATE TABLE document_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- =====================
-- DOCUMENTS
-- =====================
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  owner_type VARCHAR(50) NOT NULL,
  owner_id INTEGER NOT NULL,
  document_type_id INTEGER REFERENCES document_types(id),
  file_path TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  uploaded_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_documents_owner ON documents(owner_type, owner_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(document_type_id);

-- =====================
-- DOCUMENT DATA
-- =====================
CREATE TABLE document_data (
  document_id INTEGER PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
  extracted_text TEXT,
  extracted_fields JSONB,
  processed_at TIMESTAMP
);

-- =====================
-- DOCUMENT AUDIT
-- =====================
CREATE TABLE document_audit (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);