import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface ErrorStateProps {
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = React.memo(({message}) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.error}>{message}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ErrorState;
