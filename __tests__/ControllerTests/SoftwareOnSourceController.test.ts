// import SoftwareOnSourceController from '../../src/controller/SoftwareOnSourceController';
// import { Prisma } from '@prisma/client';

// describe('SoftwareOnSourceController', () => {
//   afterEach(async () => {
//     // Clean up the database after each test
//     // await prisma.softwareOnSource.deleteMany();
//   });

//   test('update should update the software on source', async () => {
//     // Arrange
//     const controller = new SoftwareOnSourceController();
//     const softwareOnSourceId = {
//       softwareName: 'exampleSoftware',
//       sourceName: 'exampleSource',
//       distroName: 'exampleDistro',
//     };
//     const newData: Prisma.SoftwareOnSourceUpdateInput = {

//     };

//     // Act
//     const result = await controller.update(newData);

//     // Assert
//     expect(result).toBeDefined();
//     expect(result.softwareName).toBe(softwareOnSourceId.softwareName);
//     expect(result.sourceName).toBe(softwareOnSourceId.sourceName);
//     expect(result.distroName).toBe(softwareOnSourceId.distroName);
//     // Add more assertions based on your requirements
//   });
// });
