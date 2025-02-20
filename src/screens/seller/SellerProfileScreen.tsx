import {StyleSheet, View} from 'react-native';
import React from 'react';
import ProfileScreen from '../common/ProfileScreen';
import Header from '../../components/Header';

const SellerProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="User Profile" />
      <ProfileScreen />
    </View>
  );
};

export default SellerProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
});
