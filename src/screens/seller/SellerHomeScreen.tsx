import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function SellerHomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>This is a demo screen</Text>
        <Text style={styles.subText}>Functionality will be added soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Light background for contrast
  },
  box: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // Shadow effect for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
