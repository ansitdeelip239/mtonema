import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon from './GetIcon';
import Colors from '../constants/Colors';
import {useDrawer} from '../hooks/useDrawer';
import {PartnerDrawerParamList} from '../types/navigation';

export default function Header({title}: {title: string}) {
  const {openDrawer} = useDrawer<PartnerDrawerParamList>();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
        <GetIcon iconName="hamburgerMenu" color={Colors.black} />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  headerText: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.black,
    padding: 16,
    paddingBottom: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // padding: 16,
    paddingLeft: 16,
  },
  menuButton: {
    paddingTop: 8,
  },
});
