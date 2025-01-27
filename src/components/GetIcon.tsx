import React from 'react';
import {Image, StyleSheet} from 'react-native';

type IconProps = {
  iconName: 'search' | 'clear' | 'filter' | 'edit' | 'delete' | 'property';
  color?: string;
};

const GetIcon = ({iconName, color}: IconProps) => {
  // For debugging
  console.log('Color received:', color);

  const iconMap = {
    search: require('../assets/Icon/search.png'),
    clear: require('../assets/Icon/crossicon.png'),
    filter: require('../assets/Icon/filter.png'),
    edit: require('../assets/Icon/Edit.png'),
    delete: require('../assets/Icon/recycle-bin.png'),
    property: require('../assets/Icon/add.png'),
  };

  const imageStyle = [styles.searchIcon, color ? {tintColor: color} : null];

  // For debugging
  console.log('Applied styles:', imageStyle);

  return <Image source={iconMap[iconName]} style={imageStyle} />;
};

const styles = StyleSheet.create({
  searchIcon: {
    height: 20,
    width: 20,
  },
});

export default GetIcon;
