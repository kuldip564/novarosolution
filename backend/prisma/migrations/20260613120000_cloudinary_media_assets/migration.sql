-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClientLogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "image" JSONB,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ClientLogo" ("createdAt", "id", "image", "name", "order", "published", "updatedAt") SELECT "createdAt", "id", "image", "name", "order", "published", "updatedAt" FROM "ClientLogo";
DROP TABLE "ClientLogo";
ALTER TABLE "new_ClientLogo" RENAME TO "ClientLogo";
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "heroTitle" TEXT,
    "heroImage" JSONB,
    "coverClass" TEXT,
    "screens" JSONB NOT NULL DEFAULT [],
    "results" JSONB NOT NULL DEFAULT [],
    "tags" JSONB NOT NULL DEFAULT [],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("body", "category", "coverClass", "createdAt", "heroImage", "heroTitle", "hook", "id", "order", "published", "results", "screens", "slug", "tags", "title", "updatedAt") SELECT "body", "category", "coverClass", "createdAt", "heroImage", "heroTitle", "hook", "id", "order", "published", "results", "screens", "slug", "tags", "title", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE TABLE "new_Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "bullets" JSONB NOT NULL DEFAULT [],
    "tags" JSONB NOT NULL DEFAULT [],
    "icon" TEXT,
    "image" JSONB,
    "imageAlt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Service" ("bullets", "createdAt", "description", "icon", "id", "image", "imageAlt", "name", "order", "published", "shortDescription", "slug", "tags", "title", "updatedAt") SELECT "bullets", "createdAt", "description", "icon", "id", "image", "imageAlt", "name", "order", "published", "shortDescription", "slug", "tags", "title", "updatedAt" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE TABLE "new_TeamMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "photo" JSONB,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TeamMember" ("createdAt", "id", "name", "order", "photo", "published", "role", "updatedAt") SELECT "createdAt", "id", "name", "order", "photo", "published", "role", "updatedAt" FROM "TeamMember";
DROP TABLE "TeamMember";
ALTER TABLE "new_TeamMember" RENAME TO "TeamMember";
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatar" JSONB,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("avatar", "createdAt", "id", "name", "order", "published", "quote", "rating", "role", "updatedAt") SELECT "avatar", "createdAt", "id", "name", "order", "published", "quote", "rating", "role", "updatedAt" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
