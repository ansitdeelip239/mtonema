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

// Add these helper functions for date and time formatting
export const formatFollowUpDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', {month: 'short'});
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};
