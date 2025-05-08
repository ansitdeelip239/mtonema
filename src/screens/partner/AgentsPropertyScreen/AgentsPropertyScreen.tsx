import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {AgentData, FilterValues, PagingModel} from '../../../types';
import renderFooter from './components/RenderFooter';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {usePartner} from '../../../context/PartnerProvider';
import RenderItem from './components/RenderItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AgentDataStackParamList} from '../../../navigator/components/AgentDataStack';
import SearchAndFilter from './components/SearchAndFilter';
import { useTheme } from '../../../context/ThemeProvider';

// type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Property'>;
type Props = NativeStackScreenProps<AgentDataStackParamList, 'AgentDataScreen'>;

const AgentDataScreen: React.FC<Props> = ({navigation}) => {
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>({
    propertyLocation: null,
    propertyType: null,
    bhkType: null,
  });
  const {user} = useAuth();
  const {agentPropertyUpdated, setAgentPropertyUpdated} = usePartner();
  const {theme} = useTheme();
  const PAGE_SIZE = 10;

  const isInitialRender = useRef(true);
  const lastAppliedFilters = useRef<FilterValues>(filters);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchAgentData(1, true);
  };

  const handleFilter = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const DEFAULT_PAGING_MODEL: PagingModel = useMemo(
    () => ({
      currentPage: 1,
      nextPage: false,
      pageSize: 10,
      previousPage: false,
      totalCount: 0,
      totalPage: 1,
    }),
    [],
  );

  const fetchAgentData = useCallback(
    async (page: number, shouldRefresh = false) => {
      try {
        if (shouldRefresh) {
          setIsInitialLoading(true);
        } else {
          setIsPaginationLoading(true);
        }

        setIsLoading(true);
        const response = await PartnerService.getAgentProperties(
          page,
          PAGE_SIZE,
          user?.email || '',
          searchQuery,
          filters.propertyLocation || '',
          filters.propertyType || '',
          filters.bhkType || '',
        );

        // Extract properties and pagination from response.data
        const newData = response.properties ?? [];
        const pagingInfo: PagingModel =
          response.pagination ?? DEFAULT_PAGING_MODEL;
        setLocations(response.propertyLocations);

        const filteredData = newData.filter(
          (item: any) => item !== null && item !== undefined,
        );

        if (shouldRefresh) {
          setAgentData(filteredData);
        } else {
          setAgentData(prev => [...prev, ...filteredData]);
        }

        const hasMore = Boolean(
          pagingInfo?.currentPage &&
            pagingInfo?.totalPage &&
            pagingInfo.currentPage < pagingInfo.totalPage,
        );
        setHasMoreData(hasMore);
        setCurrentPage(pagingInfo?.currentPage ?? 1);
      } catch (error) {
        console.error('Error fetching agent data:', error);
        if (shouldRefresh) {
          setAgentData([]);
        }
        setHasMoreData(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsInitialLoading(false);
        setIsPaginationLoading(false);
      }
    },
    [user?.email, searchQuery, filters, DEFAULT_PAGING_MODEL],
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (
      JSON.stringify(lastAppliedFilters.current) !== JSON.stringify(filters)
    ) {
      lastAppliedFilters.current = filters;
      fetchAgentData(1, true);
    }
  }, [filters, fetchAgentData]);

  useEffect(() => {
    fetchAgentData(1, true);
  }, [user?.email, fetchAgentData, agentPropertyUpdated]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchAgentData(1, true);
  }, [fetchAgentData]);

  const handleLoadMore = () => {
    if (!isLoading && hasMoreData) {
      fetchAgentData(currentPage + 1);
    }
  };

  const renderEmptyComponent = () => {
    if (isInitialLoading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No properties available</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Agent's Property">
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: theme.secondaryColor}]}
          onPress={() => {
            navigation.navigate('AddAgentDataScreen', {
              editMode: false,
              propertyData: {} as AgentData,
            });
          }}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </Header>
      <SearchAndFilter
        initialFilters={filters}
        onSearch={handleSearch}
        onFilter={handleFilter}
        locations={locations}
      />

      {isInitialLoading ? (
        <View style={styles.centerLoaderContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      ) : (
        <FlatList
          data={agentData}
          renderItem={({item}) => (
            <RenderItem
              item={item}
              onDataUpdate={() => setAgentPropertyUpdated(prev => !prev)}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) =>
            `${item.id?.toString() || 'item'}-${index}`
          }
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isPaginationLoading ? renderFooter({isLoading: true}) : null
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centerLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AgentDataScreen;
