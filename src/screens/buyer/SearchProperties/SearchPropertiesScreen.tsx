import React, {useMemo, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ListRenderItem,
  ActivityIndicator,
} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BuyerBottomTabParamList} from '../../../types/navigation';
import {Property} from '../../../types';
import {
  PropertyCard,
  FilterModal,
  PropertyTypeToggle,
  SortModal,
  PropertyDetailModal,
} from './components';
import {searchPropertiesStyles as styles} from './styles';
import {SortBy} from '../../../constants/MasterDetails';
import Colors from '../../../constants/Colors';
import SearchHeader from './components/SearchHeader';
import BuyerSellerHeader from '../../../components/BuyerSellerHeader';
import {useSearchProperties} from './hooks/useSearchProperties';
import {useAuth} from '../../../context/AuthProvider';
import BuyerService from '../../../services/BuyerService';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';

type Props = NativeStackScreenProps<BuyerBottomTabParamList, 'Search Property'>;

const EmptyComponent = ({isLoading}: {isLoading: boolean}) => {
  const {t} = useTranslation();
  if (isLoading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingEmptyText}>{t('searchProperties.messages.loadingProperties')}</Text>
      </View>
    );
  }
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('searchProperties.messages.noProperties')}</Text>
    </View>
  );
};

const FooterComponent = () => <View style={styles.bottomSpacing} />;

const Separator = () => <View style={styles.separator} />;

const LoadingFooter = () => {
  const {t} = useTranslation();
  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator size="small" color={Colors.primary} />
      <Text style={styles.loadingMoreText}>{t('searchProperties.messages.loadingMore')}</Text>
    </View>
  );
};

const SearchPropertiesScreen: React.FC<Props> = ({navigation: _navigation}) => {
  const {user} = useAuth();
  const {t} = useTranslation();

  const {
    showFilters,
    setShowFilters,
    showSortModal,
    setShowSortModal,
    propertyForFilter,
    setPropertyForFilterAndResetPage,
    refreshing,
    allProperties,
    isLoading,
    totalCount,
    searchParams,
    currentFilters,
    handleSearchWithLoading,
    applyFilters,
    clearFilters,
    handleSortPress,
    handleSortSelect,
    getSortDisplayText,
    handlePropertyPress,
    handleRefresh,
    handleLoadMore,
    isLoadingMore,
    selectedProperty,
    showPropertyModal,
    handleClosePropertyModal,
  } = useSearchProperties();

  // Handle enquiry for a property
  const handleEnquiry = useCallback(
    async (property: Property, setLoading?: (loading: boolean) => void) => {
      if (!user) {
        Toast.show({
          type: 'error',
          text1: t('searchProperties.messages.loginRequired'),
        });
        return;
      }

      try {
        setLoading?.(true);

        const response = await BuyerService.contactProperty(
          user.id,
          property.propertyId,
        );

        if (response?.success) {
          Toast.show({
            type: 'success',
            text1: t('searchProperties.messages.enquirySuccess'),
            text2: t('searchProperties.messages.enquirySuccessSub'),
          });
          handleClosePropertyModal();
        } else {
          throw new Error(t('searchProperties.messages.enquiryFailed'));
        }
      } catch (error) {
        console.error('Enquiry error:', error);
        Toast.show({
          type: 'error',
          text1: t('searchProperties.messages.enquiryError'),
          text2: t('searchProperties.messages.enquiryErrorSub'),
        });
      } finally {
        setLoading?.(false);
      }
    },
    [user, handleClosePropertyModal, t],
  );
  const renderFooter = () => {
    if (isLoadingMore) {
      return <LoadingFooter />;
    }
    return <FooterComponent />;
  };

  const renderHeader = useMemo(() => {
    return (
      <View>
        {/* Buyer Header */}
        <BuyerSellerHeader
          title={t('searchProperties.header.title')}
          subtitle={t('searchProperties.header.subtitle')}
        />

        {/* Search Bar */}
        <SearchHeader
          placeholder={t('searchProperties.search.placeholder')}
          onSearch={handleSearchWithLoading}
          onFilterPress={() => setShowFilters(true)}
        />

        {/* Property Type Toggle */}
        <PropertyTypeToggle
          propertyForFilter={propertyForFilter}
          onFilterChange={setPropertyForFilterAndResetPage}
        />

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {isLoading || refreshing
              ? t('searchProperties.messages.loadingProperties')
              : t('searchProperties.messages.propertiesCount', { count: totalCount })}
          </Text>
          <TouchableOpacity style={styles.sortButton} onPress={handleSortPress}>
            <Text style={styles.sortButtonText}>
              {getSortDisplayText(searchParams.sortBy || SortBy.NEWEST)}
            </Text>
            <GetIcon iconName="filterFunnel" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    propertyForFilter,
    isLoading,
    refreshing,
    totalCount,
    searchParams.sortBy,
    handleSortPress,
    getSortDisplayText,
    handleSearchWithLoading,
    setPropertyForFilterAndResetPage,
    setShowFilters,
    t,
  ]);

  const renderPropertyItem: ListRenderItem<Property> = ({item}) => (
    <View style={styles.propertyCardContainer}>
      <PropertyCard property={item} onPress={handlePropertyPress} />
    </View>
  );

  const renderEmptyComponent = useMemo(() => {
    return <EmptyComponent isLoading={isLoading} />;
  }, [isLoading]);

  return (
    <>
      <FlatList
        data={allProperties}
        renderItem={renderPropertyItem}
        keyExtractor={item => item.propertyId.toString()}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={Separator}
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        currentFilters={currentFilters}
      />
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSelectSort={handleSortSelect}
        currentSort={searchParams.sortBy || SortBy.NEWEST}
      />
      <PropertyDetailModal
        visible={showPropertyModal}
        property={selectedProperty}
        onClose={handleClosePropertyModal}
        onEnquiry={handleEnquiry}
      />
    </>
  );
};

export default SearchPropertiesScreen;
