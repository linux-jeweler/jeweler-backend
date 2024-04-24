import { prisma } from '../data-source';
import { Prisma } from '@prisma/client';

class SoftwareOnSourceController {
  //Creating a new entry in the database
  async create(data: Prisma.SoftwareOnSourceCreateInput) {
    return prisma.softwareOnSource.create({ data });
  }

  async getManyByName(name: string, distro: string) {
    return prisma.softwareOnSource.findMany({
      where: { distroName: distro, softwareName: { search: name } },
    });
  }

  async getAll() {
    return prisma.softwareOnSource.findMany();
  }
}
