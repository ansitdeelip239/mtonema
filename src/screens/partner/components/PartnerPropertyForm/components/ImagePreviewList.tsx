import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import GetIcon from '../../../../../components/GetIcon';
import Colors from '../../../../../constants/Colors';
import {ImageData} from '../../../../../types/image';
import {MasterDetailModel} from '../../../../../types';

interface ImagePreviewListProps {
  images: ImageData[];
  imageTypes: MasterDetailModel[];
  defaultImageIndex: number | null;
  onSetDefaultImage: (index: number) => void;
  onRemoveImage: (index: number) => void;
  onCategoryChange: (index: number, type: string) => void;
}

const ImagePreviewList: React.FC<ImagePreviewListProps> = ({
  images,
  imageTypes,
  defaultImageIndex,
  onSetDefaultImage,
  onRemoveImage,
  onCategoryChange,
}) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <View style={styles.imageSection}>
      <Text style={styles.imageListTitle}>
        Selected Images ({images.length})
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageList}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{uri: image.localUri || image.imageUrl}}
                style={styles.imagePreview}
              />

              {/* Image counter indicator (top-center) */}
              <View style={styles.counterOverlay}>
                <Text style={styles.counterText}>
                  {index + 1}/{images.length}
                </Text>
              </View>

              {/* Default checkmark overlay (top-left) */}
              {defaultImageIndex === index && (
                <View style={styles.defaultOverlay}>
                  <GetIcon iconName="greenCheck" size={18} color="white" />
                </View>
              )}

              {/* Remove button overlay (top-right) */}
              <TouchableOpacity
                style={styles.removeOverlay}
                onPress={() => onRemoveImage(index)}>
                <GetIcon iconName="clear" size={18} color="white" />
              </TouchableOpacity>

              {/* Image tap to set default */}
              <TouchableOpacity
                style={styles.defaultSelector}
                onPress={() => onSetDefaultImage(index)}
              />
            </View>

            {/* Category picker */}
            <View style={styles.categoryPickerContainer}>
              <Picker
                selectedValue={image.type || ''}
                style={styles.categoryPicker}
                onValueChange={value => onCategoryChange(index, value)}
                dropdownIconColor={Colors.MT_PRIMARY_1}>
                {/* Add placeholder as first item */}
                <Picker.Item
                  label="Select Category"
                  value=""
                  style={styles.placeholderPickerItem}
                  enabled={false}
                />
                {imageTypes.map(type => (
                  <Picker.Item
                    key={type.id}
                    label={type.masterDetailName}
                    value={type.masterDetailName}
                    style={styles.pickerItem}
                  />
                ))}
              </Picker>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageSection: {
    marginBottom: 20,
  },
  imageListTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  imageList: {
    paddingBottom: 10,
  },
  imageContainer: {
    marginRight: 12,
    width: 150,
  },
  imageWrapper: {
    position: 'relative',
    width: 150,
    height: 150,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  counterOverlay: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  defaultOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'green',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  removeOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultSelector: {
    position: 'absolute',
    top: 32, // Leave space for the controls at the top
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  categoryPickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  categoryPicker: {
    width: 150,
    color: 'black',
  },
  pickerItem: {
    fontSize: 12,
  },
  placeholderPickerItem: {
    fontSize: 12,
    color: '#888',
  },
});

export default ImagePreviewList;
