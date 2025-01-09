import React, { useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';

const PostProperty = () => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
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
  const [images, setImages] = useState<string[]>([]); // To store selected images

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleAddImages = () => {
    Alert.alert(
      'Add Images',
      'Choose an option',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
      ],
    );
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        setImages(prev => [...prev, image.path]); // Add the image path to the images array
      })
      .catch(error => {
        console.log('Camera Error:', error);
        Alert.alert('Error', 'Failed to capture image');
      });
  };

  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true, // Allow multiple image selection
      mediaType: 'photo',
    })
      .then(selectedImages => {
        const imagePaths = selectedImages.map(image => image.path); // Extract paths from selected images
        setImages(prev => [...prev, ...imagePaths]); // Add the image paths to the images array
      })
      .catch(error => {
        console.log('Gallery Error:', error);
        Alert.alert('Error', 'Failed to select images');
      });
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    console.log({
      ...formData,
      sellerType,
      city,
      propertyFor,
      propertyType,
      images, // Include the selected images in the form data
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post Your Property</Text>

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
        style={[styles.input, errors.mobile && styles.inputError]}
        placeholder="Mobile no."
        keyboardType="phone-pad"
        value={formData.mobile}
        onChangeText={value => handleInputChange('mobile', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Video URL"
        value={formData.video}
        onChangeText={value => handleInputChange('video', value)}
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
        style={[styles.input, errors.description && styles.inputError]}
        placeholder="Property Description"
        multiline
        numberOfLines={5}
        value={formData.description}
        onChangeText={value => handleInputChange('description', value)}
      />

      {/* Add Images Button */}
      <TouchableOpacity
        style={[styles.button, styles.addImagesButton]}
        onPress={handleAddImages}>
        <Text style={styles.buttonText}>Add Images</Text>
      </TouchableOpacity>

      {/* Display Selected Images */}
      {images.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc0e74',
    marginBottom: 20,
    textAlign: 'center',
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
  addImagesButton: {
    backgroundColor: '#3498db',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
  },
});

export default PostProperty;
