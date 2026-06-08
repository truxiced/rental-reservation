import { format } from "date-fns";

/**
 * Returns today's date as a YYYY-MM-DD string in server local time.
 */
export const today = (): string => format(new Date(), "yyyy-MM-dd");
