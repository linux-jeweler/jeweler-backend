import { Prisma } from '@prisma/client';
import SoftwareController from '../../../src/controller/SoftwareController';
import { prisma } from '../../../src/data-source';
import exp from 'constants';

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

      const createdSoftware = await softwareController.create(softwareData);
      const software = await softwareController.getById(createdSoftware.id);

      expect(software).toEqual(createdSoftware);
    });
  });

  describe('getManyByName', () => {
    it('should get software by fuzzy name', async () => {
      const softwareData = {
        name: 'Similar Name',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const createdSoftware = await softwareController.create(softwareData);
      const result = await softwareController.getManyByName('Similar');

      expect(softwareData.name).toEqual(createdSoftware.name);
    });
  });

  describe('getByName', () => {
    it('should get a software by name', async () => {
      const softwareData: Prisma.SoftwareCreateInput = {
        name: 'Test Software',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const createdSoftware = await softwareController.create(softwareData);
      const software = await softwareController.getByName('Test Software');

      expect(software?.name).toEqual(createdSoftware.name);
    });
  });

  describe('getAll', () => {
    it('should get all software', async () => {
      const softwareData1: Prisma.SoftwareCreateInput = {
        name: 'Test Software 1',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const softwareData2: Prisma.SoftwareCreateInput = {
        name: 'Test Software 2',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      await softwareController.create(softwareData1);
      await softwareController.create(softwareData2);

      const result = await softwareController.getAll();

      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getAllWithSources', () => {
    it('should get all software with sources', async () => {
      const softwareData1: Prisma.SoftwareCreateInput = {
        name: 'Test Software 1',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const softwareData2: Prisma.SoftwareCreateInput = {
        name: 'Test Software 2',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      await softwareController.create(softwareData1);
      await softwareController.create(softwareData2);

      const result = await softwareController.getAllWithSources();

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0].softwareOnSources).toBeDefined();
    });
  });

  describe('upsert', () => {
    it('should upsert a software', async () => {
      const packageData = {
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

      const software = await softwareController.upsert(packageData);

      expect(software).toHaveProperty('id');
      expect(software.name).toEqual(packageData.softwareData.name);
      expect(software.version).toEqual(packageData.softwareData.version);
      expect(software.dependencies).toEqual(
        packageData.softwareData.dependencies
      );
      expect(software.description).toEqual(
        packageData.softwareData.description
      );
    });
  });

  describe('delete', () => {
    it('should delete a software', async () => {
      const softwareData: Prisma.SoftwareCreateInput = {
        name: 'Test Software',
        version: '1.0.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: new Date(),
        license: ['MIT'],
      };

      const createdSoftware = await softwareController.create(softwareData);
      const software = await softwareController.getById(createdSoftware.id);

      expect(software).toEqual(createdSoftware);

      await softwareController.delete(createdSoftware.id);

      const deletedSoftware = await softwareController.getById(
        createdSoftware.id
      );

      expect(deletedSoftware).toBeNull();
    });
  });

  describe('deleteSource', () => {
    it('should delete a source', async () => {
      const packageData = {
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

      const software = await softwareController.upsert(packageData);
      const softwareWithSource = await softwareController.getByName(
        software.name
      );
      expect(softwareWithSource?.softwareOnSources).toBeDefined();
      await softwareController.deleteSource(software.name, 'test');
      const updatedSoftware = await softwareController.getByName(software.name);
      expect(updatedSoftware).not.toHaveProperty('softwareOnSources');
    });
  });
});
