import {format} from 'date-fns';

export const formatDate = (
  date: string | Date,
  formatString: string,
): string => {
  return format(new Date(date), formatString);
};
