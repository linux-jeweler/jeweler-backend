import { requestSinglePackageFromAur } from '../../../src/curator/sources/arch_aur';
import axios from 'axios';

jest.mock('axios');

afterEach(() => {
  jest.clearAllMocks();
});

describe('requestSinglePackageFromAur', () => {
  describe('when exactly one package is found', () => {
    it('should return package data', async () => {
      const packageData = {
        resultcount: 1,
        results: [
          {
            name: 'test',
            version: '1.0.0',
            description: 'test',
            url: 'https://test.com',
            license: ['MIT'],
            dependencies: ['test'],
            lastModified: new Date(),
          },
        ],
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: packageData });

      const result = await requestSinglePackageFromAur('test');
      expect(result.name).toEqual(packageData.results[0].name);
    });
  });

  describe('when no package is found', () => {
    it('should return null', async () => {
      const packageData = {
        resultcount: 0,
        results: [],
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: packageData });

      const result = await requestSinglePackageFromAur('test');
      expect(result).toBeNull();
    });
  });

  describe('when multiple packages are found', () => {
    it('should return null', async () => {
      const packageData = {
        resultcount: 2,
        results: [
          {
            name: 'test',
            version: '1.0.0',
            description: 'test',
            url: 'https://test.com',
            license: ['MIT'],
            dependencies: ['test'],
            lastModified: new Date(),
          },
          {
            name: 'test',
            version: '1.0.0',
            description: 'test',
            url: 'https://test.com',
            license: ['MIT'],
            dependencies: ['test'],
            lastModified: new Date(),
          },
        ],
      };

      (axios.get as jest.Mock).mockResolvedValue({ data: packageData });

      const result = await requestSinglePackageFromAur('test');
      expect(result).toBeNull();
    });
  });

  describe('when an error occurs', () => {
    it('should log the error', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error());
      jest.spyOn(console, 'error').mockImplementation();
    });
  });
});
