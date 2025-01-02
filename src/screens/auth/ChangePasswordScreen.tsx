import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, Image} from 'react-native';

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All fields are required');
    } else if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
    } else {
      setErrorMessage('');
      console.log('Password changed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {/* Old Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry={!showOldPassword}
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowOldPassword(!showOldPassword)}>
          <Image
            source={
              showOldPassword
                ? require('../../assets/Icon/eye.png')
                : require('../../assets/Icon/eye-slash.png')
            }
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowNewPassword(!showNewPassword)}>
          <Image
            source={
              showNewPassword
              ? require('../../assets/Icon/eye.png')
                : require('../../assets/Icon/eye-slash.png')
            }
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image
            source={
              showConfirmPassword
              ? require('../../assets/Icon/eye.png')
              : require('../../assets/Icon/eye-slash.png')
            }
            style={styles.iconImage}
          />
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.Button} onPress={handleSubmit}>
        <Text style={styles.btntxt}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
  },
  icon: {
    padding: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ChangePasswordScreen;
