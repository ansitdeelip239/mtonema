import React from 'react';
import {Image, StyleSheet} from 'react-native';

const GetIcon = (iconName: 'search' | 'clear' | 'filter' | 'edit' | 'delete') => {
  const iconMap = {
    search: require('../assets/Icon/search.png'),
    clear: require('../assets/Icon/crossicon.png'),
    filter: require('../assets/Icon/filter.png'),
    edit: require('../assets/Icon/Edit.png'),
    delete: require('../assets/Icon/recycle-bin.png'),
  };
  return <Image source={iconMap[iconName]} style={styles.searchIcon} />;
};

const styles = StyleSheet.create({
  searchIcon: {
    height: 20,
    width: 20,
  },
});

export default GetIcon;
