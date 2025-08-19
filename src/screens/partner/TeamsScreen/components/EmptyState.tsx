import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = React.memo(({message}) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.empty}>{message}</Text>
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
  empty: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default EmptyState;
