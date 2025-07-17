import {format, parseISO} from 'date-fns';

export const formatDate = (
  date: string | Date,
  formatString: string,
): string => {
  try {
    let dateObj: Date;

    if (typeof date === 'string') {
      // Check if the date string ends with 'Z' (UTC indicator)
      // If not, append 'Z' to ensure it's treated as UTC
      const dateStr = date.endsWith('Z') ? date : `${date}Z`;
      dateObj = parseISO(dateStr);
    } else {
      dateObj = new Date(date);
    }

    // Convert UTC date to local time
    // This creates a new Date object representing the same moment in local time
    const localDate = new Date(dateObj.getTime());

    return format(localDate, formatString);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return 'Invalid date';
  }
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

// Get time of day greeting
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 17) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
};
