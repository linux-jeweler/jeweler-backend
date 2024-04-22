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
