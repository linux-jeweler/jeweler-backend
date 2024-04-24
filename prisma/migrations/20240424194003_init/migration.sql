-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateTable
CREATE TABLE "LinuxDistro" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "LinuxDistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "info" TEXT,
    "description" TEXT,
    "url" TEXT,
    "trustedStatus" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "dependencies" TEXT[],
    "description" TEXT,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "license" TEXT[],
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareOnSource" (
    "softwareName" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "distroName" TEXT NOT NULL,
    "installCommand" TEXT,
    "instructions" TEXT,
    "downloadLink" TEXT,

    CONSTRAINT "SoftwareOnSource_pkey" PRIMARY KEY ("softwareName","sourceName","distroName")
);

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
CREATE TABLE "_LinuxDistroToPackageSource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LinuxDistroToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackageSourceToSoftware" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SoftwareToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LinuxDistro_name_key" ON "LinuxDistro"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LinuxDistro_name_version_key" ON "LinuxDistro"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "PackageSource_name_key" ON "PackageSource"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_key" ON "Software"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Software_name_version_key" ON "Software"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_LinuxDistroToPackageSource_AB_unique" ON "_LinuxDistroToPackageSource"("A", "B");

-- CreateIndex
CREATE INDEX "_LinuxDistroToPackageSource_B_index" ON "_LinuxDistroToPackageSource"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinuxDistroToUser_AB_unique" ON "_LinuxDistroToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LinuxDistroToUser_B_index" ON "_LinuxDistroToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackageSourceToSoftware_AB_unique" ON "_PackageSourceToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_PackageSourceToSoftware_B_index" ON "_PackageSourceToSoftware"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SoftwareToUser_AB_unique" ON "_SoftwareToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SoftwareToUser_B_index" ON "_SoftwareToUser"("B");

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_distroName_fkey" FOREIGN KEY ("distroName") REFERENCES "LinuxDistro"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_softwareName_fkey" FOREIGN KEY ("softwareName") REFERENCES "Software"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_sourceName_fkey" FOREIGN KEY ("sourceName") REFERENCES "PackageSource"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToPackageSource" ADD CONSTRAINT "_LinuxDistroToPackageSource_A_fkey" FOREIGN KEY ("A") REFERENCES "LinuxDistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToPackageSource" ADD CONSTRAINT "_LinuxDistroToPackageSource_B_fkey" FOREIGN KEY ("B") REFERENCES "PackageSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToUser" ADD CONSTRAINT "_LinuxDistroToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "LinuxDistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToUser" ADD CONSTRAINT "_LinuxDistroToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageSourceToSoftware" ADD CONSTRAINT "_PackageSourceToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "PackageSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageSourceToSoftware" ADD CONSTRAINT "_PackageSourceToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SoftwareToUser" ADD CONSTRAINT "_SoftwareToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SoftwareToUser" ADD CONSTRAINT "_SoftwareToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
