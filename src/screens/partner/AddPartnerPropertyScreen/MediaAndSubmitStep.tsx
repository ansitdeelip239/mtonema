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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {MaterialTextInput} from '../../../components/MaterialTextInput';
import {PartnerPropertyFormType} from '../../../schema/PartnerPropertyFormSchema';
import Colors from '../../../constants/Colors';
import Toast from 'react-native-toast-message';
import GetIcon from '../../../components/GetIcon';

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
  type: 'Default' | 'Others';
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
  // State for selected images
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [defaultImageIndex, setDefaultImageIndex] = useState<number | null>(
    null,
  );

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

        const uploadPromises = selectedImages.map(async image => {
          const imageData = {
            localUri: image.path,
            imageUrl: '',
            type: 'Others' as const,
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
              type: 'Others',
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
  }, [defaultImageIndex]);

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
        type: 'Others',
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
          newImages[0] = {...newImages[0], toggle: true, type: 'Others'};
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
                <Image
                  source={{uri: image.localUri || image.imageUrl}}
                  style={styles.imagePreview}
                />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={[
                      styles.defaultButton,
                      defaultImageIndex === index && styles.defaultButtonActive,
                    ]}
                    onPress={() => handleSetDefaultImage(index)}>
                    <Text
                      style={[
                        styles.defaultButtonText,
                        defaultImageIndex === index &&
                          styles.defaultButtonTextActive,
                      ]}>
                      {defaultImageIndex === index ? 'Default' : 'Set Default'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}>
                    <GetIcon iconName="clear" />
                  </TouchableOpacity>
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
          keyboardType="url"
          defaultValue={formInput.videoURL || 'https://youtu.be/YZWhTCO-0-g'}
        />
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
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  defaultButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  defaultButtonActive: {
    backgroundColor: Colors.main,
  },
  defaultButtonText: {
    fontSize: 12,
    color: '#666',
  },
  defaultButtonTextActive: {
    color: 'white',
  },
  removeButton: {
    padding: 2,
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
});

export default MediaAndSubmitStep;
