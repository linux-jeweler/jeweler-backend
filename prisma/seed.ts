import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSoftware() {
  try {
    const softwareData = [
      { name: 'slack', version: '1.0.0' },
      { name: 'vscode', version: '2.3.1' },
      { name: 'discord', version: '3.2.0' },
    ];

    const packageSourceData = [
      { name: 'aur', url: 'https://aur.archlinux.org/', trustedStatus: true },
      { name: 'snap', url: 'https://snapcraft.io/', trustedStatus: true },
      { name: 'flathub', url: 'https://flathub.org/', trustedStatus: true },
    ];

    const distroData = [
      { name: 'arch', version: '2024.04.01' },
      { name: 'ubuntu', version: '23.10' },
      { name: 'fedora', version: 'F39' },
    ];

    await prisma.software.createMany({ data: softwareData });
    await prisma.packageSource.createMany({ data: packageSourceData });
    await prisma.linuxDistro.createMany({ data: distroData });

    console.log('Software seeding completed.');
  } catch (error) {
    console.error('Error seeding software:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSoftware();
