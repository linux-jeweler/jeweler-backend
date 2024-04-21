import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSoftware() {
  try {
    const softwareData = [
      { name: 'slack', version: '1.0.0' },
      { name: 'vscode', version: '2.3.1' },
      { name: 'discord', version: '3.2.0' },
    ];

    await prisma.software.createMany({ data: softwareData });

    console.log('Software seeding completed.');
  } catch (error) {
    console.error('Error seeding software:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSoftware();
