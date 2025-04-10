const formatCurrency = (value: string | number | null | undefined) => {
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

    // Helper function to format with optional decimals
    const formatWithDecimals = (amount: number) => {
      // If the number is a whole number, don't show decimal places
      return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
    };

    if (num >= 10000000) {
      const amountInCrores = num / 10000000;
      return `₹ ${formatWithDecimals(amountInCrores)} Cr`;
    } else if (num >= 100000) {
      const amountInLacs = num / 100000;
      return `₹ ${formatWithDecimals(amountInLacs)} Lacs`;
    } else if (num >= 1000) {
      const amountInThousands = num / 1000;
      return `₹ ${formatWithDecimals(amountInThousands)} K`;
    } else {
      return `₹ ${formatWithDecimals(num)}`;
    }
  } catch (error) {
    console.error('Currency formatting error:', error);
    return value?.toString() || '';
  }
};

export {formatCurrency};
