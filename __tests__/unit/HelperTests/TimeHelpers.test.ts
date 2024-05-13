import {
  isYoungerThan24Hours,
  getTodaysDate,
  isOlderThanOneWeek,
} from '../../../src/helpers/TimeHelpers';

describe('isYoungerThan24Hours', () => {
  describe('when the date is older than 24 hours', () => {
    it('returns false', () => {
      const currentDate = new Date();
      const olderDate = new Date(currentDate);
      olderDate.setHours(currentDate.getHours() - 25);

      expect(isYoungerThan24Hours(olderDate)).toBe(false);
    });
  });

  describe('when the date is younger than 24 hours', () => {
    it('returns true', () => {
      const currentDate = new Date();

      expect(isYoungerThan24Hours(currentDate)).toBe(true);
    });
  });
});

describe('getTodaysDate', () => {
  it('returns the current date', () => {
    const currentDate = new Date();
    const expectedDate = currentDate.toISOString().split('T')[0];

    const result = getTodaysDate();

    expect(result).toBe(expectedDate);
  });
});

describe('isOlderThanOneWeek', () => {
  describe('when the date is older than one week', () => {
    it('returns true', () => {
      const currentDate = new Date();
      const olderDate = new Date(currentDate);
      olderDate.setDate(currentDate.getDate() - 8);

      expect(isOlderThanOneWeek(olderDate)).toBe(true);
    });
  });

  describe('when the date is younger than one week', () => {
    it('returns false', () => {
      const currentDate = new Date();

      expect(isOlderThanOneWeek(currentDate)).toBe(false);
    });
  });
});
