import { Prisma, PrismaClient } from '@prisma/client';
//import { prisma } from '../data-source';

class UserController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async getById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}

export default UserController;
