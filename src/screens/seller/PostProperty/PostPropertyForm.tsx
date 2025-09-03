import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import Colors from '../../../constants/Colors';
import Header from '../../../components/Header';

const PostPropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: '',
  });

  const handleSubmit = () => {
    Alert.alert('Form Submitted', JSON.stringify(formData, null, 2));
  };

  return (
    <View style={styles.container}>
      <Header title="Post Property" />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Post Your Property</Text>

          <Text style={styles.label}>Property Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter property title"
            placeholderTextColor="#888"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter property description"
            placeholderTextColor="#888"
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor="#888"
            value={formData.price}
            onChangeText={(text) => setFormData({...formData, price: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            placeholderTextColor="#888"
            value={formData.location}
            onChangeText={(text) => setFormData({...formData, location: text})}
          />

          <Text style={styles.label}>Bedrooms</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of bedrooms"
            placeholderTextColor="#888"
            value={formData.bedrooms}
            onChangeText={(text) => setFormData({...formData, bedrooms: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Bathrooms</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of bathrooms"
            placeholderTextColor="#888"
            value={formData.bathrooms}
            onChangeText={(text) => setFormData({...formData, bathrooms: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Area</Text>
          <TextInput
            style={styles.input}
            placeholder="Area in sq ft"
            placeholderTextColor="#888"
            value={formData.area}
            onChangeText={(text) => setFormData({...formData, area: text})}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Property Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter property type"
            placeholderTextColor="#888"
            value={formData.propertyType}
            onChangeText={(text) => setFormData({...formData, propertyType: text})}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Property</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  formCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.MT_SECONDARY_2,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  button: {
    backgroundColor: Colors.MT_PRIMARY_1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostPropertyForm;
