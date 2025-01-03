import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const PostProperty = () => {
  const [sellerType, setSellerType] = useState('');
  const [city, setCity] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [propertyType, setPropertyType] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Post Your Property</Text>

      <TouchableOpacity style={styles.addImageButton}>
        <Text style={styles.addImageText}>+ Add image</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Video" />
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Mobile no." keyboardType="phone-pad" />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sellerType}
          onValueChange={value => setSellerType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seller Type" value="" />
          <Picker.Item label="Individual" value="individual" />
          <Picker.Item label="Dealer" value="dealer" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={city}
          onValueChange={value => setCity(value)}
          style={styles.picker}
        >
          <Picker.Item label="City" value="" />
          <Picker.Item label="New York" value="newyork" />
          <Picker.Item label="Los Angeles" value="losangeles" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={propertyFor}
          onValueChange={value => setPropertyFor(value)}
          style={styles.picker}
        >
          <Picker.Item label="Property For" value="" />
          <Picker.Item label="Sale" value="sale" />
          <Picker.Item label="Rent" value="rent" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={propertyType}
          onValueChange={value => setPropertyType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Property Type" value="" />
          <Picker.Item label="Apartment" value="apartment" />
          <Picker.Item label="House" value="house" />
        </Picker>
      </View>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Long Property Description"
        multiline
        numberOfLines={5}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.addButton]}>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 20,
  },
  addImageButton: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  addImageText: {
    color: '#800080',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    overflow: 'hidden',
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
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#800080',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostProperty;
