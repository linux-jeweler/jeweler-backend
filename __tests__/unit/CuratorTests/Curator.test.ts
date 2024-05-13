import { insertIntoDatabase } from '../../../src/curator/curator';
import { SoftwareSourceData } from '../../../src/helpers/DatabaseHelpers';
import { prisma } from '../../../src/data-source';

describe('insertIntoDatabase', () => {
  it('should insert a package into the database', async () => {
    const packageData: SoftwareSourceData = {
      softwareData: {
        name: 'test',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
        url: 'https://test.com',
      },
      softwareSourceData: {
        source: 'test',
        instructions: 'test',
        installCommand: 'test',
        downloadLink: 'https://test.com',
      },
    };

    await insertIntoDatabase(packageData);
    const insertedPackage = await prisma.software.findUnique({
      where: { name: 'test' },
    });
    expect(insertedPackage).toBeDefined();
  });
});
