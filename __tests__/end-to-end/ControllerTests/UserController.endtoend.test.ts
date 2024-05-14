import { PrismaClient } from "@prisma/client";
import UserController from "../../../src/controller/UserController";

let prisma: PrismaClient;

beforeAll(() => {
  prisma = new PrismaClient();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('login', () => {}