import React from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import ProfileScreen from '../../common/ProfileScreen';

export default function PartnerProfileScreen() {
  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Profile" />
      <ProfileScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
});
