import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon from './GetIcon';
import Colors from '../constants/Colors';
import {useDrawer} from '../hooks/useDrawer';
import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function Header<T extends ParamListBase>({
  title,
  children,
  backButton,
  navigation,
}: {
  title: string;
  children?: React.ReactNode;
  backButton?: boolean;
  navigation?: NativeStackNavigationProp<any>;
}) {
  const {openDrawer} = useDrawer<T>();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={backButton ? () => navigation?.goBack() : openDrawer}
        style={styles.menuButton}>
        <GetIcon
          iconName={backButton ? 'back' : 'hamburgerMenu'}
          color={Colors.black}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{title}</Text>
      <View style={styles.child}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '600',
    color: Colors.black,
    padding: 18,
    paddingBottom: 8,
    paddingTop: 5,
    flex: 1,
  },
  menuButton: {
    // paddingTop: 8,
  },
  child: {
    // paddingTop: 10,
  },
});
