import UserController from '../../src/controller/UserController';

test('userController', async () => {
  const uc = new UserController();
  const user = await uc.create({ email: 'test@test.de', password: 'test' });

  expect(user.email).toBe('test@test.de');
});
