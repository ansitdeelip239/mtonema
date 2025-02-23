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
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} Lacs`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)} K`;
    } else {
      return `₹${num.toFixed(1)}`;
    }
  } catch (error) {
    console.error('Currency formatting error:', error);
    return value?.toString() || '';
  }
};

export {formatCurrency};
