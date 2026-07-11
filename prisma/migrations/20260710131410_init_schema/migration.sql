-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('learner', 'instructor', 'admin', 'super_admin');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'learner',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paths" (
    "id" UUID NOT NULL,
    "career_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "path_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "estimated_hours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" UUID NOT NULL,
    "module_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "media_urls" TEXT[],
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learner_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "question_text" TEXT NOT NULL,
    "choices_json" JSONB NOT NULL,
    "correct_choice_id" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "answers_json" JSONB NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_completion" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "steps_completed" BOOLEAN NOT NULL DEFAULT false,
    "quiz_passed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "skill_completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "path_certificate_templates" (
    "id" UUID NOT NULL,
    "path_id" UUID NOT NULL,
    "logo_url" TEXT,
    "signature_url" TEXT,
    "signatory_name" TEXT,
    "signatory_title" TEXT,
    "template_layout_json" JSONB,

    CONSTRAINT "path_certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "unique_certificate_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "path_id" UUID NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qr_code_url" TEXT,
    "pdf_url" TEXT,
    "verification_hash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "actor_user_id" UUID,
    "action" TEXT NOT NULL,
    "target_table" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "careers_slug_key" ON "careers"("slug");

-- CreateIndex
CREATE INDEX "careers_slug_idx" ON "careers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "paths_slug_key" ON "paths"("slug");

-- CreateIndex
CREATE INDEX "paths_slug_idx" ON "paths"("slug");

-- CreateIndex
CREATE INDEX "paths_career_id_idx" ON "paths"("career_id");

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");

-- CreateIndex
CREATE INDEX "skills_slug_idx" ON "skills"("slug");

-- CreateIndex
CREATE INDEX "skills_path_id_idx" ON "skills"("path_id");

-- CreateIndex
CREATE INDEX "modules_skill_id_idx" ON "modules"("skill_id");

-- CreateIndex
CREATE INDEX "steps_module_id_idx" ON "steps"("module_id");

-- CreateIndex
CREATE INDEX "learner_progress_user_id_idx" ON "learner_progress"("user_id");

-- CreateIndex
CREATE INDEX "learner_progress_step_id_idx" ON "learner_progress"("step_id");

-- CreateIndex
CREATE UNIQUE INDEX "learner_progress_user_id_step_id_key" ON "learner_progress"("user_id", "step_id");

-- CreateIndex
CREATE INDEX "quiz_questions_skill_id_idx" ON "quiz_questions"("skill_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_idx" ON "quiz_attempts"("user_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_skill_id_idx" ON "quiz_attempts"("skill_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_skill_id_idx" ON "quiz_attempts"("user_id", "skill_id");

-- CreateIndex
CREATE INDEX "skill_completion_user_id_idx" ON "skill_completion"("user_id");

-- CreateIndex
CREATE INDEX "skill_completion_skill_id_idx" ON "skill_completion"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "skill_completion_user_id_skill_id_key" ON "skill_completion"("user_id", "skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "path_certificate_templates_path_id_key" ON "path_certificate_templates"("path_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_unique_certificate_id_key" ON "certificates"("unique_certificate_id");

-- CreateIndex
CREATE INDEX "certificates_unique_certificate_id_idx" ON "certificates"("unique_certificate_id");

-- CreateIndex
CREATE INDEX "certificates_user_id_idx" ON "certificates"("user_id");

-- CreateIndex
CREATE INDEX "certificates_path_id_idx" ON "certificates"("path_id");

-- CreateIndex
CREATE INDEX "audit_log_actor_user_id_idx" ON "audit_log"("actor_user_id");

-- CreateIndex
CREATE INDEX "audit_log_target_table_target_id_idx" ON "audit_log"("target_table", "target_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "careers" ADD CONSTRAINT "careers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paths" ADD CONSTRAINT "paths_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "careers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_progress" ADD CONSTRAINT "learner_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_progress" ADD CONSTRAINT "learner_progress_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_completion" ADD CONSTRAINT "skill_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_completion" ADD CONSTRAINT "skill_completion_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "path_certificate_templates" ADD CONSTRAINT "path_certificate_templates_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_path_id_fkey" FOREIGN KEY ("path_id") REFERENCES "paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
