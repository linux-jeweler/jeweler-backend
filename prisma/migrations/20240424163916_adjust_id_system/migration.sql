/*
  Warnings:

  - The primary key for the `SoftwareOnSource` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `distroId` on the `SoftwareOnSource` table. All the data in the column will be lost.
  - You are about to drop the column `softwareId` on the `SoftwareOnSource` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `SoftwareOnSource` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `LinuxDistro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Software` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,version]` on the table `Software` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `distroName` to the `SoftwareOnSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `softwareName` to the `SoftwareOnSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceName` to the `SoftwareOnSource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SoftwareOnSource" DROP CONSTRAINT "SoftwareOnSource_distroId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareOnSource" DROP CONSTRAINT "SoftwareOnSource_softwareId_fkey";

-- DropForeignKey
ALTER TABLE "SoftwareOnSource" DROP CONSTRAINT "SoftwareOnSource_sourceId_fkey";

-- AlterTable
ALTER TABLE "SoftwareOnSource" DROP CONSTRAINT "SoftwareOnSource_pkey",
DROP COLUMN "distroId",
DROP COLUMN "softwareId",
DROP COLUMN "sourceId",
ADD COLUMN     "distroName" TEXT NOT NULL,
ADD COLUMN     "softwareName" TEXT NOT NULL,
ADD COLUMN     "sourceName" TEXT NOT NULL,
ADD CONSTRAINT "SoftwareOnSource_pkey" PRIMARY KEY ("softwareName", "sourceName", "distroName");

-- CreateIndex
CREATE UNIQUE INDEX "LinuxDistro_name_key" ON "LinuxDistro"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_key" ON "Software"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_version_key" ON "Software"("name", "version");

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_distroName_fkey" FOREIGN KEY ("distroName") REFERENCES "LinuxDistro"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_softwareName_fkey" FOREIGN KEY ("softwareName") REFERENCES "Software"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_sourceName_fkey" FOREIGN KEY ("sourceName") REFERENCES "PackageSource"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
