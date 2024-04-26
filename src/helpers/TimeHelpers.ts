import dayjs from 'dayjs';

// Takes in a date and checks if it is younger than 24 hours
export function isYoungerThan24Hours(date: Date): boolean {
  // Get the current date and time
  const currentDate = dayjs();

  // Calculate the date and time 24 hours from now‚
  const twentyFourHoursAgo = currentDate.subtract(24, 'hour');

  // Check if the date is younger than 24 hours
  return dayjs(date).isAfter(twentyFourHoursAgo);
}

export function getTodaysDate() {
  const today = dayjs().format('YYYY-MM-DD');
  return today;
}

export function isOlderThanOneWeek(date: Date): boolean {
  // Get the current date and time
  const currentDate = dayjs();

  // Calculate the date and time 7 days ago
  const oneWeekAgo = currentDate.subtract(7, 'day');

  // Check if the date is older than one week
  return dayjs(date).isBefore(oneWeekAgo);
}
