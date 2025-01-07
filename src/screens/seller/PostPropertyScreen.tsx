import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import { PermissionsAndroid, Platform } from 'react-native';
const PostProperty = () => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<Asset[]>([]);
  const [sellerType, setSellerType] = useState('');
  const [city, setCity] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    description: '',
    video: '',
  });
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          return true;
        } else {
          console.log('Camera permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // Permissions are not required on iOS
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    // Validate formData fields
    Object.keys(formData).forEach(key => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = true;
      }
    });
    // Validate picker fields
    if (!sellerType) {newErrors.sellerType = true;}
    if (!city) {newErrors.city = true;}
    if (!propertyFor) {newErrors.propertyFor = true;}
    if (!propertyType) {newErrors.propertyType = true;}
    if (images.length === 0) {newErrors.images = true;}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleImagePicker = async (type?: 'camera' | 'gallery') => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 5, // Allow multiple images selection
    };

    const handleResponse = (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets) {
        // Append new images to existing ones
        setImages(prevImages => [...prevImages, ...response.assets].slice(0, 5));
      }
    };

    if (type === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        launchCamera(options, handleResponse);
      } else {
        Alert.alert('Permission Denied', 'Camera permission is required to use the camera.');
      }
    } else if (type === 'gallery') {
      launchImageLibrary(options, handleResponse);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Choose Image Source',
      'Would you like to take a photo or choose from your gallery?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: () => handleImagePicker('camera'),
        },
        {
          text: 'Gallery',
          onPress: () => handleImagePicker('gallery'),
        },
      ],
    );
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    console.log({
      images,
      ...formData,
      sellerType,
      city,
      propertyFor,
      propertyType,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post Your Property</Text>

      <View style={styles.imageSection}>
        <Button
          mode="contained"
          onPress={showImagePickerOptions}
          style={[styles.addImageButton, errors.images && styles.errorButton]}>
         + Add Images
        </Button>
        {errors.images && <Text style={styles.errorText}>Image are required</Text>}

        <ScrollView horizontal style={styles.imageScrollView}>
          {images.map((image, index) => (
            <View key={image.uri} style={styles.imageWrapper}>
              <Image source={{uri: image.uri}} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}>
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Video URL"
        value={formData.video}
        onChangeText={value => handleInputChange('video', value)}
      />
      <TextInput
      style={[styles.input, errors.name && styles.inputError]}
        placeholder="Name"
        value={formData.name}
        onChangeText={value => handleInputChange('name', value)}
      />
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={value => handleInputChange('email', value)}
      />
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Mobile no."
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={value => handleInputChange('mobile', value)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sellerType}
          onValueChange={setSellerType}
          style={styles.picker}>
          <Picker.Item label="Seller Type" value="" />
          <Picker.Item label="Individual" value="individual" />
          <Picker.Item label="Dealer" value="dealer" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={city}
          onValueChange={setCity}
          style={styles.picker}>
          <Picker.Item label="City" value="" />
          <Picker.Item label="New York" value="newyork" />
          <Picker.Item label="Los Angeles" value="losangeles" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={propertyFor}
          onValueChange={setPropertyFor}
          style={styles.picker}>
          <Picker.Item label="Property For" value="" />
          <Picker.Item label="Sale" value="sale" />
          <Picker.Item label="Rent" value="rent" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={propertyType}
          onValueChange={setPropertyType}
          style={styles.picker}>
          <Picker.Item label="Property Type" value="" />
          <Picker.Item label="Apartment" value="apartment" />
          <Picker.Item label="House" value="house" />
        </Picker>
      </View>

      <TextInput
         style={[styles.input, errors.email && styles.inputError]}
        placeholder="Property Description"
        multiline
        numberOfLines={5}
        value={formData.description}
        onChangeText={value => handleInputChange('description', value)}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() =>
            Alert.alert('Cancel', 'Are you sure you want to cancel?')
          }>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Property</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  pickerContainerError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  errorButton: {
    borderColor: 'red',
    borderWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc0e74',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageScrollView: {
    flexGrow: 0,
    marginTop: 10,
  },
  imageWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    marginBottom: 10,
    backgroundColor: '#cc0e74',
    padding: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#cc0e74',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostProperty;
