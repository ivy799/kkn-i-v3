/*
  Warnings:

  - You are about to drop the column `slug` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `businesses` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `tourism_spots` table. All the data in the column will be lost.
  - The `ticket_price` column on the `tourism_spots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `contact_person` column on the `tourism_spots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `opening_hours` column on the `tourism_spots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `closing_hours` column on the `tourism_spots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `history_description` on the `village_profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "articles_slug_key";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "tourism_spots" DROP COLUMN "slug",
DROP COLUMN "ticket_price",
ADD COLUMN     "ticket_price" INTEGER,
DROP COLUMN "contact_person",
ADD COLUMN     "contact_person" INTEGER,
DROP COLUMN "opening_hours",
ADD COLUMN     "opening_hours" TIME,
DROP COLUMN "closing_hours",
ADD COLUMN     "closing_hours" TIME;

-- AlterTable
ALTER TABLE "village_profile" DROP COLUMN "history_description";
