import React from 'react';
import {Image, StyleSheet} from 'react-native';

export type IconEnum =
  | 'search'
  | 'clear'
  | 'filter'
  | 'edit'
  | 'delete'
  | 'property'
  | 'hamburgerMenu'
  | 'realEstate'
  | 'home'
  | 'client'
  ;

type IconProps = {
  iconName: IconEnum;
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
    hamburgerMenu: require('../assets/Icon/menu.png'),
    realEstate: require('../assets/Icon/real-estate.png'),
    home: require('../assets/Icon/home.png'),
    client: require('../assets/Icon/customer.png'),
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
