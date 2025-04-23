import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Platform, StatusBar} from 'react-native';
import GetIcon from './GetIcon';
import Colors from '../constants/Colors';
import {useDrawer} from '../hooks/useDrawer';
import {ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

interface HeaderProps {
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
  titleSize = 20,
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
    <LinearGradient
      colors={[Colors.MT_PRIMARY_1, '#1e5799']}
      style={styles.headerGradient}>
      <StatusBar
        backgroundColor={Colors.MT_PRIMARY_1}
        barStyle="light-content"
      />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={backButton ? () => handleBackPress() : openDrawer}
          style={styles.menuButton}>
          <GetIcon
            iconName={backButton ? 'back' : 'hamburgerMenu'}
            color="white"
            size="24"
          />
        </TouchableOpacity>
        <Text style={[styles.headerText, {fontSize: titleSize}]}>{title}</Text>
        <View style={styles.child}>{children}</View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    paddingLeft: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  child: {
    marginRight: 8,
  },
});
