-- CreateTable
CREATE TABLE "PackageSource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "info" TEXT,
    "description" TEXT,
    "trustedStatus" BOOLEAN NOT NULL,

    CONSTRAINT "PackageSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "dependencies" TEXT,
    "description" TEXT,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "license" TEXT,
    "url" TEXT,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinuxDistro" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "LinuxDistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackageSourceToSoftware" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LinuxDistroToPackageSource" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PackageSourceToSoftware_AB_unique" ON "_PackageSourceToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_PackageSourceToSoftware_B_index" ON "_PackageSourceToSoftware"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LinuxDistroToPackageSource_AB_unique" ON "_LinuxDistroToPackageSource"("A", "B");

-- CreateIndex
CREATE INDEX "_LinuxDistroToPackageSource_B_index" ON "_LinuxDistroToPackageSource"("B");

-- AddForeignKey
ALTER TABLE "_PackageSourceToSoftware" ADD CONSTRAINT "_PackageSourceToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "PackageSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackageSourceToSoftware" ADD CONSTRAINT "_PackageSourceToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToPackageSource" ADD CONSTRAINT "_LinuxDistroToPackageSource_A_fkey" FOREIGN KEY ("A") REFERENCES "LinuxDistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinuxDistroToPackageSource" ADD CONSTRAINT "_LinuxDistroToPackageSource_B_fkey" FOREIGN KEY ("B") REFERENCES "PackageSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
