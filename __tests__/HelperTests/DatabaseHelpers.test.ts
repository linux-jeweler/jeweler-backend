import dayjs from 'dayjs';
import {
  hasBeenModified,
  convertFromAurToDatabaseFormat,
  AurPackageInfo,
  SoftwareData,
  SoftwareSourceData,
} from '../../src/helpers/DatabaseHelpers';

describe('hasBeenModified', () => {
  describe('when the AUR entry has been modified', () => {
    it('returns true', () => {
      const aurEntry: AurPackageInfo = {
        ID: 1,
        Name: 'test',
        PackageBaseID: 1,
        PackageBase: 'test',
        Version: '1.0',
        Description: 'test',
        URL: 'test',
        NumVotes: 1,
        Popularity: 1,
        OutOfDate: 1,
        Maintainer: 'test',
        Submitter: 'test',
        FirstSubmitted: 1,
        LastModified: dayjs().unix(),
        URLPath: 'test',
        Depends: ['test'],
        MakeDepends: ['test'],
        License: ['test'],
        Keywords: ['test'],
      };
      const databaseEntry: SoftwareData = {
        name: 'test',
        version: '1.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: dayjs().subtract(1, 'day').toDate(),
        license: ['test'],
        url: 'test',
      };

      const result = hasBeenModified(aurEntry, databaseEntry);

      expect(result).toBe(true);
    });
  });

  describe('when the AUR entry has not been modified', () => {
    it('returns false', () => {
      const aurEntry: AurPackageInfo = {
        ID: 1,
        Name: 'test',
        PackageBaseID: 1,
        PackageBase: 'test',
        Version: '1.0',
        Description: 'test',
        URL: 'test',
        NumVotes: 1,
        Popularity: 1,
        OutOfDate: 1,
        Maintainer: 'test',
        Submitter: 'test',
        FirstSubmitted: 1,
        LastModified: dayjs().unix(),
        URLPath: 'test',
        Depends: ['test'],
        MakeDepends: ['test'],
        License: ['test'],
        Keywords: ['test'],
      };
      const databaseEntry: SoftwareData = {
        name: 'test',
        version: '1.0',
        dependencies: ['test'],
        description: 'test',
        lastModified: dayjs().toDate(),
        license: ['test'],
        url: 'test',
      };

      const result = hasBeenModified(aurEntry, databaseEntry);

      expect(result).toBe(false);
    });
  });
});

describe('convertFromAurToDatabaseFormat', () => {
  describe('when the raw data is not in the correct format', () => {
    it('returns the data in the correct format', () => {
      const rawData = {
        ID: 1,
        Name: 'test',
        PackageBaseID: 1,
        PackageBase: 'test',
        Version: '1.0',
        Description: 'test',
        URL: 'test',
        NumVotes: 1,
        Popularity: 1,
        OutOfDate: 1,
        Maintainer: 'test',
        Submitter: 'test',
        FirstSubmitted: 1,
        LastModified: 1,
        URLPath: 'test',
        Depends: ['test'],
        MakeDepends: ['test'],
        License: ['test'],
        Keywords: ['test'],
      };

      const result: SoftwareSourceData =
        convertFromAurToDatabaseFormat(rawData);

      expect(result.softwareData.name).toBe('test');
      expect(result.softwareData.version).toBe('1.0');
      expect(result.softwareData.dependencies).toBeDefined();
      expect(result.softwareData.description).toBe('test');
      expect(result.softwareData.lastModified).toBeInstanceOf(Date);
      expect(result.softwareData.license).toEqual(['test']);
      expect(result.softwareData.url).toBe('test');
      expect(result.softwareSourceData.source).toBe('aur');
      expect(result.softwareSourceData.instructions).toBeDefined();
      expect(result.softwareSourceData.installCommand).toBeDefined();
      expect(result.softwareSourceData.downloadLink).toBeDefined();
    });
  });

  describe('when the raw data is in the correct format', () => {
    it('returns the data in the correct format', () => {
      const rawData = {
        ID: 1,
        Name: 'test',
        PackageBaseID: 1,
        PackageBase: 'test',
        Version: '1.0',
        Description: 'test',
        URL: 'test',
        NumVotes: 1,
        Popularity: 1,
        OutOfDate: 1,
        Maintainer: 'test',
        Submitter: 'test',
        FirstSubmitted: 1,
        LastModified: dayjs().toISOString(),
        URLPath: 'test',
        Depends: ['test'],
        MakeDepends: ['test'],
        License: ['test'],
        Keywords: ['test'],
      };

      const result: SoftwareSourceData =
        convertFromAurToDatabaseFormat(rawData);

      expect(result.softwareData.name).toBe('test');
      expect(result.softwareData.version).toBe('1.0');
      expect(result.softwareData.dependencies).toEqual(['test']);
      expect(result.softwareData.description).toBe('test');
      expect(result.softwareData.lastModified).toBeInstanceOf(Date);
      expect(result.softwareData.license).toEqual(['test']);
      expect(result.softwareData.url).toBe('test');
      expect(result.softwareSourceData.source).toBe('aur');
      expect(result.softwareSourceData.instructions).toBeDefined();
      expect(result.softwareSourceData.installCommand).toBeDefined();
      expect(result.softwareSourceData.downloadLink).toBeDefined();
    });
  });
});
