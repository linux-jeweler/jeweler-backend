import UserController from '../../src/controller/UserController';
import { prisma } from '../../src/data-source';

test('userController', async () => {
  const uc = new UserController();
  const user = await uc.create({ email: 'test@test.de', password: 'test' });

  expect(user.email).toBe('test@test.de');
});

describe('userController', () => {
  describe('create', () => {
    it('creates a user', async () => {
      const uc = new UserController();
      const user = await uc.create({ email: 'test@test.de', password: 'test' });

      expect(user.email).toBe('test@test.de');
      expect(user.password).toBe('test');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();

      expect(await prisma.user.findUnique({ where: { id: user.id } })).toEqual(
        user
      );
    });
  });

  describe('getById', () => {
    it('gets a user by id', async () => {});
  });
});
