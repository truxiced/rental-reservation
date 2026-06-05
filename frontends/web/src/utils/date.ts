import { format, parseISO } from "date-fns";

/**
 * Formats a YYYY-MM-DD date string for display.
 * Example: "2024-06-15" → "Jun 15, 2024"
 */
export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
};

/**
 * Returns today's date as a YYYY-MM-DD string in local time.
 */
export const today = (): string => format(new Date(), 'yyyy-MM-dd');

/**
 * Converts a Date object to a YYYY-MM-DD string in local time.
 */
export const toDateString = (date: Date): string => format(date, 'yyyy-MM-dd');
