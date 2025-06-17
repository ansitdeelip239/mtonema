import Colors from '../constants/Colors';

export const getLighterColor = (color: string): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
  return 'rgba(66, 133, 244, 0.1)';
};

/**
 * Darkens a hex color by the specified amount
 * @param color Hex color code (with or without #)
 * @param amount Value between 0 and 1 representing how much to darken
 * @returns Darkened hex color
 */
export const darkenColor = (color: string, amount: number): string => {
  try {
    // Remove # if present
    color = color.replace('#', '');

    // Parse the hex values
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Darken each component
    r = Math.floor(r * (1 - amount));
    g = Math.floor(g * (1 - amount));
    b = Math.floor(b * (1 - amount));

    // Ensure values are in valid range
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g
      .toString(16)
      .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } catch (e) {
    console.error('Error darkening color:', e);
    return '#1e5799'; // Fallback color
  }
};

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

/**
 * Generates gradient colors based on partner info or falls back to default colors
 * @param primaryColor Optional primary color from partner info
 * @returns Array of gradient colors for header, buttons, etc.
 */
export const getGradientColors = (primaryColor?: string): string[] => {
  if (primaryColor) {
    // If primary color exists, create a gradient based on it
    return [primaryColor, darkenColor(primaryColor, 0.2)];
  }

  // Default colors if no partner-specific colors are available
  return [Colors.MT_PRIMARY_1, Colors.MT_PRIMARY_1];
};
