import { checkRecentFileExists } from '../../src/helpers/FileHelpers';
import fs from 'fs';

jest.mock('fs');

describe('checkRecentFileExists', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should resolve with true if file exists and has today's date", async () => {
    const filePath = '/path/to/file_2024-04-25.txt';
    const today = '2024-04-25';

    const result = await checkRecentFileExists(filePath);

    expect(fs.access).toHaveBeenCalledWith(
      filePath,
      fs.constants.F_OK,
      expect.any(Function)
    );
    expect(result).toBe(true);
  });

  test('should resolve with false if file does not exist', async () => {
    const filePath = '/path/to/nonexistent_file.txt';

    const result = await checkRecentFileExists(filePath);

    expect(fs.access).toHaveBeenCalledWith(
      filePath,
      fs.constants.F_OK,
      expect.any(Function)
    );
    expect(result).toBe(false);
  });

  test("should resolve with false if file exists but does not have today's date", async () => {
    const filePath = '/path/to/file_2022-01-02.txt';
    const today = '2022-01-01';

    const result = await checkRecentFileExists(filePath);

    expect(fs.access).toHaveBeenCalledWith(
      filePath,
      fs.constants.F_OK,
      expect.any(Function)
    );
    expect(result).toBe(false);
  });

  test('should resolve with false if error occurs while accessing file', async () => {
    const filePath = '/path/to/file.txt';
    const mockFsAccess = jest.fn((_path, _flags, callback) => {
      callback(null);
    });

    const result = await checkRecentFileExists(filePath);

    expect(fs.access).toHaveBeenCalledWith(
      filePath,
      fs.constants.F_OK,
      expect.any(Function)
    );
    expect(result).toBe(false);
  });
});
