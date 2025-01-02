import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  // Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
// import { Image } from 'react-native-reanimated/lib/typescript/Animated';

export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });

  const handleMailClick = () => {
    // Open the default email app
    Linking.openURL('mailto:info@dncrproperty.com');
  };
  const handleWhatsapp = () => {
    // Open the default email app
    Linking.openURL('https://api.whatsapp.com/send?phone=917303062845');
  };

const handleMap = ()=>{
  Linking.openURL('https://maps.app.goo.gl/TGNnYUwShzfK4DGUA');
};
const handleCallClick = (phoneNumber :any) => {
  Linking.openURL(`tel:${phoneNumber}`);
};
  const handleInputChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = () => {
    Alert.alert('Form Submitted', `Thank you, ${formData.name}!`);
    setFormData({name: '', email: '', mobile: '', message: ''}); // Reset form
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Form Section */}
      <Text style={styles.header}>Fill Your Enquiry Here</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={formData.name}
          onChangeText={value => handleInputChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={formData.mobile}
          onChangeText={value => handleInputChange('mobile', value)}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Enter Message"
          value={formData.message}
          onChangeText={value => handleInputChange('message', value)}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.Button}
          onPress={handleSubmit}>
          <Text style={styles.btntxt}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Details Section */}
      <Text style={[styles.header, {}]}>Contact Us</Text>
      <View style={styles.card}>
        <Image
          source={require('../../assets/Icon/Call-Icon.png')}
          style={styles.image}
        />
     <TouchableOpacity onPress={() => handleCallClick('+917303062845')}>
        <Text style={styles.text}>+91 7303062845</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCallClick('+919718361550')}>
        <Text style={styles.text}>+91 9718361550</Text>
      </TouchableOpacity>
        {/* <Text style={styles.subtext}>09:00 AM to 09:00 PM</Text> */}
      </View>

      <View style={styles.card}>
       <TouchableOpacity onPress={handleWhatsapp}>
        <Image
          source={require('../../assets/Icon/Whatsapp-icon.png')}
          style={styles.image}
        />
        </TouchableOpacity>
        <Text style={styles.title}>Whatsapp</Text>
        <Text style={styles.text}>+91 7303062845</Text>
        <Text style={styles.text}>+91 9718361550</Text>
      </View>

      <View style={styles.card}>
      <TouchableOpacity onPress={handleMailClick}>
        <Image
          source={require('../../assets/Icon/Mail-icon.png')}
          style={styles.image}
        />
        </TouchableOpacity>
        <Text style={styles.title}>E-mail</Text>
        <Text style={styles.text}>info@dncrproperty.com</Text>
        <Text style={styles.subtext}>Send us your query anytime!</Text>
      </View>
      <View style={styles.card}>
       <TouchableOpacity onPress={handleMap}>
        <Image
          source={require('../../assets/Icon/Location-icon.png')}
          style={styles.image}
        />
         </TouchableOpacity>
        <Text style={styles.title}>Address</Text>
        <Text style={styles.text}>C-116 GF, OfficeOn, Sector 2, Noida</Text>
        <Text style={styles.text}>Uttar Pradesh - 201301</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    // height:'auto',
  },
  Button:{
    backgroundColor: '#cc0e74',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btntxt:{
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc0e74',
    marginBottom: 20,
    marginTop: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    padding: 10,
    width: '100%', // Add padding around the button
    marginTop: 10, // Optional: Adds spacing above the button
    alignSelf: 'center', // Optional: Centers the button
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top', // Align text at the top for multiline input
  },
  card: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
});
