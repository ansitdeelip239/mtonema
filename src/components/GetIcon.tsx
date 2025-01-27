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
  | 'user'
  ;

type IconProps = {
  iconName: IconEnum;
  color?: string;
  size?: string;
};

const GetIcon = ({iconName, color, size}: IconProps) => {
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
    user: require('../assets/Icon/user.png'),
  };

  const imageStyle = [
    styles.searchIcon,
    color ? {tintColor: color} : null,
    size ? {width: Number(size), height:Number(size)} : null,
  ];

  return <Image source={iconMap[iconName]} style={imageStyle} />;
};

const styles = StyleSheet.create({
  searchIcon: {
    height: 20,
    width: 20,
  },
});

export default GetIcon;
