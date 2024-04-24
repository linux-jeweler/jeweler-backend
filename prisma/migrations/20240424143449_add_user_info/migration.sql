/*
  Warnings:

  - You are about to drop the column `lastRequested` on the `Software` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `PackageSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Software` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackageSource" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Software" DROP COLUMN "lastRequested",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
