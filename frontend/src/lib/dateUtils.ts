
import { format, parse } from 'date-fns';

/**
 * Formats a Date object to Java LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
 */
export const formatForJavaLocalDateTime = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

/**
 * Creates a Date object from a date and time string
 */
export const createDateTimeFromInputs = (dateString: string, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(dateString);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Extracts date string (YYYY-MM-DD) from a Date object
 */
export const extractDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Extracts time string (HH:mm) from a Date object
 */
export const extractTimeString = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * Parses Java LocalDateTime string to Date object
 */
export const parseJavaLocalDateTime = (dateTimeString: string): Date => {
  try {
    // Handle both with and without 'T' separator
    const normalizedString = dateTimeString.includes('T') 
      ? dateTimeString 
      : dateTimeString.replace(' ', 'T');
    
    return new Date(normalizedString);
  } catch (error) {
    console.error('Error parsing Java LocalDateTime:', dateTimeString, error);
    return new Date();
  }
};

/**
 * Validates that start time is before end time
 */
export const validateTimeRange = (startDate: Date, endDate: Date): boolean => {
  return startDate < endDate;
};
