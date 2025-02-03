import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {api} from '../../utils/api';
import url from '../../constants/api';
import {useAuth} from '../../hooks/useAuth';
import Header from '../../components/Header';

const ChangePasswordScreen = () => {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {user} = useAuth();

  const handleSubmit = async () => {
    let hasError = false;

    if (!oldPassword) {
      setOldPasswordError('Old password is required');
      hasError = true;
    } else {
      setOldPasswordError('');
    }

    if (!newPassword) {
      setNewPasswordError('New password is required');
      hasError = true;
    } else {
      setNewPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('New passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }

    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(url.ChangePassword, {
        Email: user?.Email,
        oldPassword: oldPassword,
        Password: newPassword,
      });
      console.log('Response:', response);
      if (response.Success) {
        Alert.alert('Success', 'Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else if (response.httpStatus === 404) {
        setOldPasswordError('Old password does not match');
      } else {
        setConfirmPasswordError(response.Message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setConfirmPasswordError((error as any).message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Change Password"/>
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

      {/* Old Password Input */}
      <View style={[styles.inputContainer, oldPasswordError ? styles.errorBorder : null]}>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry={!showOldPassword}
          value={oldPassword}
          onChangeText={(text) => {
            setOldPassword(text);
            setOldPasswordError('');
          }}
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
      {oldPasswordError && <Text style={styles.error}>{oldPasswordError}</Text>}

      {/* New Password Input */}
      <View style={[styles.inputContainer, newPasswordError ? styles.errorBorder : null]}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setNewPasswordError('');
          }}
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
      {newPasswordError && <Text style={styles.error}>{newPasswordError}</Text>}

      {/* Confirm Password Input */}
      <View style={[styles.inputContainer, confirmPasswordError ? styles.errorBorder : null]}>
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setConfirmPasswordError('');
          }}
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
      {confirmPasswordError && <Text style={styles.error}>{confirmPasswordError}</Text>}

      {/* Submit Button */}
      <TouchableOpacity style={styles.Button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.btntxt}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
</>
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
  errorBorder: {
    borderColor: 'red',
  },
});

export default ChangePasswordScreen;
