-- ============================================================
-- SkillItLearn — Row Level Security Policies
--
-- Run this DIRECTLY against the Supabase database via SQL editor
-- or psql. These use auth.uid() which is a Supabase-specific
-- function — not compatible with Prisma's shadow database.
--
-- Prisma connects as the postgres user (bypasses RLS by default),
-- so these policies protect PostgREST/Supabase client access
-- and serve as defense-in-depth.
-- ============================================================

-- ── Enable RLS on ALL tables ─────────────────────────────────

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "careers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "paths" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "modules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "learner_progress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quiz_questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "quiz_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "skill_completion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "path_certificate_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certificates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_log" ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- USERS table policies
-- ============================================================

-- Users can read their own profile
CREATE POLICY "users_select_own" ON "users"
  FOR SELECT
  USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "users_select_admin" ON "users"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "users" u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  );

-- Admins can update user roles
CREATE POLICY "users_update_admin" ON "users"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "users" u
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  );


-- ============================================================
-- CAREERS — public read, admin write
-- ============================================================

CREATE POLICY "careers_select_public" ON "careers"
  FOR SELECT USING (true);

CREATE POLICY "careers_insert_admin" ON "careers"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "careers_update_admin" ON "careers"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "careers_delete_admin" ON "careers"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- PATHS — public read, admin write
-- ============================================================

CREATE POLICY "paths_select_public" ON "paths"
  FOR SELECT USING (true);

CREATE POLICY "paths_insert_admin" ON "paths"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "paths_update_admin" ON "paths"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "paths_delete_admin" ON "paths"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- SKILLS — public read, admin write
-- ============================================================

CREATE POLICY "skills_select_public" ON "skills"
  FOR SELECT USING (true);

CREATE POLICY "skills_insert_admin" ON "skills"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "skills_update_admin" ON "skills"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "skills_delete_admin" ON "skills"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- MODULES — public read, instructor + admin write
-- ============================================================

CREATE POLICY "modules_select_public" ON "modules"
  FOR SELECT USING (true);

CREATE POLICY "modules_insert_content" ON "modules"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('instructor', 'admin', 'super_admin'))
  );

CREATE POLICY "modules_update_content" ON "modules"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('instructor', 'admin', 'super_admin'))
  );

CREATE POLICY "modules_delete_admin" ON "modules"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- STEPS — public read, instructor + admin write
-- ============================================================

CREATE POLICY "steps_select_public" ON "steps"
  FOR SELECT USING (true);

CREATE POLICY "steps_insert_content" ON "steps"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('instructor', 'admin', 'super_admin'))
  );

CREATE POLICY "steps_update_content" ON "steps"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('instructor', 'admin', 'super_admin'))
  );

CREATE POLICY "steps_delete_admin" ON "steps"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- LEARNER_PROGRESS — own data only
-- ============================================================

CREATE POLICY "progress_select_own" ON "learner_progress"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "progress_insert_own" ON "learner_progress"
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_delete_own" ON "learner_progress"
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "progress_select_admin" ON "learner_progress"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- QUIZ_QUESTIONS — authenticated read, admin/instructor write
-- CRITICAL: correct_choice_id column filtering is enforced in
-- the server function, not at the RLS level (RLS is row-level).
-- ============================================================

CREATE POLICY "questions_select_auth" ON "quiz_questions"
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "questions_insert_content" ON "quiz_questions"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('instructor', 'admin', 'super_admin'))
  );

CREATE POLICY "questions_update_content" ON "quiz_questions"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('instructor', 'admin', 'super_admin'))
  );

CREATE POLICY "questions_delete_admin" ON "quiz_questions"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- QUIZ_ATTEMPTS — own data only
-- ============================================================

CREATE POLICY "attempts_select_own" ON "quiz_attempts"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "attempts_insert_own" ON "quiz_attempts"
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "attempts_select_admin" ON "quiz_attempts"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- SKILL_COMPLETION — own data only
-- ============================================================

CREATE POLICY "completion_select_own" ON "skill_completion"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "completion_insert_own" ON "skill_completion"
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "completion_update_own" ON "skill_completion"
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "completion_select_admin" ON "skill_completion"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- PATH_CERTIFICATE_TEMPLATES — public read, admin write
-- ============================================================

CREATE POLICY "templates_select_public" ON "path_certificate_templates"
  FOR SELECT USING (true);

CREATE POLICY "templates_insert_admin" ON "path_certificate_templates"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "templates_update_admin" ON "path_certificate_templates"
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

CREATE POLICY "templates_delete_admin" ON "path_certificate_templates"
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );


-- ============================================================
-- CERTIFICATES — own read only, no direct client insert
-- Verification is via server function, not direct access.
-- ============================================================

CREATE POLICY "certs_select_own" ON "certificates"
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "certs_select_admin" ON "certificates"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

-- No INSERT/UPDATE policy for regular users — issuance is server-side only


-- ============================================================
-- AUDIT_LOG — admin read only, server-side insert only
-- ============================================================

CREATE POLICY "audit_select_admin" ON "audit_log"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "users" u WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin'))
  );

-- No INSERT policy — audit entries created via Prisma (service role)
