import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {PartnerPropertyFormType} from '../../../schema/PartnerPropertyFormSchema';
import Colors from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import GetIcon from '../../../components/GetIcon';
import {Picker} from '@react-native-picker/picker';
import {useMaster} from '../../../context/MasterProvider';

interface MediaAndSubmitStepProps {
  formInput: PartnerPropertyFormType;
  handleInputChange: (field: keyof PartnerPropertyFormType, value: any) => void;
  onSubmit: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isSubmitting?: boolean;
}

interface ImageData {
  imageUrl: string;
  type: string;
  toggle: boolean;
  localUri?: string;
}

const MediaAndSubmitStep: React.FC<MediaAndSubmitStepProps> = ({
  formInput,
  handleInputChange,
  onSubmit,
  onBack,
  showBackButton = false,
  isSubmitting = false,
}) => {
  // Get image types from master data
  const {masterData} = useMaster();
  const imageTypes = useMemo(
    () => masterData?.ImageType || [],
    [masterData?.ImageType],
  );

  // State for selected images
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [defaultImageIndex, setDefaultImageIndex] = useState<number | null>(
    null,
  );

  // Add this state to manage tags input
  const [tagInput, setTagInput] = useState<string>('');

  // Parse existing images if present in formInput
  React.useEffect(() => {
    if (formInput.imageURL) {
      try {
        const parsedImages = JSON.parse(formInput.imageURL);
        if (Array.isArray(parsedImages)) {
          setImages(parsedImages);
          // Find default image if exists
          const defaultIndex = parsedImages.findIndex(img => img.toggle);
          if (defaultIndex !== -1) {
            setDefaultImageIndex(defaultIndex);
          }
        }
      } catch (e) {
        console.error('Failed to parse images', e);
      }
    }
  }, [formInput.imageURL]);

  // Add this effect to parse existing tags if present in formInput
  React.useEffect(() => {
    if (formInput.tags) {
      try {
        // No need to display the tags in the input field as we'll show them separately
        // This is just to initialize the component state
        JSON.parse(formInput.tags);
      } catch (e) {
        console.error('Failed to parse tags', e);
      }
    }
  }, [formInput.tags]);

  // Add this effect to update formInput whenever images state changes
  React.useEffect(() => {
    // Only update when we have images and not during initial render
    if (images.length > 0) {
      const imageURLString = JSON.stringify(
        images.map(img => ({
          imageUrl: img.imageUrl,
          type: img.type,
          toggle: img.toggle,
        })),
      );

      handleInputChange('imageURL', imageURLString);
    }
  }, [images, handleInputChange]);

  // Handle image selection
  const handleSelectImages = useCallback(async () => {
    try {
      const selectedImages = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
        compressImageMaxWidth: 1280,
      });

      // Only proceed if images were selected (user didn't cancel)
      if (selectedImages && selectedImages.length > 0) {
        // Process and upload each image
        setUploading(true);

        // Define defaultType outside the map function
        const defaultType =
          imageTypes.length > 0 ? imageTypes[0].masterDetailName : 'Other';

        const uploadPromises = selectedImages.map(async image => {
          const imageData = {
            localUri: image.path,
            imageUrl: '',
            type: defaultType,
            toggle: false,
          };

          // Upload to Cloudinary
          try {
            const uploadedUrl = await uploadToCloudinary(image.path);
            imageData.imageUrl = uploadedUrl;
            return imageData;
          } catch (error) {
            console.error('Failed to upload image:', error);
            return null; // Return null for failed uploads
          }
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Filter out null values (failed uploads) and add to state
        const validImages = uploadedImages.filter(Boolean) as ImageData[];

        setImages(prevImages => {
          const newImages = [...prevImages, ...validImages];

          // If no default image is selected yet and we have at least one image
          if (defaultImageIndex === null && newImages.length > 0) {
            setDefaultImageIndex(prevImages.length); // Make the first new image default
            return newImages.map((img, idx) => ({
              ...img,
              toggle: idx === prevImages.length, // Only first new image is default
              type: defaultType,
            }));
          }

          return newImages;
        });

        Toast.show({
          type: 'success',
          text1: 'Images uploaded successfully',
        });
      }
    } catch (error) {
      // Check if the error is due to user cancellation
      if (
        error instanceof Error &&
        'code' in error &&
        error.code !== 'E_PICKER_CANCELLED'
      ) {
        // This is an actual error, not just a cancellation
        console.error('Error selecting images:', error);
        Toast.show({
          type: 'error',
          text1: 'Failed to select images',
          text2: 'Please try again',
        });
      }
      // For cancellations, we do nothing - just silently return
    } finally {
      setUploading(false);
    }
  }, [defaultImageIndex, imageTypes]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (imagePath: string): Promise<string> => {
    const data = new FormData();
    data.append('file', {
      uri: imagePath,
      type: 'image/jpeg', // Adjust based on image type if needed
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'dncrproperty'); // Replace with your upload preset

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dncrproperty-com/image/upload',
        {
          method: 'POST',
          body: data,
        },
      );

      const responseData = await response.json();

      if (response.ok) {
        return responseData.secure_url;
      } else {
        throw new Error(responseData.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // Handle setting default image
  const handleSetDefaultImage = (index: number) => {
    setDefaultImageIndex(index);
    setImages(prevImages =>
      prevImages.map((img, idx) => ({
        ...img,
        toggle: idx === index,
        type: img.type,
      })),
    );
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);

      // If we removed the default image, adjust defaultImageIndex
      if (index === defaultImageIndex) {
        if (newImages.length > 0) {
          // Make the first image the default
          setDefaultImageIndex(0);
          newImages[0] = {
            ...newImages[0],
            toggle: true,
            type: newImages[0].type,
          };
        } else {
          setDefaultImageIndex(null);
        }
      } else if (defaultImageIndex !== null && index < defaultImageIndex) {
        // If we removed an image before the default, adjust the index
        setDefaultImageIndex(defaultImageIndex - 1);
      }

      return newImages;
    });
  };

  // Add a handleCategoryChange function
  const handleCategoryChange = (index: number, type: string) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = {
        ...newImages[index],
        type: type,
      };
      return newImages;
    });
  };

  // Add this function to handle adding a new tag
  const handleAddTag = () => {
    if (!tagInput.trim()) {
      return;
    }

    try {
      const currentTags = formInput.tags ? JSON.parse(formInput.tags) : [];
      const newTag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;

      // Only add if it doesn't already exist
      if (!currentTags.includes(newTag)) {
        const updatedTags = [...currentTags, newTag];
        handleInputChange('tags', JSON.stringify(updatedTags));
      }

      // Clear the input field
      setTagInput('');
    } catch (e) {
      console.error('Failed to update tags', e);
    }
  };

  // Add this function to handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    try {
      const currentTags = formInput.tags ? JSON.parse(formInput.tags) : [];
      const updatedTags = currentTags.filter(
        (tag: string) => tag !== tagToRemove,
      );
      handleInputChange('tags', JSON.stringify(updatedTags));
    } catch (e) {
      console.error('Failed to remove tag', e);
    }
  };

  // Update form data on submit
  const handleSubmit = useCallback(() => {
    if (images.length === 0) {
      Alert.alert('Warning', 'Please upload at least one image');
      return;
    }

    // Submit the form
    onSubmit();
  }, [images, onSubmit]);

  // Determine if form is valid for submission
  const isSubmitEnabled = useMemo(() => {
    return (
      images.length > 0 &&
      defaultImageIndex !== null &&
      !uploading &&
      !isSubmitting
    );
  }, [images, defaultImageIndex, uploading, isSubmitting]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Property Images</Text>
      <Text style={styles.sectionDescription}>
        Upload images of your property. Select one image as the default display
        image.
      </Text>

      {/* Image upload button */}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleSelectImages}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color={Colors.main} size="small" />
        ) : (
          <>
            <GetIcon iconName="calendarSomeday" size={20} />
            <Text style={styles.uploadButtonText}>Select Images</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Image preview section */}
      {images.length > 0 && (
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
                      <GetIcon iconName="checkmark" size={18} color="white" />
                    </View>
                  )}

                  {/* Remove button overlay (top-right) */}
                  <TouchableOpacity
                    style={styles.removeOverlay}
                    onPress={() => handleRemoveImage(index)}>
                    <GetIcon iconName="clear" size={18} color="white" />
                  </TouchableOpacity>

                  {/* Image tap to set default */}
                  <TouchableOpacity
                    style={styles.defaultSelector}
                    onPress={() => handleSetDefaultImage(index)}
                  />
                </View>

                {/* Category picker */}
                <View style={styles.categoryPickerContainer}>
                  <Picker
                    selectedValue={image.type || ''}
                    style={styles.categoryPicker}
                    onValueChange={value => handleCategoryChange(index, value)}
                    dropdownIconColor={Colors.main}
                    placeholder="Select Category">
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
      )}

      {/* Video URL input */}
      <View style={styles.videoSection}>
        <Text style={styles.fieldTitle}>Property Video</Text>
        <MaterialTextInput
          field="videoURL"
          formInput={formInput}
          setFormInput={handleInputChange}
          label="Video URL"
          mode="outlined"
          placeholder="Enter YouTube or Vimeo URL"
          // defaultValue={formInput.videoURL || 'https://youtu.be/YZWhTCO-0-g'}
        />
      </View>

      {/* Tags input */}
      <View style={styles.tagsSection}>
        <Text style={styles.fieldTitle}>Property Tags</Text>
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
              !tagInput.trim() && styles.disabledAddButton,
            ]}
            onPress={handleAddTag}
            disabled={!tagInput.trim()}>
            <Text style={styles.addTagButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Display added tags */}
        {formInput.tags && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}>
            {JSON.parse(formInput.tags).map((tag: string, index: number) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  style={styles.removeTagButton}
                  onPress={() => handleRemoveTag(tag)}>
                  <GetIcon iconName="clear" size={14} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Submit section */}
      <View style={styles.submitSection}>
        <Text style={styles.submitDescription}>
          Review all details carefully before submitting your property listing.
        </Text>
      </View>

      {/* Navigation buttons */}
      <View style={styles.buttonsContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={onBack}
            disabled={isSubmitting}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            isSubmitEnabled ? styles.submitButton : styles.disabledButton,
            showBackButton ? {} : styles.fullWidthButton,
          ]}
          onPress={handleSubmit}
          disabled={!isSubmitEnabled || isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text
              style={
                isSubmitEnabled
                  ? styles.submitButtonText
                  : styles.disabledButtonText
              }>
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.main,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: Colors.main,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
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
    backgroundColor: Colors.main,
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
    top: 4, // Changed from 8 to 4
    right: 4, // Changed from 8 to 4
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultSelector: {
    position: 'absolute',
    top: 0,
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
  videoSection: {
    marginBottom: 20,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  submitSection: {
    marginBottom: 20,
  },
  submitDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: Colors.main,
    marginLeft: 'auto',
  },
  fullWidthButton: {
    flex: 1,
  },
  backButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    marginLeft: 'auto',
  },
  disabledButtonText: {
    color: '#888888',
    fontWeight: '600',
    fontSize: 16,
  },
  tagsSection: {
    marginBottom: 20,
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
    backgroundColor: Colors.main,
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
    backgroundColor: Colors.main,
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
    // backgroundColor: 'rgba(0,0,0,0.6)',
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

export default MediaAndSubmitStep;
