import React, {useState, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {launchImageLibrary, ImagePickerResponse, ImageLibraryOptions} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {ImageData} from '../../../../../types/image';
import GetIcon from '../../../../../components/GetIcon';
import { useTheme } from '../../../../../context/ThemeProvider';
import url from '../../../../../constants/api';

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
  const { t } = useTranslation();

  const handleSelectImages = useCallback(async () => {
    if (disabled) {
      return;
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      selectionLimit: 0, // 0 means no limit, allows multiple selection
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        // User cancelled, do nothing
        return;
      }

      if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Failed to select images',
          text2: response.errorMessage,
        });
        return;
      }

      if (response.assets && response.assets.length > 0) {
        setUploading(true);

        // Process and upload each image
        const uploadPromises = response.assets.map(async asset => {
          if (!asset.uri) {
            return null;
          }

          const imageData = {
            localUri: asset.uri,
            imageUrl: '',
            type: 'Others', // Default type
            toggle: false,
          };

          // Upload to Cloudinary
          try {
            const uploadedUrl = await uploadToCloudinary(asset.uri);
            imageData.imageUrl = uploadedUrl;
            return imageData;
          } catch (error) {
            console.error('Failed to upload image:', error);
            return null; // Return null for failed uploads
          }
        });

        Promise.all(uploadPromises)
          .then(uploadedImages => {
            // Filter out null values (failed uploads) and add to state
            const validImages = uploadedImages.filter(Boolean) as ImageData[];

            if (validImages.length > 0) {
              onImagesSelected(validImages);

              Toast.show({
                type: 'success',
                text1: 'Images uploaded successfully',
              });
            }
          })
          .catch(error => {
            console.error('Error uploading images:', error);
            Toast.show({
              type: 'error',
              text1: 'Failed to upload images',
              text2: 'Please try again',
            });
          })
          .finally(() => {
            setUploading(false);
          });
      }
    });
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
        url.upload.image,
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
          <Text style={[styles.uploadButtonText, {color: theme.primaryColor}]}>
            {t('partnerPropertyForm.mediaAndSubmit.buttons.selectImages', 'Select Images')}
          </Text>
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
