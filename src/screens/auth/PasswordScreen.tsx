import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import AuthService from '../../services/AuthService';


type Props = NativeStackScreenProps<AuthStackParamList, 'PasswordScreen'>;

const PasswordScreen :React.FC<Props>=({navigation ,route})=> {
  const {email} = route.params;
  const [password,setPassword] =useState('');
  const onContinue =()=>{}

  const handleContinue = async () => {
    console.log("Sign In button pressed");
    console.log("Email:", email);
    console.log("Password:", password);
  
    try {
      const response = await AuthService.verifyPassword(email, password);
      console.log("Response:", response); // Check the response from the AuthService
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  

  
return (
  <View style={styles.mainScreen}>
    {/* Logo Section */}
    <View style={styles.upperPart}>
      <Image
         source={require('../../assets/Images/houselogo1.png')} 
          style={styles.image}
        resizeMode="contain"
      />
    </View>
    {/* Input Section / Lower Part */}
    
    <View style={[styles.lowerPart]}>
    <View style={styles.txtpadding}>
      <Text style={[styles.label]}>Password</Text>
      <TextInput
      value={password}
      onChangeText={setPassword}
      secureTextEntry={true}
        placeholder="Password"
        style={[styles.input,styles.spacing1]}
      />
    </View>
    <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forget Password?</Text>
        </TouchableOpacity>

    {/* Buttons Section */}
    <View style={styles.btnsection}>
      <TouchableOpacity style={[styles.button, styles.spacing]}  onPress={handleContinue}>
        <Text style={styles.buttonText}
        >Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.spacing,styles.color]}  onPress={navigation.goBack}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
mainScreen:{
  flex:1,
  backgroundColor: '#cc0e74', // Pinkish Background
},
forgotPassword:{
  position: 'absolute',
  right: '5%',
  top: 135,
  fontSize: 20,
},
forgotText:{
  fontSize: 16,
  color: '#cc0e74'

},
txtpadding:{
paddingLeft:10,
width:'95%',
},
btnsection:{
justifyContent: 'center', // Centers vertically
alignItems: 'center', 

},
upperPart:{
  flex: 2,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#cc0e74', // Same as main background
  borderBottomRightRadius: 60,
},
lowerPart:{
  flex: 3,
  backgroundColor: '#ffffff', // White background for lower part
  borderTopLeftRadius: 70,
  paddingVertical: 60,
  
},
image:{
  width: '70%',
  height: '30%',
},
label: {
  fontSize: 20,
  color: '#880e4f', // Dark pink
  marginBottom: 10,
  fontWeight: 'bold',
},
input: {
  borderBottomWidth: 1,
  borderBottomColor: '#880e4f',
  padding: 5,
  fontSize: 16,
},
button:{
  backgroundColor: '#cc0e74', // Matching pink button
  padding: 15,
  borderRadius: 30,
  marginVertical: 10,
  width: '95%',
  alignItems: 'center',
  justifyContent:'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
spacing:{
  marginBottom: 10, // Adds space below each button
},
spacing1:{
  marginBottom: 55, // Adds space below each button
},
buttonText:{
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 'bold',
},
color:{
  backgroundColor: '#790c5a',
},
});

export default PasswordScreen;