import {format, parseISO} from 'date-fns';

export const formatDate = (
  date: string | Date,
  formatString: string,
): string => {
  if (typeof date === 'string') {
    // Parse ISO string using parseISO which handles various ISO 8601 formats better
    return format(parseISO(date), formatString);
  }
  return format(date, formatString);
};
