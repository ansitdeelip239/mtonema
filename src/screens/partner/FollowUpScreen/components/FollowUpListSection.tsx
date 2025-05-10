import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import FollowUpCard from './FollowUpCard';
import {FollowUpType} from '../../../../types';
import GetIcon, {IconEnum} from '../../../../components/GetIcon';
import Colors from '../../../../constants/Colors';
import {useTheme} from '../../../../context/ThemeProvider';

interface FollowUpListSectionProps {
  title?: string;
  iconName?: IconEnum;
  isLoading: boolean;
  followUps: FollowUpType[] | undefined;
  emptyText: string;
  showTitle?: boolean;
  onFollowUpPress?: (clientId: number) => void;
  filterType?: string;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
}

const FollowUpListSection: React.FC<FollowUpListSectionProps> = ({
  title = '',
  iconName = 'calendar',
  isLoading,
  followUps,
  emptyText,
  showTitle = true,
  onFollowUpPress,
  filterType,
  onEndReached,
  isLoadingMore = false,
}) => {
  const {theme} = useTheme();
  const renderFollowUpItem = ({item}: {item: FollowUpType}) => (
    <TouchableOpacity onPress={() => onFollowUpPress?.(item.client.id)}>
      {!filterType ? (
        <FollowUpCard item={item} />
      ) : (
        <FollowUpCard item={item} filterType={filterType} />
      )}
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.MT_PRIMARY_1} />
      </View>
    );
  };

  return (
    <View style={styles.sectionContainer}>
      {showTitle && (
        <View style={styles.sectionTitleContainer}>
          <GetIcon iconName={iconName} size={22} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
          <Text style={styles.loaderText}>Loading follow-ups...</Text>
        </View>
      ) : followUps && followUps.length > 0 ? (
        <FlatList
          data={followUps}
          renderItem={renderFollowUpItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <GetIcon iconName="about" size={24} />
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  loaderContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLight || '#999',
    textAlign: 'center',
  },
  footerLoader: {
    padding: 10,
    alignItems: 'center',
  },
});

export default FollowUpListSection;
