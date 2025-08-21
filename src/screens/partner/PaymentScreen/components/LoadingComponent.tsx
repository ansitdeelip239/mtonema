import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

// Extract components
export const LoadingComponent = React.memo(() => (
  <View style={[styles.container, styles.loadingContainer]}>
    <ActivityIndicator size="large" color="#53a20e" />
    <Text style={styles.loadingText}>Loading subscription plans...</Text>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
