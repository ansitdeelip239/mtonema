import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PropertyStackParamList} from '../../navigator/components/PropertyStack';
import Colors from '../../constants/Colors';
import {SellerProperty} from '../../types';
import SellerPropertyCard from './components/SellerPropertyCard';
import {usePropertyList} from './hooks/usePropertyList';

type Props = NativeStackScreenProps<PropertyStackParamList, 'PropertyList'>;

const PropertyListScreen: React.FC<Props> = ({navigation}) => {
  const {
    properties,
    isLoading,
    isLoadingMore,
    refreshing,
    totalCount,
    handleRefresh,
    handleLoadMore,
  } = usePropertyList(12);


  const renderPropertyItem: ListRenderItem<SellerProperty> = ({item}) => (
    <View style={styles.propertyCardContainer}>
      <SellerPropertyCard
        property={item}
        onPress={() => navigation.navigate('PropertyDetail', {property: item})}
      />
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingMoreText}>Loading more properties...</Text>
        </View>
      );
    }
    return <View style={styles.bottomSpacing} />;
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingEmptyText}>Loading properties...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No properties found</Text>
      </View>
    );
  };

  const renderListHeader = () => (
    <View>
      <BuyerSellerHeader
        title="Listed Properties"
        subtitle="Manage your listings"
      />

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Total Properties: {isLoading ? 'Loading...' : totalCount}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={
          properties.length === 0 ? styles.emptyListContent : styles.listContent
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.MT_SECONDARY_2,
  },
  propertiesList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyDetails: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    marginLeft: 4,
    flex: 1,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.MT_PRIMARY_1,
    marginBottom: 12,
  },
  propertySpecs: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  specText: {
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: Colors.MT_SECONDARY_2,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  editButtonText: {
    color: Colors.MT_PRIMARY_1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#DC143C',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: Colors.MT_PRIMARY_1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.MT_PRIMARY_1,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  propertyCardContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  bottomSpacing: {
    height: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.MT_SECONDARY_2,
    textAlign: 'center',
  },
  loadingEmptyText: {
    marginTop: 16,
    fontSize: 14,
    color: Colors.MT_SECONDARY_2,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default PropertyListScreen;
