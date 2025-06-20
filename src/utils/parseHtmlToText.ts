import {parse} from 'node-html-parser';

export const parseHtmlToText = (html: string): string => {
  if (!html) {
    return '';
  }

  try {
    const root = parse(html);

    // Recursive function to extract text with formatting
    const extractText = (node: any): string => {
      if (node.nodeType === 3) {
        // Text node
        return node.text;
      }

      let result = '';

      // Handle different HTML elements
      switch (node.tagName?.toLowerCase()) {
        case 'br':
          return '\n';
        case 'p':
          result = node.childNodes.map(extractText).join('') + '\n\n';
          break;
        case 'div':
          result = node.childNodes.map(extractText).join('') + '\n';
          break;
        case 'li':
          result = '• ' + node.childNodes.map(extractText).join('') + '\n';
          break;
        case 'ul':
        case 'ol':
          result = '\n' + node.childNodes.map(extractText).join('') + '\n';
          break;
        case 'strong':
        case 'b':
        case 'em':
        case 'i':
          // Keep the text content but remove formatting
          result = node.childNodes.map(extractText).join('');
          break;
        default:
          result = node.childNodes.map(extractText).join('');
      }

      return result;
    };

    let text = root.childNodes.map(extractText).join('');

    // Clean up the text
    text = text
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple line breaks with double
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    return text;
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return html; // Return original string if parsing fails
  }
};
