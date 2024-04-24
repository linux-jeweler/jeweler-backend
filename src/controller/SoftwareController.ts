import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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
    return prisma.software.findFirst({ where: { name } });
  }

  async getAll() {
    return prisma.software.findMany();
  }

  async update(id: string, data: Prisma.SoftwareUpdateInput) {
    return prisma.software.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.software.delete({ where: { id } });
  }
}

export default SoftwareController;
