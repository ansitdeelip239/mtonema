import React from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { useTranslation } from 'react-i18next';

interface LoadingFooterProps {
  isVisible: boolean;
}

const LoadingFooter: React.FC<LoadingFooterProps> = React.memo(
  ({isVisible}) => {
    const { t } = useTranslation();

    if (!isVisible) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007bff" />
        <Text style={styles.loadingText}>{t('common.states.loadingMore', 'Loading more...')}</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default LoadingFooter;
