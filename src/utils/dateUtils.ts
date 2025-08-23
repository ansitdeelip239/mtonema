import {format, parseISO} from 'date-fns';
import {IconEnum} from '../components/GetIcon';

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

// Time-based configurations
const timeConfig: {
  nightOwl: {greeting: string; icon: IconEnum; translationKey: string};
  morning: {greeting: string; icon: IconEnum; translationKey: string};
  afternoon: {greeting: string; icon: IconEnum; translationKey: string};
  evening: {greeting: string; icon: IconEnum; translationKey: string};
} = {
  nightOwl: {
    greeting: 'Hey Night Owl',
    icon: 'night',
    translationKey: 'screens.followUpScreen.salutationGreeting.heyNightOwl', // ✅ Add translation key
  },
  morning: {
    greeting: 'Good Morning',
    icon: 'morning',
    translationKey: 'screens.followUpScreen.salutationGreeting.goodMorning', // ✅ Add translation key
  },
  afternoon: {
    greeting: 'Good Afternoon',
    icon: 'afternoon',
    translationKey: 'screens.followUpScreen.salutationGreeting.goodAfternoon', // ✅ Add translation key
  },
  evening: {
    greeting: 'Good Evening',
    icon: 'evening',
    translationKey: 'screens.followUpScreen.salutationGreeting.goodEvening', // ✅ Add translation key
  },
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour < 5) {
    return timeConfig.nightOwl;
  }
  if (hour < 12) {
    return timeConfig.morning;
  }
  if (hour < 17) {
    return timeConfig.afternoon;
  }
  if (hour < 21) {
    return timeConfig.evening;
  }
  return timeConfig.nightOwl;
};

// Get time of day greeting
export const getGreeting = () => {
  return getTimeOfDay().greeting;
};

// Get time-based icon name
export const getTimeIcon = (): IconEnum => {
  return getTimeOfDay().icon;
};

export const getGreetingTranslationKey = (): string => {
  return getTimeOfDay().translationKey;
};

// Extract user's first name from full name
export const getFirstName = (fullName: string): string => {
  if (!fullName) {
    return '';
  }

  const parts = fullName.split(' ');
  if (parts.length > 1 && parts[0].endsWith('.')) {
    return parts[1];
  }
  return parts[0];
};
