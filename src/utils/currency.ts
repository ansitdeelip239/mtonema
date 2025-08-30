const formatLocalizedNumber = (number: number, numberLocale: string) => {
  try {
    const localeMap: Record<string, string> = {
      'en': 'en-IN',
      'en-IN': 'en-IN',
      'es': 'es-ES',
      'es-ES': 'es-ES',
      'pt': 'pt-BR',
      'pt-BR': 'pt-BR',
      'ar': 'ar-SA-u-nu-arab',
      'ar-SA': 'ar-SA-u-nu-arab',
      'hi': 'hi-IN-u-nu-deva',
      'hi-IN': 'hi-IN-u-nu-deva',
      'en-US': 'en-US',
    };
    const finalLocale = localeMap[numberLocale] || 'en-IN';
    return new Intl.NumberFormat(finalLocale).format(number);
  } catch (error) {
    return number.toString();
  }
};

const formatCurrency = (value: string | number | null | undefined, locale: string = 'en-IN') => {
  if (value === null || value === undefined) {
    return '';
  }

  try {
    // Convert value to string if it isn't already
    const valueStr = typeof value === 'string' ? value : value.toString();
    const num = parseFloat(valueStr.replace(/,/g, ''));
    if (isNaN(num)) {
      return valueStr;
    }


    // Get currency symbol based on locale
    const getCurrencySymbol = (currencyLocale: string) => {
      const currencySymbols: Record<string, string> = {
        'en': '₹',
        'en-IN': '₹',
        'es': '€',
        'es-ES': '€',
        'pt': 'R$',
        'pt-BR': 'R$',
        'ar': 'ر.س',
        'ar-SA': 'ر.س',
        'hi': '₹',
        'hi-IN': '₹',
        'en-US': '$',
      };
      return currencySymbols[currencyLocale] || '₹';
    };

    const currencySymbol = getCurrencySymbol(locale);

    if (num >= 10000000) {
      const amountInCrores = num / 10000000;
      return `${currencySymbol}${formatLocalizedNumber(amountInCrores, locale)} Cr`;
    } else if (num >= 100000) {
      const amountInLacs = num / 100000;
      return `${currencySymbol}${formatLocalizedNumber(amountInLacs, locale)} Lacs`;
    } else if (num >= 1000) {
      const amountInThousands = num / 1000;
      return `${currencySymbol}${formatLocalizedNumber(amountInThousands, locale)} K`;
    } else {
      return `${currencySymbol}${formatLocalizedNumber(num, locale)}`;
    }
  } catch (error) {
    console.error('Currency formatting error:', error);
    return value?.toString() || '';
  }
};


const convertPaiseToRupees = (price: number, locale: string = 'en-IN') => {
  const rupees = price / 100;

  const currencySymbol = locale === 'es' || locale === 'es-ES' ? '€' :
    locale === 'pt' || locale === 'pt-BR' ? 'R$' :
    locale === 'ar' || locale === 'ar-SA' ? 'ر.س' :
    locale === 'en-US' ? '$' : '₹';

  // Use the same locale mapping as formatLocalizedNumber for consistent digit systems
  const localeMap: Record<string, string> = {
    'en': 'en-IN',
    'en-IN': 'en-IN',
    'es': 'es-ES',
    'es-ES': 'es-ES',
    'pt': 'pt-BR',
    'pt-BR': 'pt-BR',
    'ar': 'ar-SA-u-nu-arab',
    'ar-SA': 'ar-SA-u-nu-arab',
    'hi': 'hi-IN-u-nu-deva',
    'hi-IN': 'hi-IN-u-nu-deva',
    'en-US': 'en-US',
  };
  const finalLocale = localeMap[locale] || 'en-IN';

  return `${currencySymbol}${new Intl.NumberFormat(finalLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees)}`;
};

export {formatCurrency, convertPaiseToRupees, formatLocalizedNumber};
