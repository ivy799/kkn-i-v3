-- DropForeignKey
ALTER TABLE "business_gallery" DROP CONSTRAINT "business_gallery_business_id_fkey";

-- AddForeignKey
ALTER TABLE "business_gallery" ADD CONSTRAINT "business_gallery_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
