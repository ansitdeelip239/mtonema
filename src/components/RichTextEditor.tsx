import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
// import GetIcon, {IconEnum} from './GetIcon';
import Colors from '../constants/Colors';

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string, html: string) => void;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

interface TextFormat {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: 'left' | 'center' | 'right';
}

interface TextSegment {
  text: string;
  format: TextFormat;
  start: number;
  end: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChangeText,
  placeholder = 'Type your message...',
  minHeight = 200,
  maxHeight = 400,
}) => {
  const textInputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({start: 0, end: 0});
  const [currentFormat, setCurrentFormat] = useState<TextFormat>({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
  });

  // Store formatted text segments
  const [textSegments, setTextSegments] = useState<TextSegment[]>([]);

  // Generate HTML from current segments and text
  const generateHTML = useCallback(() => {
    if (!value) return '';

    let html = '';
    let position = 0;

    // Sort segments by start position
    const sortedSegments = [...textSegments]
      .filter(
        segment => segment.start < value.length && segment.end <= value.length,
      )
      .sort((a, b) => a.start - b.start);

    for (const segment of sortedSegments) {
      // Add unformatted text before this segment
      if (segment.start > position) {
        html += value.slice(position, segment.start);
      }

      // Add formatted segment
      let segmentHTML = segment.text;

      if (segment.format.bold) {
        segmentHTML = `<strong>${segmentHTML}</strong>`;
      }
      if (segment.format.italic) {
        segmentHTML = `<em>${segmentHTML}</em>`;
      }
      if (segment.format.underline) {
        segmentHTML = `<u>${segmentHTML}</u>`;
      }

      html += segmentHTML;
      position = segment.end;
    }

    // Add any remaining unformatted text
    if (position < value.length) {
      html += value.slice(position);
    }

    return `<p style="text-align: ${currentFormat.align};">${html}</p>`;
  }, [value, textSegments, currentFormat.align]);

  const generateAndEmitHTML = useCallback(() => {
    const html = generateHTML();
    console.log('HTML Output:', html);
    onChangeText(value, html);
  }, [generateHTML, value, onChangeText]);

  // Apply formatting to selected text or toggle for future typing
  const toggleFormat = useCallback(
    (formatType: keyof Omit<TextFormat, 'align'>) => {
      const {start, end} = selection;

      if (start === end) {
        // No selection - toggle format for future typing only
        setCurrentFormat(prev => ({
          ...prev,
          [formatType]: !prev[formatType],
        }));
      } else {
        // Text is selected - apply formatting to selection
        const selectedText = value.slice(start, end);

        // Check if this selection already has formatting
        const existingSegment = textSegments.find(
          segment => segment.start === start && segment.end === end,
        );

        const newFormat = existingSegment
          ? {
              ...existingSegment.format,
              [formatType]: !existingSegment.format[formatType],
            }
          : {
              ...currentFormat,
              [formatType]: !currentFormat[formatType],
            };

        // Create or update segment for this selection
        setTextSegments(prev => {
          // Remove any existing segments that overlap with this selection
          const nonOverlapping = prev.filter(
            segment => segment.end <= start || segment.start >= end,
          );

          // Add the new segment
          const newSegment: TextSegment = {
            text: selectedText,
            format: newFormat,
            start,
            end,
          };

          return [...nonOverlapping, newSegment].sort(
            (a, b) => a.start - b.start,
          );
        });

        // Generate and emit HTML
        generateAndEmitHTML();
      }
    },
    [selection, value, currentFormat, textSegments, generateAndEmitHTML],
  );

  // Handle text changes
  const handleTextChange = useCallback(
    (text: string) => {
      const lengthDiff = text.length - value.length;
      const {start} = selection;

      if (lengthDiff > 0) {
        // Text was added
        const addedText = text.slice(start - lengthDiff, start);

        // If current format has styling, create a segment for the added text
        if (
          currentFormat.bold ||
          currentFormat.italic ||
          currentFormat.underline
        ) {
          const newSegment: TextSegment = {
            text: addedText,
            format: currentFormat,
            start: start - lengthDiff,
            end: start,
          };

          setTextSegments(prev => {
            // Adjust existing segments that come after insertion point
            const adjustedSegments = prev.map(segment => {
              if (segment.start >= start - lengthDiff) {
                return {
                  ...segment,
                  start: segment.start + lengthDiff,
                  end: segment.end + lengthDiff,
                };
              } else if (segment.end > start - lengthDiff) {
                return {
                  ...segment,
                  end: segment.end + lengthDiff,
                };
              }
              return segment;
            });

            return [...adjustedSegments, newSegment].sort(
              (a, b) => a.start - b.start,
            );
          });
        } else {
          // Just adjust existing segment positions
          setTextSegments(prev =>
            prev.map(segment => {
              if (segment.start >= start - lengthDiff) {
                return {
                  ...segment,
                  start: segment.start + lengthDiff,
                  end: segment.end + lengthDiff,
                };
              } else if (segment.end > start - lengthDiff) {
                return {
                  ...segment,
                  end: segment.end + lengthDiff,
                };
              }
              return segment;
            }),
          );
        }
      } else if (lengthDiff < 0) {
        // Text was deleted - adjust or remove segments
        setTextSegments(prev =>
          prev
            .map(segment => {
              if (segment.start >= start) {
                return {
                  ...segment,
                  start: Math.max(start, segment.start + lengthDiff),
                  end: Math.max(start, segment.end + lengthDiff),
                };
              } else if (segment.end > start) {
                return {
                  ...segment,
                  end: Math.max(segment.start, segment.end + lengthDiff),
                };
              }
              return segment;
            })
            .filter(
              segment =>
                segment.start < segment.end && segment.start < text.length,
            ),
        );
      }

      // Generate HTML and emit
      setTimeout(() => {
        const html = generateHTML();
        console.log('HTML Output:', html);
        onChangeText(text, html);
      }, 0);
    },
    [value, selection, currentFormat, generateHTML, onChangeText],
  );

  // Handle selection changes
  const handleSelectionChange = useCallback((event: any) => {
    const newSelection = event.nativeEvent.selection;
    setSelection(newSelection);
  }, []);

  // Check if format is active
  const isFormatActive = useCallback(
    (formatType: keyof Omit<TextFormat, 'align'>) => {
      const {start, end} = selection;

      if (start === end) {
        return currentFormat[formatType];
      }

      // Check if selection has this format
      const overlappingSegments = textSegments.filter(
        segment => segment.start < end && segment.end > start,
      );

      return overlappingSegments.some(segment => segment.format[formatType]);
    },
    [selection, currentFormat, textSegments],
  );

  // Set alignment
  const setAlignment = useCallback(
    (align: 'left' | 'center' | 'right') => {
      setCurrentFormat(prev => ({
        ...prev,
        align,
      }));
      generateAndEmitHTML();
    },
    [generateAndEmitHTML],
  );

  // Insert text
  const insertText = useCallback(
    (text: string) => {
      const {start} = selection;
      const newText = value.slice(0, start) + text + value.slice(start);
      handleTextChange(newText);

      // Move cursor
      setTimeout(() => {
        const newPos = start + text.length;
        textInputRef.current?.setNativeProps({
          selection: {start: newPos, end: newPos},
        });
      }, 50);
    },
    [selection, value, handleTextChange],
  );

  // Get display style
  const getDisplayStyle = useCallback(
    () => ({
      fontWeight: currentFormat.bold ? ('bold' as const) : ('normal' as const),
      fontStyle: currentFormat.italic
        ? ('italic' as const)
        : ('normal' as const),
      textDecorationLine: currentFormat.underline
        ? ('underline' as const)
        : ('none' as const),
      textAlign: currentFormat.align,
    }),
    [currentFormat],
  );

  // Format buttons
  const formatButtons = [
    {
      id: 'bold',
      label: 'B',
      isActive: isFormatActive('bold'),
      action: () => toggleFormat('bold'),
    },
    {
      id: 'italic',
      label: 'I',
      isActive: isFormatActive('italic'),
      action: () => toggleFormat('italic'),
    },
    {
      id: 'underline',
      label: 'U',
      isActive: isFormatActive('underline'),
      action: () => toggleFormat('underline'),
    },
  ];

  const alignmentButtons = [
    {
      id: 'left',
      label: '←',
      isActive: currentFormat.align === 'left',
      action: () => setAlignment('left'),
    },
    {
      id: 'center',
      label: '↔',
      isActive: currentFormat.align === 'center',
      action: () => setAlignment('center'),
    },
    {
      id: 'right',
      label: '→',
      isActive: currentFormat.align === 'right',
      action: () => setAlignment('right'),
    },
  ];

  const variables = [
    {id: 'name', variable: '{name}'},
    {id: 'phone', variable: '{phone}'},
    {id: 'email', variable: '{email}'},
    {id: 'sender_name', variable: '{sender_name}'},
    {id: 'company', variable: '{company}'},
  ];

  const quickInsertButtons = [
    {id: 'greeting', text: 'Hello {name},\n\n', label: 'Greeting'},
    {
      id: 'signature',
      text: '\n\nBest regards,\n{sender_name}',
      label: 'Signature',
    },
  ];

  const renderButton = (button: any) => (
    <TouchableOpacity
      key={button.id}
      style={[
        styles.formatButton,
        button.isActive && styles.activeFormatButton,
      ]}
      onPress={() => {
        button.action();
        setTimeout(() => textInputRef.current?.focus(), 100);
      }}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.buttonLabel,
          {color: button.isActive ? 'white' : '#666'},
        ]}>
        {button.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Text Editor */}
      <View style={styles.editorContainer}>
        <TextInput
          ref={textInputRef}
          style={[styles.textInput, getDisplayStyle(), {minHeight, maxHeight}]}
          value={value}
          onChangeText={handleTextChange}
          onSelectionChange={handleSelectionChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          scrollEnabled
          selectTextOnFocus={false}
          blurOnSubmit={false}
        />
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          {selection.start !== selection.end
            ? `Selected: ${selection.end - selection.start} chars`
            : `Position: ${selection.start}`}
          {currentFormat.bold && ' • Bold'}
          {currentFormat.italic && ' • Italic'}
          {currentFormat.underline && ' • Underline'}
          {' • ' +
            currentFormat.align.charAt(0).toUpperCase() +
            currentFormat.align.slice(1)}
        </Text>
      </View>

      {/* Format Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.toolbarSection}>
          <Text style={styles.toolbarLabel}>Format:</Text>
          <View style={styles.buttonGroup}>
            {formatButtons.map(renderButton)}
          </View>

          <View style={styles.separator} />

          <Text style={styles.toolbarLabel}>Align:</Text>
          <View style={styles.buttonGroup}>
            {alignmentButtons.map(renderButton)}
          </View>
        </View>
      </View>

      {/* Variables */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variables</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}>
          {variables.map(variable => (
            <TouchableOpacity
              key={variable.id}
              style={styles.variableChip}
              onPress={() => insertText(variable.variable)}
              activeOpacity={0.7}>
              <Text style={styles.variableText}>{variable.variable}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Insert */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Insert</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContent}>
          {quickInsertButtons.map(button => (
            <TouchableOpacity
              key={button.id}
              style={styles.quickButton}
              onPress={() => insertText(button.text)}
              activeOpacity={0.7}>
              <Text style={styles.quickButtonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  editorContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  statusBar: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statusText: {
    fontSize: 11,
    color: Colors.MT_PRIMARY_1,
    fontWeight: '500',
  },
  toolbar: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toolbarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginRight: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 16,
  },
  formatButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFormatButton: {
    backgroundColor: Colors.MT_PRIMARY_1,
    borderColor: Colors.MT_PRIMARY_1,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#d0d0d0',
    marginHorizontal: 8,
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  horizontalContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quickButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  variableChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  variableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default RichTextEditor;
