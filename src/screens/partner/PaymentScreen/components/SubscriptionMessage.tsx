import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export const SubscriptionMessage = React.memo(
  ({message}: {message: string}) => (
    <View style={styles.subscriptionMessage}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  ),
);

const styles = StyleSheet.create({
  subscriptionMessage: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  messageText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
});
