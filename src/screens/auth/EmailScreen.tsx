import { View, Text, Button, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';
import Colors from '../../constants/Colors';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailScreen'>;
 const EmailScreen :React.FC<Props>=({navigation})=> {
    const [email,setEmail]=useState('')
    const handleContinue=()=>{
        navigation.navigate('PasswordScreen',{email:email})
    }
    const handleBack = () =>{};
  
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
          <Text style={[styles.label]}>Email or Mobile</Text>
          <TextInput
            placeholder="Email or Mobile"
            value={email}
            onChangeText={setEmail}
            style={[styles.input,styles.spacing1]}
          />
        </View>
  
        {/* Buttons Section */}
        <View style={styles.btnsection}>
          <TouchableOpacity style={[styles.button, styles.spacing]}  onPress={handleContinue}>
            <Text style={styles.buttonText}
            >Continue</Text>
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
    color:{
      backgroundColor: '#790c5a',
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
      fontSize: 16,
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
      marginBottom: 45, // Adds space below each button
    },
    buttonText:{
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',

    },
  });

  export default EmailScreen;