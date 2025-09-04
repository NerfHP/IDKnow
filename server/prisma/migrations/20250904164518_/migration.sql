/*
  Warnings:

  - You are about to drop the column `attributes` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `benefits` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `specifications` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `variants` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `vendor` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContentItem" ADD COLUMN "attributes" TEXT;
ALTER TABLE "ContentItem" ADD COLUMN "availability" TEXT;
ALTER TABLE "ContentItem" ADD COLUMN "benefits" TEXT;
ALTER TABLE "ContentItem" ADD COLUMN "salePrice" REAL;
ALTER TABLE "ContentItem" ADD COLUMN "sku" TEXT;
ALTER TABLE "ContentItem" ADD COLUMN "specifications" TEXT;
ALTER TABLE "ContentItem" ADD COLUMN "variants" TEXT;
ALTER TABLE "ContentItem" ADD COLUMN "vendor" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "parentId" TEXT,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "description", "id", "name", "parentId", "slug", "type", "updatedAt") SELECT "createdAt", "description", "id", "name", "parentId", "slug", "type", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
