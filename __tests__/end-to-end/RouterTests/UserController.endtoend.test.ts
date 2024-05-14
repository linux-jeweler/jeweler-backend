import { PrismaClient } from "@prisma/client";

const createServer = require('../../../src/server');
const request = require('supertest');
let prisma: PrismaClient;

const app = createServer();

beforeAll(() => {
  prisma = new PrismaClient();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /register', () => {
    describe('when the request is valid', () => {
        it('should return 201 and the user', async () => {
            const req = { body: 
          {
          email: 'test@test.te',
          password: 'testtest123'
          } 
        };

        const response = await request(app).post('/register').send(req).expect(201);
        expect(response.body.email).toBe('test@test.te');

        const user = await prisma.user.findUnique({
          where: { email: 'test@test.te' },
        });

        expect(user?.id).toBeDefined();
        expect(user?.email).toBe('test@test.te');

      });

    });
});