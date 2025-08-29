import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { useTranslation } from 'react-i18next';

interface ContentHeaderProps {
  totalCount: number;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({totalCount}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.headerSection}>
      <Text style={styles.countText}>
        {t('contentTemplate.header.templatesFound', '{{count}} template found', { count: totalCount })}
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
