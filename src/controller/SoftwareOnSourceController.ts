import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

class SoftwareOnSourceController {
  async create(data: Prisma.SoftwareOnSourceCreateInput) {
    return prisma.softwareOnSource.create({ data });
  }

  async getBySoftwareId(softwareId: string) {
    return prisma.softwareOnSource.findFirst({ where: { softwareId } });
  }

  async getBySourceId(sourceId: string) {
    return prisma.softwareOnSource.findFirst({ where: { sourceId } });
  }

  async getByDistroId(distroId: string) {
    return prisma.softwareOnSource.findFirst({ where: { distroId } });
  }

  async updateBySoftwareId(
    softwareId: string,
    data: Prisma.SoftwareOnSourceUpdateInput
  ) {
    return prisma.softwareOnSource.updateMany({ where: { softwareId }, data });
  }

  async updateBySourceId(
    sourceId: string,
    data: Prisma.SoftwareOnSourceUpdateInput
  ) {
    return prisma.softwareOnSource.updateMany({ where: { sourceId }, data });
  }

  async updateByDistroId(
    distroId: string,
    data: Prisma.SoftwareOnSourceUpdateInput
  ) {
    return prisma.softwareOnSource.updateMany({ where: { distroId }, data });
  }

  async deleteBySoftwareID(softwareId: string) {
    return prisma.softwareOnSource.deleteMany({ where: { softwareId } });
  }

  async deleteBySourceId(sourceId: string) {
    return prisma.softwareOnSource.deleteMany({ where: { sourceId } });
  }

  async deleteByDistroId(distroId: string) {
    return prisma.softwareOnSource.deleteMany({ where: { distroId } });
  }

  async getAll() {
    return prisma.softwareOnSource.findMany();
  }
}
