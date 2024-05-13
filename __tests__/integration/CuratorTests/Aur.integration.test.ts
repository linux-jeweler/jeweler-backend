import { requestSinglePackageFromAur } from '../../../src/curator/sources/arch_aur';

describe('requestSinglePackageFromAur', () => {
  describe('when exactly one package is found', () => {
    it('should return package data', async () => {
      const response = await requestSinglePackageFromAur('vscodium');
      expect(response.Name).toEqual('vscodium');
    });
  });

  describe('when no package is found', () => {
    it('should return null', async () => {
      const response = await requestSinglePackageFromAur(
        'thisPackageDoesNotExist'
      );
      expect(response).toBeNull();
    });
  });

  describe('when error occurs', () => {});
});
