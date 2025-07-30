// utils/phoneUtils.ts

import {CountryCode, getCountryCallingCode} from 'libphonenumber-js/mobile';
import * as ct from 'countries-and-timezones';

/**
 * Formats a WhatsApp number: removes spaces, ensures country code, removes leading '+'.
 * @param number The input phone number string
 * @returns Formatted WhatsApp number string
 */
export function formatWhatsappNumber(number: string): string {
  let formatted = number.replace(/\s+/g, '');
  if (formatted.startsWith('+')) {
    formatted = formatted.substring(1);
  }
  if (formatted.length === 10) {
    formatted = '91' + formatted;
  }
  return formatted;
}

export function getDefaultCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // The return type of getCountryForTimezone is Country | undefined
    const countryObj: ct.Country | undefined = ct.getCountryForTimezone(tz);
    const country: CountryCode = countryObj
      ? (countryObj.id as CountryCode)
      : 'IN';
    return '+' + getCountryCallingCode(country);
  } catch {
    return '+91';
  }
}

export function addCountryCode(num?: string) {
  if (!num) {
    return undefined;
  }
  let n = num.trim();
  if (n.startsWith('+')) {
    return n;
  }
  if (n.length === 10) {
    return getDefaultCountryCode() + ' ' + n;
  }
  return n;
}
