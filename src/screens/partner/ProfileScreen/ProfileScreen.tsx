import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Header from '../../../components/Header';
import { PartnerDrawerParamList } from '../../../types/navigation';
import EditProfileComponent from '../../../components/EditProfileComponent';

export default function PartnerProfileScreen() {
  return (
    <View style={styles.container}>
      {
        Platform.OS === 'android' && (
          <Header<PartnerDrawerParamList> title="Profile" />
        )
      }
      {/* <ProfileScreen /> */}
      <EditProfileComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
});
