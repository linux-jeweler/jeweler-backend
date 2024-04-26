import { prisma } from '../data-source';
import { Prisma } from '@prisma/client';

class PackageSourceController {
  async create(data: Prisma.PackageSourceCreateInput) {
    return prisma.packageSource.create({ data });
  }

  async getById(id: string) {
    return prisma.packageSource.findUnique({ where: { id } });
  }

  async getAll() {
    return prisma.packageSource.findMany();
  }

  async update(id: string, data: Prisma.PackageSourceUpdateInput) {
    return prisma.packageSource.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.packageSource.delete({ where: { id } });
  }
}

export default PackageSourceController;
