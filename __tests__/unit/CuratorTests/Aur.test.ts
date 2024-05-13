import { requestSinglePackageFromAur } from '../../../src/curator/sources/arch_aur';
import axios from 'axios';

jest.mock('axios');

describe('requestSinglePackageFromAur', () => {
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
