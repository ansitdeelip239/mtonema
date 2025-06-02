import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Colors from '../../../../constants/Colors';

interface ContentLoadingIndicatorProps {
  type: 'initial' | 'loadMore';
  text?: string;
}

const ContentLoadingIndicator: React.FC<ContentLoadingIndicatorProps> = ({
  type,
  text,
}) => {
  if (type === 'initial') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.MT_PRIMARY_1} />
        <Text style={styles.loadingText}>
          {text || 'Loading content templates...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.loadingMoreContainer}>
      <ActivityIndicator size="small" color={Colors.MT_PRIMARY_1} />
      <Text style={styles.loadingMoreText}>{text || 'Loading more...'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ContentLoadingIndicator;
