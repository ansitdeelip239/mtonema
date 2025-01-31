import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, FlatList, RefreshControl, Text} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {AgentData, FilterValues, PagingModel} from '../../../types';
import renderItem from './components/RenderItem';
import renderFooter from './components/RenderFooter';
import SearchHeader from './components/SearchHeader';
import Colors from '../../../constants/Colors';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import Header from '../../../components/Header';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import {usePartner} from '../../../context/PartnerProvider';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Property'>;

const AgentDataScreen: React.FC<Props> = ({navigation}) => {
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      CurrentPage: 1,
      NextPage: false,
      PageSize: 10,
      PreviousPage: false,
      TotalCount: 0,
      TotalPage: 1,
    }),
    [],
  );

  const fetchAgentData = useCallback(
    async (page: number, shouldRefresh = false) => {
      try {
        setIsLoading(true);
        const response = await PartnerService.getAgentImportData(
          page,
          PAGE_SIZE,
          user?.Email || '',
          searchQuery,
          filters.propertyLocation || '',
          filters.propertyType || '',
          filters.bhkType || '',
        );

        const newData = response?.data?.AgentDataModel ?? [];
        const pagingInfo: PagingModel =
          response?.data?.responsePagingModel ?? DEFAULT_PAGING_MODEL;

        const filteredData = newData.filter(
          (item: any) => item !== null && item !== undefined,
        );

        if (shouldRefresh) {
          setAgentData(filteredData);
        } else {
          setAgentData(prev => [...prev, ...filteredData]);
        }

        const hasMore = Boolean(
          pagingInfo?.CurrentPage &&
            pagingInfo?.TotalPage &&
            pagingInfo.CurrentPage < pagingInfo.TotalPage,
        );

        setHasMoreData(hasMore);
        setCurrentPage(pagingInfo?.CurrentPage ?? 1);
      } catch (error) {
        console.error('Error fetching agent data:', error);
        if (shouldRefresh) {
          setAgentData([]);
        }
        setHasMoreData(false);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.Email, searchQuery, filters, DEFAULT_PAGING_MODEL],
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
  }, [user?.Email, fetchAgentData, agentPropertyUpdated]);

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

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No properties available</Text>
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Header<PartnerDrawerParamList> title="Agent's Property" />
        <SearchHeader
          initialFilters={filters}
          onSearch={handleSearch}
          onFilter={handleFilter}
          agentData={agentData}
        />
        <FlatList
          data={agentData}
          renderItem={({item}) =>
            renderItem({
              item,
              onDataUpdate: () => setAgentPropertyUpdated(prev => !prev),
              navigation,
            })
          }
          keyExtractor={(item, index) =>
            `${item.Id?.toString() || 'item'}-${index}`
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
          ListFooterComponent={renderFooter({isLoading})}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
    </PaperProvider>
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
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  fabStyle: {
    backgroundColor: Colors.main,
  },
});

export default AgentDataScreen;
