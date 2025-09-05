/**
 * Lightens a hex color by the specified amount
 * @param color Hex color code (with or without #)
 * @param amount Value between 0 and 1 representing how much to lighten
 * @returns Lightened hex color
 */
export const lightenColor = (color: string, amount: number): string => {
  try {
    // Remove # if present
    color = color.replace('#', '');

    // Parse the hex values
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Lighten each component
    r = Math.floor(r + (255 - r) * amount);
    g = Math.floor(g + (255 - g) * amount);
    b = Math.floor(b + (255 - b) * amount);

    // Ensure values are in valid range
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (e) {
    console.error('Error lightening color:', e);
    return '#a8c7f0'; // Fallback color
  }
};


export const getPastelColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 85%)`;
};

