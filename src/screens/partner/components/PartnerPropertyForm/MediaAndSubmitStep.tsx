import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import ImagePreviewList from './components/ImagePreviewList';
import TagsInput from './components/TagsInput';
import FormNavigationButtons from './components/FormNavigationButtons';
import { PartnerPropertyFormType } from '../../../../schema/PartnerPropertyFormSchema';
import { useMaster } from '../../../../context/MasterProvider';
import { ImageData } from '../../../../types/image';
import ImageUploader from './components/ImageUploader';
import { MaterialTextInput } from '../../../../components/MaterialTextInput';

interface MediaAndSubmitStepProps {
  formInput: PartnerPropertyFormType;
  handleInputChange: (field: keyof PartnerPropertyFormType, value: any) => void;
  onSubmit: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

const MediaAndSubmitStep: React.FC<MediaAndSubmitStepProps> = ({
  formInput,
  handleInputChange,
  onSubmit,
  onBack,
  showBackButton = false,
  isSubmitting = false,
  submitButtonText = 'Submit',
}) => {
  // Get image types from master data
  const {masterData} = useMaster();
  const imageTypes = useMemo(
    () => masterData?.ImageType || [],
    [masterData?.ImageType],
  );

  // State for selected images
  const [images, setImages] = useState<ImageData[]>([]);
  const [defaultImageIndex, setDefaultImageIndex] = useState<number | null>(
    null,
  );

  // Parse existing images if present in formInput
  useEffect(() => {
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
    } else {
      setImages([]);
      setDefaultImageIndex(null);
    }
  }, [formInput.imageURL]);

  // Initialize component state for tags
  useEffect(() => {
    if (formInput.tags) {
      try {
        JSON.parse(formInput.tags);
      } catch (e) {
        console.error('Failed to parse tags', e);
      }
    }
  }, [formInput.tags]);

  // Update formInput whenever images state changes
  useEffect(() => {
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

  // Handle newly selected images
  const handleImagesSelected = useCallback(
    (newImages: ImageData[]) => {
      setImages(prevImages => {
        // Map new images to ensure they have a default type property
        const processedNewImages = newImages.map(img => ({
          ...img,
          type: img.type || 'Others', // Explicitly set default if not provided
        }));

        const updatedImages = [...prevImages, ...processedNewImages];

        // Rest of your logic...
        if (defaultImageIndex === null && updatedImages.length > 0) {
          setDefaultImageIndex(prevImages.length);
          return updatedImages.map((img, idx) => ({
            ...img,
            toggle: idx === prevImages.length,
          }));
        }

        return updatedImages;
      });
    },
    [defaultImageIndex],
  );

  // Handle setting default image
  const handleSetDefaultImage = (index: number) => {
    setDefaultImageIndex(index);
    setImages(prevImages =>
      prevImages.map((img, idx) => ({
        ...img,
        toggle: idx === index,
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

  // Handle category change
  const handleCategoryChange = (index: number, type: string) => {
    console.log(`Category changed for image ${index}: ${type}`);

    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = {
        ...newImages[index],
        type: type,
      };
      return newImages;
    });
  };

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (images.length === 0) {
      Alert.alert('Warning', 'Please upload at least one image');
      return;
    }

    // Submit the form
    onSubmit();
  }, [images, onSubmit]);

  // Add this effect to debug image state changes
  useEffect(() => {
    if (images.length > 0) {
      console.log(
        'Current images state:',
        images.map(img => ({
          url: img.imageUrl.substring(0, 20) + '...',
          type: img.type,
        })),
      );
    }
  }, [images]);

  // Determine if form is valid for submission
  const isSubmitEnabled = useMemo(() => {
    return images.length > 0 && defaultImageIndex !== null && !isSubmitting;
  }, [images, defaultImageIndex, isSubmitting]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Property Images</Text>
      <Text style={styles.sectionDescription}>
        Upload images of your property. Select one image as the default display
        image.
      </Text>

      {/* Image upload button */}
      <ImageUploader
        onImagesSelected={handleImagesSelected}
        disabled={isSubmitting}
      />

      {/* Image preview section */}
      <ImagePreviewList
        images={images}
        imageTypes={imageTypes}
        defaultImageIndex={defaultImageIndex}
        onSetDefaultImage={handleSetDefaultImage}
        onRemoveImage={handleRemoveImage}
        onCategoryChange={handleCategoryChange}
      />

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
        />
      </View>

      {/* Tags input */}
      <TagsInput
        tags={formInput.tags}
        onTagsChange={tags => handleInputChange('tags', tags)}
      />

      {/* Submit section */}
      <View style={styles.submitSection}>
        <Text style={styles.submitDescription}>
          Review all details carefully before submitting your property listing.
        </Text>
      </View>

      {/* Navigation buttons */}
      <FormNavigationButtons
        onNext={handleSubmit}
        onBack={onBack}
        showBackButton={showBackButton}
        isNextEnabled={isSubmitEnabled}
        isSubmitting={isSubmitting}
        nextButtonText={submitButtonText}
      />
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
});

export default MediaAndSubmitStep;
