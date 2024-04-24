import { isYoungerThan24Hours } from '../../src/helpers/TimeHelpers';

test('isYoungerThan24Hours', () => {
  const currentDate = new Date();
  const olderDate = new Date(currentDate);
  olderDate.setHours(currentDate.getHours() - 25);

  expect(isYoungerThan24Hours(currentDate)).toBe(true);
  expect(isYoungerThan24Hours(olderDate)).toBe(false);
});
