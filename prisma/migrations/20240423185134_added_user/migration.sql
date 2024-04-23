/*
  Warnings:

  - A unique constraint covering the columns `[name,version]` on the table `LinuxDistro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PackageSource` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Software" ALTER COLUMN "lastRequested" DROP DEFAULT,
ALTER COLUMN "lastRequested" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LinuxDistroToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SoftwareToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LinuxDistroToUser_AB_unique" ON "_LinuxDistroToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LinuxDistroToUser_B_index" ON "_LinuxDistroToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SoftwareToUser_AB_unique" ON "_SoftwareToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SoftwareToUser_B_index" ON "_SoftwareToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "LinuxDistro_name_version_key" ON "LinuxDistro"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "PackageSource_name_key" ON "PackageSource"("name");

-- AddForeignKey
ALTER TABLE "_LinuxDistroToUser" ADD CONSTRAINT "_LinuxDistroToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LinuxDistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToUser" ADD CONSTRAINT "_LinuxDistroToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SoftwareToUser" ADD CONSTRAINT "_SoftwareToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SoftwareToUser" ADD CONSTRAINT "_SoftwareToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
