-- CreateTable
CREATE TABLE IF NOT EXISTS "site_config" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("key")
);

-- Seed the testimonials section as hidden, matching the application default
INSERT INTO "site_config" ("key", "value")
VALUES ('show_testimonials', 'false')
ON CONFLICT ("key") DO NOTHING;
