import { Prisma } from '@prisma/client';
import SoftwareController from '../../../src/controller/SoftwareController';
import { prisma } from '../../../src/data-source';

describe('SoftwareController', () => {
  let softwareController: SoftwareController;

  beforeEach(() => {
    softwareController = new SoftwareController();
  });

  afterEach(() => {
    prisma.software.deleteMany();
  });

  describe('create', () => {
    it('should create a new software', async () => {
      const softwareData: Prisma.SoftwareCreateInput = {
        name: 'Test Software',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const software = await softwareController.create(softwareData);

      expect(software).toHaveProperty('id');
      expect(software.name).toEqual(softwareData.name);
      expect(software.version).toEqual(softwareData.version);
      expect(software.dependencies).toEqual(softwareData.dependencies);
      expect(software.description).toEqual(softwareData.description);
    });
  });

  describe('getById', () => {
    it('should get a software by id', async () => {
      const softwareData: Prisma.SoftwareCreateInput = {
        name: 'Test Software',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const createdSoftware = await prisma.software.create({
        data: softwareData,
      });
      const software = await softwareController.getById(createdSoftware.id);

      expect(software).toEqual(createdSoftware);
    });
  });
});
