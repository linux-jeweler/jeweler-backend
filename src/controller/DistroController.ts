import { prisma } from '../data-source';
import { Prisma } from '@prisma/client';

class DistroController {
  async create(data: Prisma.LinuxDistroCreateInput) {
    return prisma.linuxDistro.create({ data });
  }

  async getById(id: string) {
    return prisma.linuxDistro.findUnique({ where: { id } });
  }

  async getAll() {
    return prisma.linuxDistro.findMany();
  }

  async update(id: string, data: Prisma.LinuxDistroUpdateInput) {
    return prisma.linuxDistro.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.linuxDistro.delete({ where: { id } });
  }
}

export default DistroController;
