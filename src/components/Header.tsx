import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon from './GetIcon';
import Colors from '../constants/Colors';
import {useDrawer} from '../hooks/useDrawer';
import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface HeaderProps{
  title: string;
  children?: React.ReactNode;
  backButton?: boolean;
  navigation?: NativeStackNavigationProp<any>;
  onBackPress?: () => void;
  titleSize?: number;
}

export default function Header<T extends ParamListBase>({
  title,
  children,
  backButton,
  navigation,
  onBackPress,
  titleSize = 26,
}: HeaderProps) {
  const {openDrawer} = useDrawer<T>();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={backButton ? () => handleBackPress() : openDrawer}
        style={styles.menuButton}>
        <GetIcon
          iconName={backButton ? 'back' : 'hamburgerMenu'}
          color={Colors.black}
        />
      </TouchableOpacity>
      <Text style={[styles.headerText, {fontSize: titleSize}]}>{title}</Text>
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
    minHeight: 60,
  },
  headerText: {
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
