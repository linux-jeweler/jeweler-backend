import AuthController from '../../../src/controller/AuthController';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe('hashPassword', () => {
    it('should hash the password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await authController.hashPassword(plainPassword);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(plainPassword);
    });
  });

  describe('verifyPassword', () => {
    it('should verify the password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await authController.hashPassword(plainPassword);
      const isPasswordValid = await authController.verifyPassword(
        plainPassword,
        hashedPassword
      );
      expect(isPasswordValid).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await authController.hashPassword(plainPassword);
      const isPasswordValid = await authController.verifyPassword(
        'wrongpassword',
        hashedPassword
      );
      expect(isPasswordValid).toBe(false);
    });
  });

  describe('generateJWT', () => {
    it('should generate a JWT token', () => {
      const userId = '123';
      const token = authController.generateJWT(userId);
      expect(token).toBeDefined();
    });
  });

  describe('verifyJWT', () => {
    it('should verify a valid JWT token', async () => {
      const userId = '123';
      const token = authController.generateJWT(userId);
      const verifiedUserId = await authController.verifyJWT(token);
      expect(verifiedUserId).toBe(userId);
    });

    it('should return false for an invalid JWT token', async () => {
      const invalidToken = 'invalidtoken';
      const verifiedUserId = await authController.verifyJWT(invalidToken);
      expect(verifiedUserId).toBe(false);
    });
  });
});
