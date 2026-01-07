-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('NEWS', 'EVENT', 'ANNOUNCEMENT');

-- CreateEnum
CREATE TYPE "eventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "village_profile" (
    "id" SERIAL NOT NULL,
    "village_name" TEXT,
    "address" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "history_description" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "map_embed_code" TEXT,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "village_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "content" TEXT,
    "thumbnail" TEXT,
    "category" "ArticleCategory",
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galleries" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "media" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "description" TEXT,
    "location" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "image" TEXT,
    "status" "eventStatus" NOT NULL DEFAULT 'UPCOMING',

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "status" "BusinessStatus" NOT NULL DEFAULT 'PENDING',
    "name" TEXT,
    "slug" TEXT,
    "owner_name" TEXT,
    "phone_number" TEXT,
    "description" TEXT,
    "minimum_price" TEXT,
    "maximum_price" TEXT,
    "address" TEXT,
    "products_image" TEXT,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourism_spots" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "slug" TEXT,
    "description" TEXT,
    "address" TEXT,
    "map_url" TEXT,
    "ticket_price" TEXT,
    "facilities" TEXT,
    "opening_hours" TEXT,
    "closing_hours" TEXT,
    "contact_person" TEXT,
    "image" TEXT,

    CONSTRAINT "tourism_spots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
