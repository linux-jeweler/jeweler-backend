import request from 'supertest';
import { Response, NextFunction } from 'express';
import { auth, CustomRequest } from '../../../src/middleware/auth';
import AuthController from '../../../src/controller/AuthController';

jest.mock('../controller/AuthController');

describe('auth middleware', () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    } as unknown as CustomRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    } as unknown as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if token is present and valid', async () => {
    const token = 'valid_token';
    const decoded = { userId: 'user_id' };
    req.header.mockReturnValue(`Bearer ${token}`);
    AuthController.prototype.verifyJWT.mockResolvedValue(decoded);

    await auth(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(AuthController.prototype.verifyJWT).toHaveBeenCalledWith(token);
    expect(res.locals.userId).toBe(decoded);
    expect(res.locals.token).toBe(token);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 status and error message if token is missing', async () => {
    await auth(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(AuthController.prototype.verifyJWT).not.toHaveBeenCalled();
    expect(res.locals.userId).toBeUndefined();
    expect(res.locals.token).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Could not authenticate',
    });
  });

  it('should return 401 status and error message if token is invalid', async () => {
    const token = 'invalid_token';
    req.header.mockReturnValue(`Bearer ${token}`);
    AuthController.prototype.verifyJWT.mockResolvedValue(null);

    await auth(req, res, next);

    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(AuthController.prototype.verifyJWT).toHaveBeenCalledWith(token);
    expect(res.locals.userId).toBeUndefined();
    expect(res.locals.token).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Could not authenticate',
    });
  });
});
