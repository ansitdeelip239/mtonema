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
import {SegmentedButtons} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen3'>;

const FormScreen3: React.FC<Props> = ({navigation, route}) => {
  const [value, setValue] = useState('Images');
  const [formData, setFormData] = useState(route.params.formData);
  const [images, setImages] = useState<string[]>(formData.images || []);

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        const newImages = [...images, image.path];
        setImages(newImages);
        setFormData({...formData, images: newImages});
      })
      .catch(error => console.log('Camera Error:', error));
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then(selectedImages => {
        const imagePaths = selectedImages.map(image => image.path);
        const newImages = [...images, ...imagePaths];
        setImages(newImages);
        setFormData({...formData, images: newImages});
      })
      .catch(error => console.log('Gallery Error:', error));
  };

  const handleSubmit = () => {
    console.log('Complete Form Data:', formData);
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

        {images.length > 0 && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Selected Images:</Text>
            <View style={styles.imageGrid}>
              {images.map((image, index) => (
                <Image
                  key={index}
                  source={{uri: image}}
                  style={styles.previewImage}
                />
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.listPropertyButton}
          onPress={handleSubmit}>
          <Text style={styles.listPropertyText}>List Your Property</Text>
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
  previewImage: {
    width: Dimensions.get('window').width / 4 - 20,
    height: Dimensions.get('window').width / 4 - 20,
    margin: 5,
    borderRadius: 5,
  },
  listPropertyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
  },
  listPropertyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormScreen3;
