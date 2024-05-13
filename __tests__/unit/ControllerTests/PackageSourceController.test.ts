import { prisma } from '../../../src/data-source';
import PackageSourceController from '../../../src/controller/PackageSourceController';

describe('PackageSourceController', () => {
  let packageSourceController: PackageSourceController;

  beforeEach(() => {
    packageSourceController = new PackageSourceController();
  });

  afterEach(async () => {
    await prisma.packageSource.deleteMany();
  });

  it('should create a new package source', async () => {
    const data = {
      name: 'Test Source',
      trustedStatus: true,
    };

    const result = await packageSourceController.create(data);

    expect(result).toHaveProperty('id');
    expect(result.name).toEqual(data.name);
    expect(result.trustedStatus).toEqual(data.trustedStatus);
  });

  it('should get a package source by id', async () => {
    const data = {
      name: 'Test Source',
      trustedStatus: true,
    };

    const createdSource = await packageSourceController.create(data);
    const result = await packageSourceController.getById(createdSource.id);

    expect(result).toEqual(createdSource);
  });

  it('should get all package sources', async () => {
    const data1 = {
      name: 'Test Source 1',
      trustedStatus: true,
    };

    const data2 = {
      name: 'Test Source 2',
      trustedStatus: false,
    };

    await packageSourceController.create(data1);
    await packageSourceController.create(data2);

    const result = await packageSourceController.getAll();

    expect(result.length).toBeGreaterThanOrEqual(2);
    expect(result).toContainEqual(expect.objectContaining(data1));
    expect(result).toContainEqual(expect.objectContaining(data2));
  });

  it('should update a package source', async () => {
    const data = {
      name: 'Test Source',
      trustedStatus: true,
    };

    const createdSource = await packageSourceController.create(data);

    const updatedData = {
      name: 'Updated Source',
      trustedStatus: false,
    };

    const result = await packageSourceController.update(
      createdSource.id,
      updatedData
    );

    expect(result).toHaveProperty('id');
    expect(result.name).toEqual(updatedData.name);
    expect(result.trustedStatus).toEqual(updatedData.trustedStatus);
  });

  it('should delete a package source', async () => {
    const data = {
      name: 'Test Source',
      trustedStatus: true,
    };

    const createdSource = await packageSourceController.create(data);
    const result = await packageSourceController.delete(createdSource.id);

    expect(result).toEqual(createdSource);
  });
});
