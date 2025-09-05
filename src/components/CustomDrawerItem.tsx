import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon, {IconEnum} from './GetIcon';
import {useTheme} from '../context/ThemeProvider';

interface CustomDrawerItemProps {
  iconName: IconEnum;
  label: string;
  onPress: () => void;
  isActive?: boolean;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  showForRoles?: string[];
  userRole?: string;
  customStyles?: any;
}

const CustomDrawerItem: React.FC<CustomDrawerItemProps> = ({
  iconName,
  label,
  onPress,
  isActive = false,
  backgroundColor,
  textColor,
  iconColor,
  showForRoles,
  userRole,
  customStyles,
}) => {
  const {theme} = useTheme();

  // Check if item should be shown based on user role
  if (showForRoles && userRole && !showForRoles.includes(userRole)) {
    return null;
  }

  const itemBackgroundColor = backgroundColor || (isActive ? theme.primaryColor : theme.backgroundColor || '#f5f5f5');
  const itemTextColor = textColor || (isActive ? 'white' : theme.textColor || 'black');
  const itemIconColor = iconColor || (isActive ? 'white' : theme.textColor || 'black');

  return (
    <TouchableOpacity
      style={[
        styles.customDrawerItem,
        {
          backgroundColor: itemBackgroundColor,
          ...customStyles,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <GetIcon
          iconName={iconName}
          color={itemIconColor}
          size="25"
        />
      </View>
      <Text
        style={[
          styles.itemText,
          isActive && styles.activeItemText,
          {color: itemTextColor},
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  customDrawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginLeft: 4,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeItemText: {
    fontWeight: '600',
  },
});

export default CustomDrawerItem;
