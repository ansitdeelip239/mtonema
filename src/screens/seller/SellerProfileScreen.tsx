import {StyleSheet, View} from 'react-native';
import React from 'react';
import ProfileScreen from '../common/ProfileScreen';

const SellerProfileScreen = () => {
  return (
    <View style={styles.container}>
        {/* <Header title="Profile"/> */}
      <ProfileScreen/>
    </View>
  );
};

export default SellerProfileScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
    paddingBottom: 80,
    },
});
