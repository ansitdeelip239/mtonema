const formatCurrency = (value: string | null | undefined) => {
  if (!value) {
    return '';
  }

  try {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) {
      return value;
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
    return value || '';
  }
};

export {formatCurrency};
