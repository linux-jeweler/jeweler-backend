import UserController from '../../../src/controller/UserController';
import { prisma } from '../../../src/data-source';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController();
  });

  afterEach(async () => {
    // Clean up created users after each test
    await prisma.user.deleteMany();
  });

  describe('create', () => {
    it('creates a user', async () => {
      const user = await userController.create({
        email: 'test@test.de',
        password: 'test',
      });

      expect(user.email).toBe('test@test.de');
      expect(user.password).toBe('test');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();

      const retrievedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(retrievedUser).toEqual(user);
    });
  });

  describe('getById', () => {
    it('gets a user by id', async () => {
      const createdUser = await prisma.user.create({
        data: { email: 'test@test.de', password: 'test' },
      });
      const user = await userController.getById(createdUser.id);

      expect(user).toEqual(createdUser);
    });
  });

  describe('getByEmail', () => {
    it('gets a user by email', async () => {
      const createdUser = await prisma.user.create({
        data: { email: 'test@test.de', password: 'test' },
      });
      const user = await userController.getByEmail(createdUser.email);

      expect(user).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('updates a user', async () => {
      const createdUser = await prisma.user.create({
        data: { email: 'test@test.de', password: 'test' },
      });
      const updatedUser = await userController.update(createdUser.id, {
        email: 'updated@test.de',
      });

      expect(updatedUser.email).toBe('updated@test.de');
      expect(updatedUser.password).toBe('test');
      expect(updatedUser.id).toBe(createdUser.id);
      expect(updatedUser.createdAt).toBe(createdUser.createdAt);
    });
  });

  describe('delete', () => {
    it('deletes a user', async () => {
      const createdUser = await prisma.user.create({
        data: { email: 'test@test.de', password: 'test' },
      });
      await userController.delete(createdUser.id);

      const deletedUser = await prisma.user.findUnique({
        where: { id: createdUser.id },
      });
      expect(deletedUser).toBeNull();
    });
  });
});
