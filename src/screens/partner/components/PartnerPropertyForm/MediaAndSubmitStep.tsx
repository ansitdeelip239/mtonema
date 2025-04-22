import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ImagePreviewList from './components/ImagePreviewList';
import TagsInput from './components/TagsInput';
import FormNavigationButtons from './components/FormNavigationButtons';
import {PartnerPropertyFormType} from '../../../../schema/PartnerPropertyFormSchema';
import {useMaster} from '../../../../context/MasterProvider';
import {ImageData} from '../../../../types/image';
import ImageUploader from './components/ImageUploader';
import {MaterialTextInput} from '../../../../components/MaterialTextInput';

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

  // State to track if we're currently syncing from formInput
  const [isLoadingFromFormInput, setIsLoadingFromFormInput] = useState(false);

  // Parse existing images if present in formInput - only on initial load
  useEffect(() => {
    if (formInput.imageURL && !isLoadingFromFormInput) {
      try {
        setIsLoadingFromFormInput(true);
        const parsedImages = JSON.parse(formInput.imageURL);
        if (Array.isArray(parsedImages)) {
          // Process images, ensuring all required properties exist
          const processedImages = parsedImages.map(img => ({
            imageUrl: img.imageUrl || '',
            type: img.type || 'Others',
            toggle: !!img.toggle,
          }));

          setImages(processedImages);

          // Find default image if exists
          const defaultIndex = processedImages.findIndex(img => img.toggle);
          setDefaultImageIndex(defaultIndex !== -1 ? defaultIndex : null);
        }
      } catch (e) {
        console.error('Failed to parse images', e);
      } finally {
        setIsLoadingFromFormInput(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on component mount

  // Initialize component state for tags
  useEffect(() => {
    if (formInput.tags) {
      try {
        JSON.parse(formInput.tags);
      } catch (e) {
        console.error('Failed to parse tags', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update formInput whenever images state changes - but not during loading
  useEffect(() => {
    if (images.length > 0 && !isLoadingFromFormInput) {
      const imageURLString = JSON.stringify(
        images.map(img => ({
          imageUrl: img.imageUrl,
          type: img.type || 'Others',
          toggle: img.toggle || false,
        })),
      );
      handleInputChange('imageURL', imageURLString);
    } else if (images.length === 0 && !isLoadingFromFormInput) {
      handleInputChange('imageURL', null);
    }
  }, [images, handleInputChange, isLoadingFromFormInput]);

  // Handle newly selected images
  const handleImagesSelected = useCallback(
    (newImages: ImageData[]) => {
      setImages(prevImages => {
        // Map new images to ensure they have a default type property
        const processedNewImages = newImages.map(img => ({
          ...img,
          type: img.type || 'Others',
          toggle: false, // New images are not default by default
        }));

        const updatedImages = [...prevImages, ...processedNewImages];

        // If no default image is set yet, set the first image as default
        if (defaultImageIndex === null && updatedImages.length > 0) {
          const newDefaultIndex = 0;
          setDefaultImageIndex(newDefaultIndex);

          return updatedImages.map((img, idx) => ({
            ...img,
            toggle: idx === newDefaultIndex,
          }));
        }

        return updatedImages;
      });
    },
    [defaultImageIndex],
  );

  // Handle setting default image - completely revised to avoid loops
  const handleSetDefaultImage = useCallback(
    (index: number) => {
      if (index !== defaultImageIndex) {
        setDefaultImageIndex(index);
        setImages(prevImages =>
          prevImages.map((img, idx) => ({
            ...img,
            toggle: idx === index,
          })),
        );
      }
    },
    [defaultImageIndex],
  );

  // Remove image - fixed to properly handle image deletion
  const handleRemoveImage = useCallback(
    (index: number) => {
      setImages(prevImages => {
        // Create a new array without the removed image
        const newImages = prevImages.filter((_, idx) => idx !== index);

        // If we removed the default image
        if (index === defaultImageIndex) {
          if (newImages.length > 0) {
            // Make the first image the default
            setTimeout(() => {
              setDefaultImageIndex(0);
            }, 0);

            return newImages.map((img, idx) => ({
              ...img,
              toggle: idx === 0, // Set first image as default
            }));
          } else {
            // No images left
            setTimeout(() => {
              setDefaultImageIndex(null);
            }, 0);
          }
        } else if (defaultImageIndex !== null && index < defaultImageIndex) {
          // If we removed an image before the default, adjust the index
          setTimeout(() => {
            setDefaultImageIndex(defaultImageIndex - 1);
          }, 0);
        }

        return newImages;
      });
    },
    [defaultImageIndex],
  );

  // Handle category change
  const handleCategoryChange = useCallback((index: number, type: string) => {
    setImages(prevImages => {
      if (index < 0 || index >= prevImages.length) {
        return prevImages; // Invalid index, return unchanged
      }

      const newImages = [...prevImages];
      newImages[index] = {
        ...newImages[index],
        type: type,
      };
      return newImages;
    });
  }, []);

  // This step is optional, so the form is valid for submission as long as we're not submitting already
  const isSubmitEnabled = !isSubmitting;

  return (
    <View style={styles.container}>
      <Text style={styles.optionalStepText}>
        This step is optional. You can proceed without filling these details.
      </Text>

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
        onNext={onSubmit}
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
  optionalStepText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
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
