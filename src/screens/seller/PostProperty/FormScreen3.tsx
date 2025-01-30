import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {PostPropertyFormParamList} from './PostPropertyForm';
import {ActivityIndicator, SegmentedButtons} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {ImageType} from '../../../types/propertyform';
import SellerService from '../../../services/SellerService';
import {navigationRef} from '../../../navigator/NavigationRef';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../../hooks/useAuth';
import Colors from '../../../constants/Colors';
import { initialFormData } from '../../../types/propertyform';
type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen3'>;

const FormScreen3: React.FC<Props> = ({navigation, route}) => {
  const [value, setValue] = useState('Images');
  const [formData, setFormData] = useState(route.params.formData);
  const [images, setImages] = useState<ImageType[]>(formData.ImageURL || []);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const {dataUpdated, setDataUpdated} = useAuth();

  const uploadToCloudinary = async (imagePath: string): Promise<string> => {
    setLoadingImage(true);
    const tempformData = new FormData();
    tempformData.append('file', {
      uri: imagePath,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    tempformData.append('upload_preset', 'dncrproperty');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dncrproperty-com/image/upload',
        {
          method: 'POST',
          body: tempformData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
    finally {
      setLoadingImage(false); // Stop the image loader after upload
    }
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo',
      });

      const cloudinaryUrl = await uploadToCloudinary(image.path);

      const newImage: ImageType = {
        ID: Date.now().toString(),
        imageNumber: images.length + 1,
        ImageUrl: cloudinaryUrl,
        isselected: false,
        toggle: false,
        Type: 1,
      };

      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        ImageURL: updatedImages,
      }));
    } catch (error) {
      console.log('Camera Error:', error);
    }
  };

  const openGallery = async () => {
    try {
      const selectedImages = await ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
      });

      const uploadPromises = selectedImages.map(img =>
        uploadToCloudinary(img.path),
      );
      const cloudinaryUrls = await Promise.all(uploadPromises);

      const newImages: ImageType[] = cloudinaryUrls.map((url, index) => ({
        ID: Date.now().toString() + index,
        imageNumber: images.length + index + 1,
        ImageUrl: url,
        isselected: false,
        toggle: false,
        Type: 1,
      }));

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      setFormData(prev => ({
        ...prev,
        ImageURL: updatedImages,
      }));
    } catch (error) {
      console.log('Gallery Error:', error);
    }
  };

  const removeImage = (imageId: string) => {
    const filteredImages = images.filter(img => img.ID !== imageId);
    setImages(filteredImages);
    setFormData(prev => ({
      ...prev,
      ImageURL: filteredImages,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await SellerService.addProperty(formData);
      console.log('Response:', response);

      if (response.Success) {
        Toast.show({
          type: 'success',
          text1: 'Property listed successfully',
        });
        setFormData(initialFormData);
        setImages([]);
        navigationRef.current?.navigate('Home');
        setDataUpdated(!dataUpdated);
      }
    } catch (err) {
      console.log('Error in addProperty', err);
      Toast.show({
        type: 'error',
        text1: 'Error in listing property',
      });
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/Images/bgimg1.png')}
      style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'Basic Info',
              label: 'Basic Info',
              onPress: () => navigation.navigate('FormScreen1'),
            },
            {
              value: 'Property info',
              label: 'Property Info',
              onPress: () => navigation.navigate('FormScreen2', {formData}),
            },
            {
              value: 'Images',
              label: 'Image Upload',
              onPress: () => navigation.navigate('FormScreen3', {formData}),
            },
          ]}
          theme={{colors: {primary: 'green'}}}
        />

        <Text style={styles.headerText}>
          Upload your photo and video to showcase your listing in just a few
          simple steps!
        </Text>

        <View style={styles.uploadOptionsContainer}>
          <TouchableOpacity onPress={openGallery} style={styles.uploadOption}>
            <Image
              source={require('../../../assets/Images/imgupload2.png')}
              style={styles.uploadIcon}
            />
            <Text style={styles.uploadText}>Upload from gallery</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity onPress={openCamera} style={styles.uploadOption}>
            <Image
              source={require('../../../assets/Images/imgupload1.png')}
              style={styles.uploadIcon}
            />
            <View style={styles.livePhotoButton}>
              <Text style={styles.livePhotoText}>Click live photos</Text>
            </View>
          </TouchableOpacity>
        </View>
        {loadingImage && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.main} />
            <Text style={styles.loaderText}>Uploading image...</Text>
          </View>
        )}


        {images.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Selected Images:</Text>
            <View style={styles.imageGrid}>
              {images.map((image, _index) => (
                <View key={image.ID} style={styles.imageContainer}>
                  <Image
                    source={{uri: image.ImageUrl}}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeIcon}
                    onPress={() => removeImage(image.ID)}>
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

<TouchableOpacity
          style={styles.listPropertyButton}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <Text style={styles.listPropertyText}>List Your Property</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  uploadOptionsContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  uploadOption: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  orText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  livePhotoButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  livePhotoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    margin: 5,
  },
  previewImage: {
    width: Dimensions.get('window').width / 4 - 20,
    height: Dimensions.get('window').width / 4 - 20,
    margin: 5,
    borderRadius: 5,
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  removeText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listPropertyButton: {
    backgroundColor: Colors.main,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    marginBottom: 100,
  },
  listPropertyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    color: '#333',
  },

});

export default FormScreen3;
