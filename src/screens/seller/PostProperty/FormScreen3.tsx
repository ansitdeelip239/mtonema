import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, Text, Button, TouchableOpacity, Image, Alert} from 'react-native';
import {PostPropertyFormParamList} from './PostPropertyForm';
import {SegmentedButtons} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

type Props = NativeStackScreenProps<PostPropertyFormParamList, 'FormScreen3'>;

const FormScreen3: React.FC<Props> = ({navigation, route}) => {
  const [value, setValue] = useState('Images');
  const [formData, setFormData] = useState(route.params.formData);
  const [images, setImages] = useState<string[]>(formData.images || []);

  const handleImagePick = () => {
    Alert.alert('Add Images', 'Choose an option', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Camera', onPress: openCamera},
      {text: 'Gallery', onPress: openGallery},
    ]);
  };

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

  const handlePrev = () => {
    navigation.goBack();
  };

  return (
    <View>
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

<TouchableOpacity
  onPress={handleImagePick}
  // eslint-disable-next-line react-native/no-inline-styles
  style={{
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'Red', // iOS blue button color
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Shadow for Android
  }}>
  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' ,borderColor:'red',backgroundColor:'black'}}>
    Select Images
  </Text>
</TouchableOpacity>

      {images.map((image, index) => (
        <Image
          key={index}
          source={{uri: image}}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{width: 100, height: 100, margin: 5}}
        />
      ))}

      <Button title="Previous" onPress={handlePrev} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default FormScreen3;
