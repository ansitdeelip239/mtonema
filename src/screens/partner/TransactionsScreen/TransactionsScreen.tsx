// screens/TransactionsScreen/TransactionsScreen.tsx
import React, {useCallback, useState, useMemo, useRef, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  RefreshControl,
  Platform,
} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message'; // Add this package
import {useTranslation} from 'react-i18next';
import Header from '../../../components/Header';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {
  Transaction,
  TransactionFilters,
  TransactionResponse,
} from '../../../types';
import PartnerService from '../../../services/PartnerService';
import FilterModal from './components/FilterModal';
import TransactionCard from './components/TransactionCard';

// Constants
const DEFAULT_PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 1000;
const ITEM_HEIGHT = 140;
const INITIAL_RENDER_COUNT = 5;
const WINDOW_SIZE = 10;
const END_REACHED_THRESHOLD = 0.5;

// Default filters constant
const DEFAULT_FILTERS: TransactionFilters = {
  pageNumber: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: 'transactionDate',
  sortOrder: 'desc',
};

interface TransactionsScreenState {
  transactions: Transaction[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  filterModalVisible: boolean;
  summary: TransactionResponse['summary'] | null;
  pagination: TransactionResponse['pagination'] | null;
  availableFilters: TransactionResponse['filters'];
  isConnected: boolean;
  hasInitiallyLoaded: boolean;
  filters: TransactionFilters;
}

const TransactionsScreen = ({navigation}: any) => {
  const {t} = useTranslation();
  // State management
  const [state, setState] = useState<TransactionsScreenState>({
    transactions: [],
    isLoading: true,
    isLoadingMore: false,
    isRefreshing: false,
    filterModalVisible: false,
    summary: null,
    pagination: null,
    availableFilters: {
      availableStatuses: [],
      availableMethods: [],
      availablePlans: [],
    },
    isConnected: true,
    hasInitiallyLoaded: false,
    filters: DEFAULT_FILTERS,
  });

  // Refs
  const flatListRef = useRef<FlatList>(null);
  const isMountedRef = useRef(true);
  const lastFetchAttemptRef = useRef<number>(0);
  const networkUnsubscribeRef = useRef<(() => void) | null>(null);

  // Utility function to update state
  const updateState = useCallback(
    (updates: Partial<TransactionsScreenState>) => {
      setState(prevState => ({...prevState, ...updates}));
    },
    [],
  );

  // Network connectivity setup
  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(
      (netInfoState: NetInfoState) => {
        const isConnected = netInfoState.isConnected ?? false;
        updateState({isConnected});

        if (!isConnected) {
          Toast.show({
            type: 'error',
            text1: t('transactions.connectionLost'),
            text2: t('transactions.connectionLostMessage'),
            position: 'top',
          });
        }
      },
    );

    networkUnsubscribeRef.current = unsubscribe;

    // Initial network check
    NetInfo.fetch().then((netInfoState: NetInfoState) => {
      updateState({isConnected: netInfoState.isConnected ?? false});
    });

    return () => {
      if (networkUnsubscribeRef.current) {
        networkUnsubscribeRef.current();
      }
    };
  }, [updateState, t]);

  // Component mount/unmount tracking
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Check network connectivity
  const checkNetworkConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      const netInfoState = await NetInfo.fetch();
      const isConnected = netInfoState.isConnected ?? false;
      updateState({isConnected});
      return isConnected;
    } catch (error) {
      console.error('Error checking network connectivity:', error);
      updateState({isConnected: false});
      return false;
    }
  }, [updateState]);

  // Expose filter modal function for iOS header button
  React.useEffect(() => {
    if (navigation && Platform.OS === 'ios') {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () => (
          <TouchableOpacity
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
            onPress={() => updateState({filterModalVisible: true})}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="Open filters"
            accessibilityRole="button">
            <GetIcon iconName="filter" size={20} color="#fff" />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, updateState]);

  // Show toast notifications
  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', text1: string, text2?: string) => {
      Toast.show({
        type,
        text1,
        text2,
        position: 'top',
        visibilityTime: 4000,
      });
    },
    [],
  );

  // Validate transaction data
  const validateTransaction = useCallback(
    (transaction: any): transaction is Transaction => {
      return (
        transaction != null &&
        typeof transaction === 'object' &&
        transaction.id != null &&
        typeof transaction.id !== 'undefined'
      );
    },
    [],
  );

  // Check if error is network related
  const isNetworkError = useCallback((error: any): boolean => {
    if (!error) {
      return false;
    }

    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message).toLowerCase()
        : '';
    const errorCode =
      typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : '';

    return (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('connection') ||
      errorCode === 'NETWORK_ERROR' ||
      errorCode === 'TIMEOUT'
    );
  }, []);

  // Fetch transactions with improved error handling
  const fetchTransactions = useCallback(
    async (newFilters?: TransactionFilters, loadMore = false) => {
      // Debouncing to prevent rapid calls
      const now = Date.now();
      if (now - lastFetchAttemptRef.current < DEBOUNCE_DELAY) {
        return;
      }
      lastFetchAttemptRef.current = now;

      // Check network connectivity first
      const connected = await checkNetworkConnectivity();
      if (!connected) {
        updateState({
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
        });

        if (!state.hasInitiallyLoaded) {
          showToast(
            'error',
            t('transactions.noInternetConnection'),
            t('transactions.noInternetLoadMessage'),
          );
        }
        return;
      }

      try {
        const currentFilters = newFilters || state.filters;

        if (loadMore) {
          updateState({isLoadingMore: true});
        } else {
          updateState({isLoading: true});
        }

        const response = await PartnerService.getPaymentTransactions(
          currentFilters,
        );

        // Check if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        if (response.success && response.data) {
          const {
            transactions: newTransactions,
            pagination: newPagination,
            summary: newSummary,
            filters: newAvailableFilters,
          } = response.data;

          // Filter out invalid transactions
          const validTransactions = newTransactions.filter(validateTransaction);

          if (validTransactions.length !== newTransactions.length) {
            console.warn(
              `Filtered out ${
                newTransactions.length - validTransactions.length
              } invalid transactions`,
            );
          }

          const updates: Partial<TransactionsScreenState> = {
            pagination: newPagination,
            summary: newSummary,
            availableFilters: newAvailableFilters,
            hasInitiallyLoaded: true,
            isLoading: false,
            isLoadingMore: false,
            isRefreshing: false,
          };

          if (loadMore) {
            updates.transactions = [
              ...state.transactions,
              ...validTransactions,
            ];
          } else {
            updates.transactions = validTransactions;
          }

          updateState(updates);

          // Show success toast for refresh
          if (!loadMore && state.hasInitiallyLoaded) {
            showToast(
              'success',
              t('transactions.dataRefreshed'),
              t('transactions.dataRefreshedMessage'),
            );
          }
        } else {
          updateState({
            isLoading: false,
            isLoadingMore: false,
            isRefreshing: false,
          });

          if (!state.hasInitiallyLoaded) {
            showToast(
              'error',
              t('transactions.failedToLoad'),
              t('transactions.failedToLoadMessage'),
            );
          }

          if (!loadMore && !state.hasInitiallyLoaded) {
            updateState({transactions: []});
          }
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);

        if (!isMountedRef.current) {
          return;
        }

        const networkError = isNetworkError(error);

        updateState({
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
        });

        if (networkError) {
          updateState({isConnected: false});
          if (!state.hasInitiallyLoaded) {
            showToast(
              'error',
              t('transactions.connectionError'),
              t('transactions.connectionErrorMessage'),
            );
          }
        } else {
          if (!state.hasInitiallyLoaded) {
            showToast(
              'error',
              t('transactions.error'),
              t('transactions.errorMessage'),
            );
          } else if (loadMore) {
            showToast(
              'error',
              t('transactions.loadMoreFailed'),
              t('transactions.loadMoreFailedMessage'),
            );
          }
        }

        if (!loadMore && !state.hasInitiallyLoaded) {
          updateState({transactions: []});
        }
      }
    },
    [
      state.filters,
      state.hasInitiallyLoaded,
      state.transactions,
      checkNetworkConnectivity,
      updateState,
      showToast,
      validateTransaction,
      isNetworkError,
      t,
    ],
  );

  // Use ref to avoid dependency issues in useFocusEffect
  const fetchTransactionsRef = useRef(fetchTransactions);
  fetchTransactionsRef.current = fetchTransactions;

  // Focus effect for initial load
  useFocusEffect(
    useCallback(() => {
      if (
        !state.hasInitiallyLoaded ||
        (state.transactions.length === 0 && !state.summary)
      ) {
        fetchTransactionsRef.current();
      }
    }, [state.hasInitiallyLoaded, state.transactions.length, state.summary]),
  );

  // Handle refresh with improved UX
  const handleRefresh = useCallback(async () => {
    const connected = await checkNetworkConnectivity();
    if (!connected) {
      showToast(
        'error',
        t('transactions.noInternetConnection'),
        t('transactions.noInternetLoadMessage'),
      );
      return;
    }

    const refreshFilters = {...state.filters, pageNumber: 1};
    updateState({
      isRefreshing: true,
      transactions: [],
      filters: refreshFilters,
    });
    fetchTransactionsRef.current(refreshFilters);
  }, [state.filters, checkNetworkConnectivity, updateState, showToast, t]);

  // Handle load more with better error handling
  const handleLoadMore = useCallback(async () => {
    if (!state.pagination?.hasNextPage || state.isLoadingMore) {
      return;
    }

    const connected = await checkNetworkConnectivity();
    if (!connected) {
      showToast(
        'info',
        t('transactions.noInternetConnection'),
        t('transactions.noInternetFilterMessage'),
      );
      return;
    }

    const newFilters = {
      ...state.filters,
      pageNumber: (state.filters.pageNumber || 1) + 1,
    };
    updateState({filters: newFilters});
    fetchTransactionsRef.current(newFilters, true);
  }, [
    state.pagination,
    state.isLoadingMore,
    state.filters,
    checkNetworkConnectivity,
    updateState,
    showToast,
    t,
  ]);

  // Handle apply filters
  const handleApplyFilters = useCallback(
    async (newFilters: TransactionFilters) => {
      const connected = await checkNetworkConnectivity();
    if (!connected) {
      showToast(
        'error',
        t('transactions.noInternetConnection'),
        t('transactions.noInternetApplyFiltersMessage'),
      );
      return;
    }      const resetFilters = {...newFilters, pageNumber: 1};
      updateState({
        filters: resetFilters,
        filterModalVisible: false,
        transactions: [],
      });
      fetchTransactionsRef.current(resetFilters);
      flatListRef.current?.scrollToOffset({offset: 0, animated: true});
      showToast(
        'info',
        t('transactions.filtersApplied'),
        t('transactions.filtersAppliedMessage'),
      );
    },
    [checkNetworkConnectivity, updateState, showToast, t],
  );

  // Handle reset filters
  const handleResetFilters = useCallback(() => {
    handleApplyFilters(DEFAULT_FILTERS);
    showToast(
      'info',
      t('transactions.filtersReset'),
      t('transactions.filtersResetMessage'),
    );
  }, [handleApplyFilters, showToast, t]);

  // Handle transaction press
  const handleTransactionPress = useCallback((transaction: Transaction) => {
    console.log('Transaction pressed:', transaction);
    // Add navigation or modal logic here
  }, []);

  // Memoized header component - only for Android
  const headerComponent = useMemo(
    () => {
      if (Platform.OS === 'ios') {
        return null;
      }
      return (
        <Header
          title={t('transactions.title')}
          children={
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => updateState({filterModalVisible: true})}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Open filters"
              accessibilityRole="button">
              <GetIcon iconName="filter" size={20} color="#fff" />
            </TouchableOpacity>
          }
        />
      );
    },
    [updateState, t],
  );

  // Memoized summary component
  const summaryComponent = useMemo(() => {
    if (!state.summary) {
      return null;
    }

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{t('transactions.summary.title')}</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('transactions.summary.total')}</Text>
              <Text style={styles.summaryValue}>
                {state.summary.totalTransactions}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('transactions.summary.successful')}</Text>
              <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
                {state.summary.successfulTransactions}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('transactions.summary.failed')}</Text>
              <Text style={[styles.summaryValue, styles.summaryValueRed]}>
                {state.summary.failedTransactions}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>{t('transactions.summary.totalAmount')}</Text>
              <Text style={[styles.summaryValue, styles.summaryValueGreen]}>
                ₹{(state.summary.totalAmount / 100).toLocaleString('en-IN')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }, [state.summary, t]);

  // Connection status component
  const connectionStatusComponent = useMemo(() => {
    if (state.isConnected) {
      return null;
    }

    return (
      <View style={styles.connectionStatus}>
        <GetIcon iconName="clear" size={16} color="#fff" />
        <Text style={styles.connectionStatusText}>{t('transactions.noInternetConnection')}</Text>
      </View>
    );
  }, [state.isConnected, t]);

  // Empty component with better messaging
  const emptyComponent = useMemo(() => {
    if (!state.hasInitiallyLoaded && !state.isConnected) {
      return (
        <View style={styles.emptyContainer}>
          <GetIcon iconName="clear" size={64} color="#E0E0E0" />
          <Text style={styles.emptyTitle}>{t('transactions.noInternetConnection')}</Text>
          <Text style={styles.emptyMessage}>
            {t('transactions.noInternetLoadMessage')}
          </Text>
        </View>
      );
    }

    const activeFilterCount = Object.entries(state.filters).filter(
      ([key, value]) => {
        if (['pageNumber', 'pageSize', 'sortBy', 'sortOrder'].includes(key)) {
          return false;
        }
        return value && value !== 'all' && value !== '';
      },
    ).length;

    return (
      <View style={styles.emptyContainer}>
        <GetIcon iconName="edit" size={64} color="#E0E0E0" />
        <Text style={styles.emptyTitle}>{t('transactions.noTransactionsFound')}</Text>
        <Text style={styles.emptyMessage}>
          {activeFilterCount > 0
            ? t('transactions.adjustFiltersMessage')
            : t('transactions.noTransactionsFoundMessage')}
        </Text>
        {activeFilterCount > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetFilters}
            activeOpacity={0.8}>
            <Text style={styles.resetButtonText}>{t('common.actions.reset')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [
    state.filters,
    state.hasInitiallyLoaded,
    state.isConnected,
    handleResetFilters,
    t,
  ]);

  // Render transaction item
  const renderTransaction = useCallback(
    ({item}: {item: Transaction}) => {
      if (!validateTransaction(item)) {
        return null;
      }
      return (
        <TransactionCard transaction={item} onPress={handleTransactionPress} />
      );
    },
    [handleTransactionPress, validateTransaction],
  );

  // Key extractor with fallback
  const keyExtractor = useCallback((item: Transaction, index: number) => {
    return item?.id?.toString() || `transaction-${index}`;
  }, []);

  // Footer component for load more
  const footerComponent = useMemo(() => {
    if (!state.isLoadingMore) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.MT_PRIMARY_2} />
        <Text style={styles.footerLoaderText}>{t('transactions.loadingMore')}</Text>
      </View>
    );
  }, [state.isLoadingMore, t]);

  // Loading screen
  if (state.isLoading && state.transactions.length === 0) {
    return (
      <View style={styles.container}>
        {headerComponent}
        {connectionStatusComponent}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.MT_PRIMARY_2} />
          <Text style={styles.loadingText}>{t('transactions.loading')}</Text>
        </View>
        <FilterModal
          visible={state.filterModalVisible}
          filters={state.filters}
          availableStatuses={state.availableFilters.availableStatuses}
          availableMethods={state.availableFilters.availableMethods}
          onApply={handleApplyFilters}
          onClose={() => updateState({filterModalVisible: false})}
          onReset={handleResetFilters}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {headerComponent}
      {connectionStatusComponent}
      {summaryComponent}

      <FlatList
        ref={flatListRef}
        data={state.transactions}
        keyExtractor={keyExtractor}
        renderItem={renderTransaction}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={footerComponent}
        contentContainerStyle={[
          styles.listContainer,
          state.transactions.length === 0 && styles.emptyList,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={state.isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.MT_PRIMARY_2}
            colors={[Colors.MT_PRIMARY_2]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={DEFAULT_PAGE_SIZE}
        windowSize={WINDOW_SIZE}
        initialNumToRender={INITIAL_RENDER_COUNT}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.bottomBarContainer} />

      <FilterModal
        visible={state.filterModalVisible}
        filters={state.filters}
        availableStatuses={state.availableFilters.availableStatuses}
        availableMethods={state.availableFilters.availableMethods}
        onApply={handleApplyFilters}
        onClose={() => updateState({filterModalVisible: false})}
        onReset={handleResetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  connectionStatus: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  connectionStatusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  summaryContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  summaryValueGreen: {
    color: '#4CAF50',
  },
  summaryValueRed: {
    color: '#F44336',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: Colors.MT_PRIMARY_2,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.MT_PRIMARY_2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.MT_PRIMARY_2,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 14,
    color: '#666',
  },
  bottomBarContainer: {
    height: 70,
  },
});

export default TransactionsScreen;
