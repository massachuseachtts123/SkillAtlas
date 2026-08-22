-- ========================================
-- SkillAtlas Database Schema
-- ========================================

-- 1. repos table - stores GitHub repo data
CREATE TABLE IF NOT EXISTS repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_username TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  description TEXT,
  languages JSONB,        -- {"Python": 60000, "JavaScript": 12000} from GitHub API
  topics TEXT[],
  stars INTEGER,
  pushed_at TIMESTAMPTZ,  -- recency
  readme_summary TEXT     -- raw README text, truncated, for AI extraction input
);

-- 2. technologies table - catalog of known technologies
CREATE TABLE IF NOT EXISTS technologies (
  ID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL  -- 'language' | 'framework' | 'database' | 'ai_ml' | 'cloud' | 'tool'
);

-- 3. repo_technologies junction table - links repos to technologies with source tracking
CREATE TABLE IF NOT EXISTS repo_technologies (
  repo_id UUID REFERENCES repos(id),
  technology_id UUID REFERENCES technologies(id),
  source TEXT NOT NULL,   -- 'VERIFIED' | 'AI_INFERRED'
  PRIMARY KEY (repo_id, technology_id)
);

-- 4. careers table - seeded with 3 careers only
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL   -- seed: Backend Developer, AI Engineer, Frontend Developer
);

-- 5. career_requirements - importance weights (1-5) for each tech per career
CREATE TABLE IF NOT EXISTS career_requirements (
  career_id UUID REFERENCES careers(id),
  technology_id UUID REFERENCES technologies(id),
  weight INTEGER NOT NULL,        -- 1-5, how important this tech is to the career
  PRIMARY KEY (career_id, technology_id)
);
