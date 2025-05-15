import React, {useState, useMemo} from 'react';
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
import {useTheme} from '../../../context/ThemeProvider';
import {getGradientColors} from '../../../utils/colorUtils';
import {Client} from '../../../types';
import {useMaster} from '../../../context/MasterProvider';
import AddActivityModal from './components/AddActivityModal';
import Toast from 'react-native-toast-message';
import {usePartner} from '../../../context/PartnerProvider';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import GetIcon from '../../../components/GetIcon';

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
    handleSort,
    sortDirection,
  } = useClientData();
  const [isSearching, setIsSearching] = useState(false);
  const {theme} = useTheme();
  const {masterData} = useMaster();
  const {setClientsUpdated} = usePartner();
  const {user} = useAuth();

  // Activity modal states
  const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [preSelectedActivityType, setPreSelectedActivityType] = useState<
    number | null
  >(null);
  const [addingActivity, setAddingActivity] = useState(false);

  // Create gradient colors from theme using the same utility function as EmailScreen
  const headerGradientColors = useMemo(() => {
    return getGradientColors(theme.primaryColor);
  }, [theme.primaryColor]);

  const handleSearchWithLoading = async (text: string) => {
    setIsSearching(true);
    await handleSearch(text);
    setIsSearching(false);
  };

  // Helper function to get activity type ID by name - same as ClientProfileScreen
  const getActivityTypeIdByName = (activityTypeName: string): number | null => {
    if (!masterData?.ActivityType) {
      return null;
    }

    const activityType = masterData.ActivityType.find(
      type => type.masterDetailName === activityTypeName,
    );

    return activityType?.id || null;
  };

  // Handle contact actions (phone/whatsapp)
  const handleContactPress = (type: 'phone' | 'whatsapp', client: Client) => {
    // Set a timeout to show the activity modal after a brief delay (same as ClientProfileScreen)
    setTimeout(() => {
      setSelectedClient(client);

      // Set the appropriate activity type based on contact type
      if (type === 'phone') {
        const phoneCallActivityTypeId = getActivityTypeIdByName('Phone Call');
        setPreSelectedActivityType(phoneCallActivityTypeId);
      } else if (type === 'whatsapp') {
        const whatsappActivityTypeId =
          getActivityTypeIdByName('Whatsapp Message');
        setPreSelectedActivityType(whatsappActivityTypeId);
      }

      // Show the activity modal
      setIsActivityModalVisible(true);
    }, 500); // 500ms delay
  };

  // Handle activity modal submission
  const handleAddActivity = async (
    type: number,
    description: string,
    clientId: number,
  ) => {
    setAddingActivity(true);

    try {
      // Here you would make the API call to add the activity
      // Example:
      await PartnerService.addEditClientActivity(
        type,
        clientId,
        description,
        user?.email as string,
      );

      // Update UI
      setClientsUpdated(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Activity added successfully',
      });

      // Close modal and reset state
      setIsActivityModalVisible(false);
      setSelectedClient(null);
      setPreSelectedActivityType(null);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add activity',
      });
    } finally {
      setAddingActivity(false);
    }
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
          <ClientCard
            client={item}
            navigation={navigation}
            onContactPress={handleContactPress}
          />
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
            <Text style={styles.pullToRefreshHint}>Pull down to refresh</Text>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Clients"
        gradientColors={headerGradientColors}
        compact={true}>
        <TouchableOpacity
          style={[styles.addButton, {backgroundColor: theme.secondaryColor}]}
          onPress={() => {
            navigation.navigate('AddClientScreen', {editMode: false});
          }}>
          <Text style={styles.buttonText}>Add Client</Text>
        </TouchableOpacity>
      </Header>

      {/* Search and sort row */}
      <View style={styles.searchSortContainer}>
        <View style={styles.searchContainer}>
          <SearchHeader
            placeholder="Search Clients..."
            onSearch={handleSearchWithLoading}
          />
        </View>
        <TouchableOpacity
          style={[styles.sortButton, {backgroundColor: theme.secondaryColor}]}
          onPress={handleSort}>
          {sortDirection === 'asc' ? (
            <GetIcon iconName="descending" color="#fff" />
          ) : (
            <GetIcon iconName="ascending" color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {renderContent()}

      {/* Activity Modal */}
      {selectedClient && (
        <AddActivityModal
          visible={isActivityModalVisible}
          onClose={() => {
            setIsActivityModalVisible(false);
            setSelectedClient(null);
            setPreSelectedActivityType(null);
          }}
          onSubmit={(type, description) => {
            handleAddActivity(type, description, selectedClient.id);
          }}
          isLoading={addingActivity}
          initialActivityType={preSelectedActivityType}
        />
      )}
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
    // marginRight: 12,
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
  searchSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    paddingTop: 10,
  },
  sortButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

export default ClientScreen;
