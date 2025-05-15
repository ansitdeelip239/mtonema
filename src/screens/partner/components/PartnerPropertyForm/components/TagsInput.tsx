import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from '../../../../../constants/Colors';
import GetIcon from '../../../../../components/GetIcon';
import { useTheme } from '../../../../../context/ThemeProvider';

interface TagsInputProps {
  tags: string | null;
  onTagsChange: (tags: string) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({tags, onTagsChange}) => {
  const [tagInput, setTagInput] = useState<string>('');
  const {theme} = useTheme();

  const handleAddTag = () => {
    if (!tagInput.trim()) {
      return;
    }

    try {
      const currentTags = tags ? JSON.parse(tags) : [];
      const newTag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;

      // Only add if it doesn't already exist
      if (!currentTags.includes(newTag)) {
        const updatedTags = [...currentTags, newTag];
        onTagsChange(JSON.stringify(updatedTags));
      }

      // Clear the input field
      setTagInput('');
    } catch (e) {
      console.error('Failed to update tags', e);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    try {
      const currentTags = tags ? JSON.parse(tags) : [];
      const updatedTags = currentTags.filter(
        (tag: string) => tag !== tagToRemove,
      );
      onTagsChange(JSON.stringify(updatedTags));
    } catch (e) {
      console.error('Failed to remove tag', e);
    }
  };

  return (
    <View style={styles.tagsSection}>
      <Text style={styles.fieldTitle}>Tags</Text>
      <View style={styles.tagInputContainer}>
        <View style={styles.tagInputWrapper}>
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Eg., #luxury"
            style={styles.tagTextInput}
            autoCapitalize="none"
            returnKeyType="done"
            placeholderTextColor={Colors.placeholderColor}
            onSubmitEditing={handleAddTag}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.addTagButton,
            {backgroundColor: theme.primaryColor},
            !tagInput.trim() && styles.disabledAddButton,
          ]}
          onPress={handleAddTag}
          disabled={!tagInput.trim()}>
          <Text style={styles.addTagButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Display added tags in a wrapped layout */}
      {tags && (
        <View style={styles.tagsContainer}>
          {JSON.parse(tags).map((tag: string, index: number) => (
            <View key={index} style={[styles.tagItem, {backgroundColor: theme.primaryColor}]}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                style={styles.removeTagButton}
                onPress={() => handleRemoveTag(tag)}>
                <GetIcon iconName="clear" size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsSection: {
    marginBottom: 20,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledAddButton: {
    backgroundColor: '#cccccc',
  },
  addTagButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    marginRight: 4,
  },
  removeTagButton: {
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagTextInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default TagsInput;
