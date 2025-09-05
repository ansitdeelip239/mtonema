import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import BuyerSellerHeader from '../../components/BuyerSellerHeader';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {SellerBottomTabParamList} from '../../types/navigation';
import Colors from '../../constants/Colors';
import GetIcon from '../../components/GetIcon';
import SellerService from '../../services/SellerService';
import {SellerProperty} from '../../types';
import SellerPropertyCard from './components/SellerPropertyCard';
import { useAuth } from '../../context/AuthProvider';

type Props = BottomTabScreenProps<SellerBottomTabParamList, 'Dashboard'>;

const PropertyListScreen: React.FC<Props> = ({navigation}) => {
  const {user} = useAuth();
  const [properties, setProperties] = useState<SellerProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Function to fetch properties
  const fetchProperties = useCallback(async (page: number, isLoadMore = false) => {
    if (!user?.id) {
      return;
    }

    try {
      if (!isLoadMore) {
        setIsLoading(true);
        setProperties([]);
      } else {
        setIsLoadingMore(true);
      }

      const response = await SellerService.getPropertiesByUserId(user.id, page, 12);

      if (response.success && response.data) {
        const propertiesData = response.data.properties;

        if (isLoadMore) {
          setProperties(prev => [...prev, ...propertiesData]);
        } else {
          setProperties(propertiesData);
        }

        setTotalCount(response.data.pagination.totalCount);
        setHasMoreData(response.data.pagination.nextPage && propertiesData.length === 12);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchProperties(1, false);
      setCurrentPage(1);
    }
  }, [user?.id, fetchProperties]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchProperties(1, false);
  }, [fetchProperties]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMoreData) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProperties(nextPage, true);
    }
  }, [isLoading, isLoadingMore, hasMoreData, currentPage, fetchProperties]);

  const renderPropertyItem: ListRenderItem<SellerProperty> = ({item}) => (
    <View style={styles.propertyCardContainer}>
      <SellerPropertyCard property={item} onPress={(propertyId: string) => console.log('Property pressed:', propertyId)} />
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

  return (
    <View style={styles.container}>
      <BuyerSellerHeader
        title="Listed Properties"
        subtitle="Manage your listings"
      >
        <GetIcon iconName="filter" size={20} color="#333" />
      </BuyerSellerHeader>

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Total Properties: {isLoading ? 'Loading...' : totalCount}
          </Text>
          <Text style={styles.summaryText}>
            Active: {isLoading ? 'Loading...' : properties.filter(p => p.recordstatus === 'Active').length}
          </Text>
        </View>

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
          contentContainerStyle={properties.length === 0 ? styles.emptyListContent : undefined}
        />

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddProperty')}
        >
          <GetIcon iconName="plus" color="white" size="24" />
          <Text style={styles.addButtonText}>Add New Property</Text>
        </TouchableOpacity>
      </View>
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
});

export default PropertyListScreen;
