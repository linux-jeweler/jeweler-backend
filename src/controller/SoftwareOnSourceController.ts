import { prisma } from '../data-source';
import { Prisma } from '@prisma/client';

class SoftwareOnSourceController {
  //Creating a new entry in the database
  async create(data: Prisma.SoftwareOnSourceCreateInput) {
    return prisma.softwareOnSource.create({ data });
  }

  async getManyByName(name: string) {
    const result =
      await prisma.$queryRaw`SELECT * FROM "Software" WHERE softwareName ILIKE '%' || ${name} || '%' OR name % ${name};`;

    return result;
  }

  async getAll() {
    return prisma.softwareOnSource.findMany();
  }
}
