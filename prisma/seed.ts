import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSoftware() {
  try {
    const softwareData = [
      { name: 'slack', version: '1.0.0', lastModified: new Date() },
      { name: 'vscode', version: '2.3.1', lastModified: new Date() },
      { name: 'discord', version: '3.2.0', lastModified: new Date() },
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

    for (const software of softwareData) {
      const softwareExists = await prisma.software.findFirst({
        where: { name: software.name, version: software.version },
      });

      if (!softwareExists) {
        await prisma.software.create({ data: software });
      }
    }

    for (const source of packageSourceData) {
      const sourceExists = await prisma.packageSource.findFirst({
        where: { name: source.name },
      });

      if (!sourceExists) {
        await prisma.packageSource.create({ data: source });
      }
    }

    for (const distro of distroData) {
      const distroExists = await prisma.linuxDistro.findFirst({
        where: { name: distro.name, version: distro.version },
      });

      if (!distroExists) {
        await prisma.linuxDistro.create({ data: distro });
      }
    }

    console.log('Software seeding completed.');
  } catch (error) {
    console.error('Error seeding software:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSoftware();
