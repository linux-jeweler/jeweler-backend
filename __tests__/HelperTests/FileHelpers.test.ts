import { checkRecentFileExists } from '../../src/helpers/FileHelpers';
import { getTodaysDate } from '../../src/helpers/TimeHelpers';
import fs from 'fs';

const today = getTodaysDate();

//Create test files before tests
beforeAll(() => {
  fs.rmSync('./__tests__/HelperTests/.Files', { recursive: true, force: true });
  fs.mkdirSync('./__tests__/HelperTests/.Files', { recursive: true });
  fs.writeFileSync(
    './__tests__/HelperTests/.Files/test_2024-04-29.json',
    'test'
  );
  fs.writeFileSync(
    './__tests__/HelperTests/.Files/test_' + today + '.json',
    'test'
  );
});

describe('checkRecentFileExists', () => {
  describe('when the file does not exist or is not recent', () => {
    it('returns false', async () => {
      const result = await checkRecentFileExists('test.txt');

      expect(result).toBe(false);
    });
  });
  describe('when the file exists but is not recent', () => {
    it('returns false', async () => {
      const result = await checkRecentFileExists(
        './__tests__/HelperTests/.Files/test_2024-04.29.json'
      );

      expect(result).toBe(false);
    });
  });
  describe('when the file exists and is recent', () => {
    it('returns true', async () => {
      const result = await checkRecentFileExists(
        './__tests__/HelperTests/.Files/test_' + today + '.json'
      );

      expect(result).toBe(true);
    });
  });
});
