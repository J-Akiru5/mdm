-- AlterTable
ALTER TABLE "feedbacks" ADD COLUMN "company" TEXT;
ALTER TABLE "feedbacks" ADD COLUMN "is_visible" BOOLEAN NOT NULL DEFAULT false;
