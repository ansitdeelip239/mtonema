import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

interface InsightCardProps {
  children: React.ReactNode;
  style?: object;
}

export const InsightCard: React.FC<InsightCardProps> = ({children, style}) => (
  <View style={[styles.container, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
