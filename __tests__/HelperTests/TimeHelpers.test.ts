import { isYoungerThan24Hours } from '../../src/helpers/TimeHelpers';

test('isYoungerThan24Hours', () => {
  const currentDate = new Date();
  const olderDate = new Date(currentDate);
  olderDate.setHours(currentDate.getHours() - 25);

  expect(isYoungerThan24Hours(currentDate)).toBe(true);
  expect(isYoungerThan24Hours(olderDate)).toBe(false);
});
import { getTodaysDate } from '../../src/helpers/TimeHelpers';

test('getTodaysDate', () => {
  const currentDate = new Date();
  const expectedDate = currentDate.toISOString().split('T')[0];

  const result = getTodaysDate();

  expect(result).toBe(expectedDate);
});
