import React, {useState} from 'react';
import {
  View,
  Text,
  // Button,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {api} from '../../utils/api';
import url from '../../constants/api';
import Header from '../../components/Header';
import { TextInput } from 'react-native-paper';
export default function ContactScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });
  const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const PHONE_REGEX = /^\d{10,15}$/;
const [loading, setLoading] = useState(false);
  // Add validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      mobile: '',
      message: '',
    }; // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Mobile validation
    if (!PHONE_REGEX.test(formData.mobile)) {
      newErrors.mobile = 'Phone number must be between 10-15 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleMailClick = () => {
    // Open the default email app
    Linking.openURL('mailto:info@dncrproperty.com');
  };
  const handleWhatsapp = () => {
    // Open the default email app
    Linking.openURL('https://api.whatsapp.com/send?phone=917303062845');
  };

  const handleMap = () => {
    Linking.openURL('https://maps.app.goo.gl/TGNnYUwShzfK4DGUA');
  };
  const handleCallClick = (phoneNumber: any) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const handleInputChange = (key: string, value: string) => {
    setFormData({...formData, [key]: value});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(prev=>!prev);
    try {
      const response = await api.post<any>(`${url.GetInTouch}`, formData);
      console.log(response.data);
      Alert.alert('Form Submitted',`Thank you, ${formData.name}!`);
      setFormData({name: '', email: '', mobile: '', message: ''});
      setErrors({name: '', email: '', mobile: '', message: ''});
    } catch (error) {
      Alert.alert(
        'Submission Failed',
        'There was an error submitting the form.',
      );
    }
    finally{
      setLoading(prev=>!prev);
    }
  };
  return (
    <>
    <Header title="Contact us"/>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Form Section */}
      <Text style={styles.header}>Fill Your Enquiry Here</Text>
      <View style={styles.form}>
        <TextInput
        label="Name"
         mode="outlined"
          style={[styles.input, errors.name ? styles.inputError : null]}
          value={formData.name}
          onChangeText={value => handleInputChange('name', value)}
          />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        <TextInput
        label="Email-Address"
         mode="outlined"
          style={[styles.input, errors.email ? styles.inputError : null]}
          value={formData.email}
          onChangeText={value => handleInputChange('email', value)}
          keyboardType="email-address"
          caretHidden={false}
          />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}
        <TextInput
        label="Mobile Number"
          style={[styles.input, errors.mobile ? styles.inputError : null]}
          value={formData.mobile}
          mode="outlined"
          onChangeText={value => handleInputChange('mobile', value)}
          keyboardType="phone-pad"
          maxLength={15}
          />
        {errors.mobile ? (
          <Text style={styles.errorText}>{errors.mobile}</Text>
        ) : null}
        <TextInput
        label="Enter your Message"
         mode="outlined"
          style={[styles.input, styles.textarea]}
          value={formData.message}
          onChangeText={value => handleInputChange('message', value)}
          multiline
          numberOfLines={4}
          />
                <TouchableOpacity style={styles.Button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btntxt}>Submit</Text>
          )}
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
</>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
  Button: {
    backgroundColor: '#cc0e74',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btntxt: {
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
    borderRadius: 8, // Keep border-radius for rounded corners
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: 'white', // Ensures consistent input background
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
