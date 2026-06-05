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
 * Returns today's date as a YYYY-MM-DD string.
 */
export const today = (): string => {
  return new Date().toISOString().slice(0, 10);
};

/**
 * Converts a Date object to a YYYY-MM-DD string.
 */
export const toDateString = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};
