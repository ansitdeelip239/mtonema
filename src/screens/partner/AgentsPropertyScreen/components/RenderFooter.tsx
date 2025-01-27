import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const renderFooter = ({isLoading}: {isLoading: boolean}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color="#cc0e74" />
    </View>
  );
};

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default renderFooter;
