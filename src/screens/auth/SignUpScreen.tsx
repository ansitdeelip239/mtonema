import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigator/AuthNavigator';



type Props = NativeStackScreenProps<AuthStackParamList, 'SignUpScreen'>;
const SignUpScreen :React.FC<Props>=({navigation})=> {

const onContinue =()=>{}
const handleContinue=() =>{}
return (
  <View style={styles.mainScreen}>
    {/* Logo Section */}
    <View style={styles.upperPart}>
      <Image
         source={require('../../assets/Images/houselogo.png')} 
          style={styles.image}
        resizeMode="contain"
      />
    </View>
    {/* Input Section / Lower Part */}
    
    <View style={[styles.lowerPart]}>
    <View style={styles.txtpadding}>
      <Text style={[styles.label]}>Email</Text>
      <TextInput
        placeholder="Email"
        style={[styles.input,styles.spacing1]}
      />
    </View>
    <View style={styles.txtpadding}>
      <Text style={[styles.label]}>Mobile</Text>
      <TextInput
        placeholder="Mobile"
        style={[styles.input,styles.spacing1]}
      />
    </View>
    <View style={styles.txtpadding}>
      <Text style={[styles.label]}>Name</Text>
      <TextInput
        placeholder="Name"
        style={[styles.input,styles.spacing1]}
      />
    </View>
    <View style={styles.txtpadding}>
      <Text style={[styles.label]}>Location</Text>
      <TextInput
        placeholder="Search"
        style={[styles.input,styles.spacing1]}
      />
    </View>
    <View style={styles.btnsection}>
          <TouchableOpacity style={[styles.button, styles.spacing]}  onPress={handleContinue}>
            <Text style={styles.buttonText}
            >Sign Up</Text>
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
txtpadding:{
paddingLeft:10,
width:'95%',
},
btnsection:{
  justifyContent: 'center', // Centers vertically
  alignItems: 'center', 
  },
upperPart:{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#cc0e74', // Same as main background
  borderBottomRightRadius: 60,
},
lowerPart:{
  flex: 4,
  backgroundColor: '#ffffff', // White background for lower part
  borderTopLeftRadius: 70,
  paddingVertical: 60,
  
},
image:{
  width: '100%',
  height: '100%',
},
label: {
  fontSize: 20,
  color: '#880e4f', // Dark pink
  marginBottom: 0,
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
color:{
  backgroundColor: '#790c5a',
},
spacing1:{
  marginBottom: 35, // Adds space below each button
},
buttonText:{
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 'bold',
},
});
export default SignUpScreen;