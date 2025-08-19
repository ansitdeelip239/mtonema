import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = React.memo(
  ({message = 'Loading...'}) => {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default LoadingState;
