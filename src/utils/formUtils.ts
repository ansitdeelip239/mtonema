import {MasterDetailModel} from '../types';

export const convertToMasterDetailModel = (
  options: string[],
): MasterDetailModel[] => {
  return options.map((option, index) => ({
    id: index + 1,
    masterDetailName: option,
  }));
};

// Extract YouTube video ID from various URL formats
export const getYoutubeVideoId = (url: string): string | null => {
  if (!url) {
    return null;
  }

  // Regular expressions for different YouTube URL formats
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // For cases when video ID is directly provided
  ];

  for (const regex of regexPatterns) {
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Function to get YouTube thumbnail URL
export const getYouTubeThumbnailUrl = (videoUrl: string): string => {
  const videoId = getYoutubeVideoId(videoUrl);
  if (videoId) {
    // Use high quality thumbnail if available
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  // Return a placeholder if we can't extract the ID
  return 'https://via.placeholder.com/480x360.png?text=Video+Preview+Not+Available';
};
