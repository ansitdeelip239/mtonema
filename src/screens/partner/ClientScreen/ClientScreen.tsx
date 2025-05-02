import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {PartnerDrawerParamList} from '../../../types/navigation';
import Header from '../../../components/Header';
import {useClientData} from '../../../hooks/useClientData';
import {ClientCard} from './components/ClientCard';
import Colors from '../../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import SearchHeader from '../../../components/SearchHeader';
import { useTheme } from '../../../context/ThemeProvider';

type Props = NativeStackScreenProps<ClientStackParamList, 'ClientScreen'>;

const ClientScreen: React.FC<Props> = ({navigation}) => {
  const {
    clients,
    isLoading,
    isLoadingMore,
    error,
    refreshing,
    onRefresh,
    handleSearch,
    loadMoreClients,
  } = useClientData();
  const [isSearching, setIsSearching] = useState(false);
  const {theme} = useTheme();

  const handleSearchWithLoading = async (text: string) => {
    setIsSearching(true);
    await handleSearch(text);
    setIsSearching(false);
  };

  // Update renderFooter to use isLoadingMore instead of isLoading
  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0066cc" />
        <Text style={styles.loadingMoreText}>Loading more clients...</Text>
      </View>
    );
  };

  const renderContent = () => {
    // Only show full-page loader on initial load or search, not during pagination
    if ((isLoading && clients.length === 0) || isSearching) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
        </View>
      );
    }

    if (error && error !== 'Failed to fetch clients') {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={clients}
        renderItem={({item}) => (
          <ClientCard client={item} navigation={navigation} />
        )}
        keyExtractor={client => client.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          clients.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primaryColor]}
            tintColor={theme.primaryColor}
          />
        }
        onEndReached={loadMoreClients}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyText}>No Clients Found</Text>
            <Text style={styles.pullToRefreshHint}>
              Pull down to refresh
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Clients">
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: theme.secondaryColor}]}
          onPress={() => {
            navigation.navigate('AddClientScreen', {editMode: false});
          }}>
          <Text style={styles.buttonText}>Add Client</Text>
        </TouchableOpacity>
      </Header>
      <SearchHeader
        placeholder="Search Clients..."
        onSearch={handleSearchWithLoading}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    margin: 16,
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
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
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 5,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchInputText: {
    color: Colors.placeholderColor,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300, // Ensure there's enough space to enable pull-to-refresh
  },
  pullToRefreshHint: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ClientScreen;
