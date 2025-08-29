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
    translationKey: 'greetings.goodNight', // ✅ Add translation key
  },
  morning: {
    greeting: 'Good Morning',
    icon: 'morning',
    translationKey: 'greetings.goodMorning', // ✅ Add translation key
  },
  afternoon: {
    greeting: 'Good Afternoon',
    icon: 'afternoon',
    translationKey: 'greetings.goodAfternoon', // ✅ Add translation key
  },
  evening: {
    greeting: 'Good Evening',
    icon: 'evening',
    translationKey: 'greetings.goodEvening', // ✅ Add translation key
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

// Localized date formatting using Intl.DateTimeFormat
export const formatLocalizedDate = (
  date: string | Date,
  locale: string = 'en-US',
): string => {
  try {
    let dateObj: Date;
    if (typeof date === 'string') {
      const dateStr = date.endsWith('Z') ? date : `${date}Z`;
      dateObj = parseISO(dateStr);
    } else {
      dateObj = new Date(date);
    }

    // Convert UTC date to local time
    const localDate = new Date(dateObj.getTime());

    // Get the properly formatted locale with numbering system
    const finalLocale = getLocalizedLocale(locale);

    // Use Intl.DateTimeFormat for date formatting
    // Use short month for English, long month for other languages
    const isEnglish = locale.startsWith('en');
    const dateFormatter = new Intl.DateTimeFormat(finalLocale, {
      year: 'numeric',
      month: isEnglish ? 'short' : 'long',
      day: 'numeric',
    });

    return dateFormatter.format(localDate);
  } catch (error) {
    console.warn('Error formatting localized date:', error);
    return 'Invalid date';
  }
};

// Localized time formatting using Intl.DateTimeFormat with custom AM/PM
export const formatLocalizedTime = (
  date: string | Date,
  locale: string = 'en-US',
  t?: (key: string) => string,
): string => {
  try {
    let dateObj: Date;
    if (typeof date === 'string') {
      const dateStr = date.endsWith('Z') ? date : `${date}Z`;
      dateObj = parseISO(dateStr);
    } else {
      dateObj = new Date(date);
    }

    // Convert UTC date to local time
    const localDate = new Date(dateObj.getTime());

    // Get the properly formatted locale with numbering system
    const finalLocale = getLocalizedLocale(locale);

    // Use Intl.DateTimeFormat with the extended locale
    const timeFormatter = new Intl.DateTimeFormat(finalLocale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    let formattedTime = timeFormatter.format(localDate);

    // If translation function is provided, replace AM/PM with custom translations
    if (t) {
      // Replace English AM/PM (both uppercase and lowercase)
      formattedTime = formattedTime.replace(/\bAM\b/gi, t('time.am'));
      formattedTime = formattedTime.replace(/\bPM\b/gi, t('time.pm'));

      // Replace Spanish AM/PM (a. m. / p. m.)
      formattedTime = formattedTime.replace(/\ba\.\s?m\./gi, t('time.am'));
      formattedTime = formattedTime.replace(/\bp\.\s?m\./gi, t('time.pm'));

      // Replace Portuguese AM/PM (similar to Spanish)
      formattedTime = formattedTime.replace(/\bda\s+manhã\b/gi, t('time.am'));
      formattedTime = formattedTime.replace(/\bda\s+tarde\b/gi, t('time.pm'));
      formattedTime = formattedTime.replace(/\bda\s+noite\b/gi, t('time.pm'));

      // Replace Hindi AM/PM characters
      formattedTime = formattedTime.replace(/\bअपराह्न\b/g, t('time.pm'));
      formattedTime = formattedTime.replace(/\bपूर्वाह्न\b/g, t('time.am'));

      // Replace Arabic AM/PM (ص/م)
      formattedTime = formattedTime.replace(/\bص\b/g, t('time.am'));
      formattedTime = formattedTime.replace(/\bم\b/g, t('time.pm'));
    }    return formattedTime;
  } catch (error) {
    console.warn('Error formatting localized time:', error);
    return 'Invalid time';
  }
};

const getLocalizedLocale = (locale: string): string => {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    'en-US': 'en-US',
    es: 'es-ES',
    'es-ES': 'es-ES',
    pt: 'pt-BR',
    'pt-BR': 'pt-BR',
    hi: 'hi-IN-u-nu-deva', // Hindi with Devanagari digits
    'hi-IN': 'hi-IN-u-nu-deva', // Hindi with Devanagari digits
    ar: 'ar-SA-u-nu-arab', // Arabic with Arabic-Indic digits
    'ar-SA': 'ar-SA-u-nu-arab', // Arabic with Arabic-Indic digits
  };

  return localeMap[locale] || locale;
};
