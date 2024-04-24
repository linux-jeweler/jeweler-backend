import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

class UserController {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}

export default UserController;
