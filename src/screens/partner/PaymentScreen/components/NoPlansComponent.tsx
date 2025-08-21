import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const NoPlansComponent = React.memo(() => (
  <View style={styles.noPlansContainer}>
    <Text style={styles.noPlansText}>No plans available at the moment.</Text>
  </View>
));

const styles = StyleSheet.create({
  noPlansContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    marginTop: 50,
  },
  noPlansText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
