-- ========================================
-- Seed data for SkillAtlas
-- ========================================

-- Seed 3 careers
INSERT INTO careers (id, name) VALUES
  (gen_random_uuid(), 'Backend Developer'),
  (gen_random_uuid(), 'AI Engineer'),
  (gen_random_uuid(), 'Frontend Developer')
ON CONFLICT (name) DO NOTHING;

-- Seed technology categories relevant to each career
-- Backend Developer requirements
INSERT INTO technologies (id, name, category) VALUES
  (gen_random_uuid(), 'Python', 'language'),
  (gen_random_uuid(), 'JavaScript', 'language'),
  (gen_random_uuid(), 'TypeScript', 'language'),
  (gen_random_uuid(), 'Node.js', 'framework'),
  (gen_random_uuid(), 'Express', 'framework'),
  (gen_random_uuid(), 'PostgreSQL', 'database'),
  (gen_random_uuid(), 'MySQL', 'database'),
  (gen_random_uuid(), 'Docker', 'tool'),
  (gen_random_uuid(), 'Git', 'tool'),
  (gen_random_uuid(), 'AWS', 'cloud'),
  (gen_random_uuid(), 'Django', 'framework'),
  (gen_random_uuid(), 'FastAPI', 'framework'),
  (gen_random_uuid(), 'REST API', 'tool'),
  (gen_random_uuid(), 'GitHub Actions', 'tool'),
  (gen_random_uuid(), 'Linux', 'tool')
ON CONFLICT (name) DO NOTHING;

-- AI Engineer requirements
INSERT INTO technologies (id, name, category) VALUES
  (gen_random_uuid(), 'Python', 'language'), -- already inserted
  (gen_random_uuid(), 'JavaScript', 'language'), -- already inserted
  (gen_random_uuid(), 'TypeScript', 'language'), -- already inserted
  (gen_random_uuid(), 'TensorFlow', 'ai_ml'),
  (gen_random_uuid(), 'PyTorch', 'ai_ml'),
  (gen_random_uuid(), 'scikit-learn', 'ai_ml'),
  (gen_random_uuid(), 'Keras', 'ai_ml'),
  (gen_random_uuid(), 'OpenAI', 'ai_ml'),
  (gen_random_uuid(), 'Hugging Face', 'ai_ml'),
  (gen_random_uuid(), 'NumPy', 'ai_ml'),
  (gen_random_uuid(), 'Pandas', 'ai_ml'),
  (gen_random_uuid(), 'CUDA', 'ai_ml'),
  (gen_random_uuid(), 'Docker', 'tool'), -- already inserted
  (gen_random_uuid(), 'Git', 'tool'), -- already inserted
  (gen_random_uuid(), 'AWS', 'cloud'), -- already inserted
  (gen_random_uuid(), 'Kubernetes', 'cloud'),
  (gen_random_uuid(), 'Jupyter', 'tool'),
  (gen_random_uuid(), 'Matplotlib', 'ai_ml')
ON CONFLICT (name) DO NOTHING;

-- Frontend Developer requirements
INSERT INTO technologies (id, name, category) VALUES
  (gen_random_uuid(), 'JavaScript', 'language'), -- already inserted
  (gen_random_uuid(), 'TypeScript', 'language'), -- already inserted
  (gen_random_uuid(), 'React', 'framework'),
  (gen_random_uuid(), 'Next.js', 'framework'),
  (gen_random_uuid(), 'Vue.js', 'framework'),
  (gen_random_uuid(), 'CSS/Sass', 'language'),
  (gen_random_uuid(), 'HTML', 'language'),
  (gen_random_uuid(), 'Tailwind CSS', 'framework'),
  (gen_random_uuid(), 'Redux', 'tool'),
  (gen_random_uuid(), 'Zustand', 'tool'),
  (gen_random_uuid(), 'Vite', 'tool'),
  (gen_random_uuid(), 'NPM', 'tool'),
  (gen_random_uuid(), 'Git', 'tool'), -- already inserted
  (gen_random_uuid(), 'Vercel', 'cloud'),
  (gen_random_uuid(), 'Netlify', 'cloud'),
  (gen_random_uuid(), 'Storybook', 'tool'),
  (gen_random_uuid(), 'Jest', 'tool'),
  (gen_random_uuid(), 'Cypress', 'tool')
ON CONFLICT (name) DO NOTHING;

-- Now assign requirements: weight 1-5 for each career-technology pair

-- Backend Developer requirements (weights 1-5)
INSERT INTO career_requirements (career_id, technology_id, weight)
SELECT c.id, t.id,
  CASE
    WHEN t.name IN ('Python', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git', 'AWS') THEN 5
    WHEN t.name IN ('Django', 'FastAPI', 'REST API', 'GitHub Actions') THEN 4
    WHEN t.name IN ('MySQL') THEN 3
    ELSE 1
  END as weight
FROM careers c, technologies t
CROSS JOIN (VALUES ('Backend Developer')) AS cname(name)
WHERE c.name = 'Backend Developer'
ON CONFLICT (career_id, technology_id) DO UPDATE SET weight = EXCLUDED.weight;

-- AI Engineer requirements (weights 1-5)
INSERT INTO career_requirements (career_id, technology_id, weight)
SELECT c.id, t.id,
  CASE
    WHEN t.name IN ('Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Keras', 'OpenAI', 'Hugging Face', 'NumPy', 'Pandas', 'CUDA') THEN 5
    WHEN t.name IN ('JavaScript', 'TypeScript', 'Docker', 'Git', 'AWS', 'Kubernetes', 'Jupyter') THEN 4
    WHEN t.name IN ('Matplotlib') THEN 3
    ELSE 1
  END as weight
FROM careers c, technologies t
CROSS JOIN (VALUES ('AI Engineer')) AS cname(name)
WHERE c.name = 'AI Engineer'
ON CONFLICT (career_id, technology_id) DO UPDATE SET weight = EXCLUDED.weight;

-- Frontend Developer requirements (weights 1-5)
INSERT INTO career_requirements (career_id, technology_id, weight)
SELECT c.id, t.id,
  CASE
    WHEN t.name IN ('JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'CSS/Sass', 'HTML', 'Tailwind CSS', 'Git', 'Vercel', 'Netlify') THEN 5
    WHEN t.name IN ('Redux', 'Zustand', 'Vite', 'Storybook', 'Jest', 'Cypress') THEN 4
    ELSE 1
  END as weight
FROM careers c, technologies t
CROSS JOIN (VALUES ('Frontend Developer')) AS cname(name)
WHERE c.name = 'Frontend Developer'
ON CONFLICT (career_id, technology_id) DO UPDATE SET weight = EXCLUDED.weight;
