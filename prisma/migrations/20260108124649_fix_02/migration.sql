-- DropForeignKey
ALTER TABLE "tourism_spot_facilities" DROP CONSTRAINT "tourism_spot_facilities_tourism_spot_id_fkey";

-- DropForeignKey
ALTER TABLE "tourism_spot_gallery" DROP CONSTRAINT "tourism_spot_gallery_tourism_spot_id_fkey";

-- AddForeignKey
ALTER TABLE "tourism_spot_facilities" ADD CONSTRAINT "tourism_spot_facilities_tourism_spot_id_fkey" FOREIGN KEY ("tourism_spot_id") REFERENCES "tourism_spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tourism_spot_gallery" ADD CONSTRAINT "tourism_spot_gallery_tourism_spot_id_fkey" FOREIGN KEY ("tourism_spot_id") REFERENCES "tourism_spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
