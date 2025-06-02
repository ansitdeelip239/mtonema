import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ContentHeaderProps {
  totalCount: number;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({totalCount}) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.countText}>
        {totalCount} template{totalCount !== 1 ? 's' : ''} found
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default ContentHeader;
