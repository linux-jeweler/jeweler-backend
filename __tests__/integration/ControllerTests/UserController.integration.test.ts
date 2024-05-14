import { PrismaClient } from "@prisma/client";
import UserController from '../../../src/controller/UserController';

let prisma: PrismaClient;

beforeAll(() => {
  prisma = new PrismaClient();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("UserController", () => {
    let userController: UserController;
    
    beforeEach(() => {
        userController = new UserController();
    });
    
    afterEach(async () => {
        await prisma.user.deleteMany();
    });
    
    describe("create", () => {
        it("creates a user", async () => {
            const user = await userController.create({
                email: "test@test.te",
                password: "test",
            });

            expect(user.email).toBe("test@test.te");
            expect(user.password).toBe("test");
            
            expect(user.id).toBeDefined();
            expect(user.createdAt).toBeDefined();
            expect(user.updatedAt).toBeDefined();
        });
    });

    describe("getById", () => {
        it("gets a user by id", async () => {
            const createdUser = await userController.create({
                email: "test@test.te",
                password: "test"
            });
            const user = await userController.getById(createdUser.id);

            expect(user?.email).toBe(createdUser.email);
            expect(user?.password).toBe(createdUser.password);
        });
    });
});
