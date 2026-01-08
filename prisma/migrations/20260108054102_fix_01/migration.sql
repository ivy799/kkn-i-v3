/*
  Warnings:

  - You are about to drop the column `products_image` on the `businesses` table. All the data in the column will be lost.
  - The `minimum_price` column on the `businesses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maximum_price` column on the `businesses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `facilities` on the `tourism_spots` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `tourism_spots` table. All the data in the column will be lost.
  - The `opening_hours` column on the `tourism_spots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `closing_hours` column on the `tourism_spots` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `galleries` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "products_image",
DROP COLUMN "minimum_price",
ADD COLUMN     "minimum_price" INTEGER,
DROP COLUMN "maximum_price",
ADD COLUMN     "maximum_price" INTEGER;

-- AlterTable
ALTER TABLE "tourism_spots" DROP COLUMN "facilities",
DROP COLUMN "image",
DROP COLUMN "opening_hours",
ADD COLUMN     "opening_hours" INTEGER,
DROP COLUMN "closing_hours",
ADD COLUMN     "closing_hours" INTEGER;

-- DropTable
DROP TABLE "galleries";

-- CreateTable
CREATE TABLE "business_gallery" (
    "id" SERIAL NOT NULL,
    "business_id" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "media" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourism_spot_facilities" (
    "id" SERIAL NOT NULL,
    "tourism_spot_id" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tourism_spot_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourism_spot_gallery" (
    "id" SERIAL NOT NULL,
    "tourism_spot_id" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "media" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tourism_spot_gallery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "business_gallery" ADD CONSTRAINT "business_gallery_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tourism_spot_facilities" ADD CONSTRAINT "tourism_spot_facilities_tourism_spot_id_fkey" FOREIGN KEY ("tourism_spot_id") REFERENCES "tourism_spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tourism_spot_gallery" ADD CONSTRAINT "tourism_spot_gallery_tourism_spot_id_fkey" FOREIGN KEY ("tourism_spot_id") REFERENCES "tourism_spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
