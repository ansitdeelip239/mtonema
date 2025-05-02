import React, {useState, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {ImageData} from '../../../../../types/image';
import GetIcon from '../../../../../components/GetIcon';
import { useTheme } from '../../../../../context/ThemeProvider';

interface ImageUploaderProps {
  onImagesSelected: (images: ImageData[]) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelected,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const {theme} = useTheme();

  const handleSelectImages = useCallback(async () => {
    if (disabled) {
      return;
    }

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
            type: 'Others', // Default type
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

        if (validImages.length > 0) {
          onImagesSelected(validImages);

          Toast.show({
            type: 'success',
            text1: 'Images uploaded successfully',
          });
        }
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
  }, [disabled, onImagesSelected]);

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

  return (
    <TouchableOpacity
      style={[styles.uploadButton, {borderColor: theme.primaryColor}]}
      onPress={handleSelectImages}
      disabled={uploading || disabled}>
      {uploading ? (
        <ActivityIndicator color={theme.primaryColor} size="small" />
      ) : (
        <>
          <GetIcon iconName="calendarSomeday" size={20} />
          <Text style={[styles.uploadButtonText, {color: theme.primaryColor}]}>Select Images</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ImageUploader;
