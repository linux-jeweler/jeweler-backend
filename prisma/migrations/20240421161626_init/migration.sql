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

    CONSTRAINT "PackageSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "dependencies" TEXT[],
    "description" TEXT,
    "lastModified" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "license" TEXT[],
    "url" TEXT,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareOnSource" (
    "softwareId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "distroId" TEXT NOT NULL,
    "installCommand" TEXT,
    "instructions" TEXT,
    "downloadLink" TEXT,

    CONSTRAINT "SoftwareOnSource_pkey" PRIMARY KEY ("softwareId","sourceId","distroId")
);

-- CreateTable
CREATE TABLE "_LinuxDistroToPackageSource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PackageSourceToSoftware" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LinuxDistroToPackageSource_AB_unique" ON "_LinuxDistroToPackageSource"("A", "B");

-- CreateIndex
CREATE INDEX "_LinuxDistroToPackageSource_B_index" ON "_LinuxDistroToPackageSource"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackageSourceToSoftware_AB_unique" ON "_PackageSourceToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_PackageSourceToSoftware_B_index" ON "_PackageSourceToSoftware"("B");

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES "Software"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "PackageSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareOnSource" ADD CONSTRAINT "SoftwareOnSource_distroId_fkey" FOREIGN KEY ("distroId") REFERENCES "LinuxDistro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToPackageSource" ADD CONSTRAINT "_LinuxDistroToPackageSource_A_fkey" FOREIGN KEY ("A") REFERENCES "LinuxDistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToPackageSource" ADD CONSTRAINT "_LinuxDistroToPackageSource_B_fkey" FOREIGN KEY ("B") REFERENCES "PackageSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageSourceToSoftware" ADD CONSTRAINT "_PackageSourceToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "PackageSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageSourceToSoftware" ADD CONSTRAINT "_PackageSourceToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;
