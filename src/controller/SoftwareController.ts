import { prisma } from '../data-source';
import { Prisma } from '@prisma/client';
import { SoftwareSourceData } from '../helpers/DatabaseHelpers';

class SoftwareController {
  async create(data: Prisma.SoftwareCreateInput) {
    return prisma.software.create({ data });
  }

  async getById(id: string) {
    return prisma.software.findUnique({ where: { id } });
  }

  async getManyByName(name: string) {
    const result =
      await prisma.$queryRaw`SELECT * FROM "Software" WHERE name ILIKE '%' || ${name} || '%' OR name % ${name};`;

    return result;
  }

  async getByName(name: string) {
    return prisma.software.findFirst({
      where: { name },
      include: {
        softwareOnSources: {
          select: {
            instructions: true,
            installCommand: true,
            downloadLink: true,
            source: true,
          },
        },
      },
    });
  }

  async getAll() {
    return prisma.software.findMany();
  }

  async getAllWithSources() {
    return prisma.software.findMany({
      include: {
        softwareOnSources: {
          select: {
            installCommand: true,
            downloadLink: true,
            instructions: true,
            source: true,
          },
        },
      },
    });
  }

  async upsert(data: SoftwareSourceData) {
    return prisma.software.upsert({
      where: { name: data.softwareData.name },
      create: {
        ...data.softwareData,
        softwareOnSources: {
          create: {
            ...data.softwareSourceData,
            source: { connect: { name: data.softwareSourceData.source } },
          },
        },
      },

      update: data.softwareData,
    });
  }

  async delete(id: string) {
    return prisma.software.delete({ where: { id } });
  }
}

export default SoftwareController;
