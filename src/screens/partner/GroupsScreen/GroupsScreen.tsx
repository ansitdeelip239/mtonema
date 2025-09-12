import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Header from '../../../components/Header';
import { PartnerDrawerParamList } from '../../../types/navigation';
import Colors from '../../../constants/Colors';
import { Group2 } from '../../../types';
import PartnerService from '../../../services/PartnerService';
import { useMaster } from '../../../context/MasterProvider';
import AddGroupModal from './components/AddGroupModal';
import Toast from 'react-native-toast-message';
import { usePartner } from '../../../context/PartnerProvider';
import { useTheme } from '../../../context/ThemeProvider';
import { t } from 'i18next';
import { useAuth } from '../../../context/AuthProvider';

// Updated EmptyList component to use theme and translation
const EmptyList = memo(
  ({ isLoading, themeColor }: { isLoading: boolean; themeColor: string }) => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={themeColor} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t('groups.messages.noGroupsAvailable', { defaultValue: 'No groups available' })}
        </Text>
      </View>
    );
  },
);

// GroupItem stays the same
const GroupItem = memo(
  ({
    item,
    getColorByMasterId,
    onPress,
  }: {
    item: Group2;
    getColorByMasterId: (id?: number) => string;
    onPress: (group: Group2) => void;
  }) => (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.groupItem}>
      <View
        style={[
          styles.colorIndicator,
          {
            backgroundColor:
              item.color && item.color.id
                ? getColorByMasterId(item.color.id)
                : '#cccccc',
          },
        ]}
      />
      <Text style={styles.groupName}>{item.groupName}</Text>
    </TouchableOpacity>
  ),
);

type Props = DrawerScreenProps<PartnerDrawerParamList, 'Groups'>;

const GroupsScreen = ({ navigation }: Props) => {
  // Get theme from context
  const { theme } = useTheme();

  const [groups, setGroups] = useState<Group2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group2 | null>(null);

  // New pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageSize] = useState(20);

  const { user } = useAuth();
  const { masterData } = useMaster();
  const { reloadGroups, setClientsUpdated } = usePartner();

  // Fetch groups
  const fetchGroups = useCallback(
    async (page = 1, shouldAppend = false) => {
      if (!user?.email) {
        return;
      }

      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await PartnerService.getGroupsByEmail(
          user.email,
          page,
          pageSize,
        );

        if (response?.data) {
          const newGroups = response.data.groups || [];
          const paging = response.data.responsePagingModel;

          // Update pagination state
          setTotalPages(paging?.totalPage || 1);

          // Update groups list
          if (shouldAppend) {
            setGroups(prevGroups => [...prevGroups, ...newGroups]);
          } else {
            setGroups(newGroups);
          }
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        Toast.show({
          type: 'error',
          text1: t('groups.messages.loadFailed', { defaultValue: 'Failed to load groups' }),
          text2: t('groups.messages.tryAgainLater', { defaultValue: 'Please try again later' }),
        });
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [user?.email, pageSize],
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchGroups(1, false);
    setRefreshing(false);
  }, [fetchGroups]);

  // Handle loading more when reaching the end of the list
  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchGroups(nextPage, true);
    }
  }, [currentPage, totalPages, fetchGroups, isLoading, isLoadingMore]);

  // Footer component for the FlatList to show loading indicator
  const renderFooter = useCallback(() => {
    if (!isLoadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primaryColor} />
        <Text style={styles.loadingMoreText}>{t('common.states.loadingMore', { defaultValue: 'Loading more...' })}</Text>
      </View>
    );
  }, [isLoadingMore, theme.primaryColor]);

  // Handle group operations - now handles both add and edit
  const handleSaveGroup = useCallback(
    async (groupName: string, colorId: number, groupId?: number) => {
      if (!groupName.trim() || !user?.email) {
        return;
      }

      try {
        setIsSaving(true);
        let response;

        if (groupId) {
          // Update existing group
          response = await PartnerService.createGroup(
            groupName.trim(),
            colorId,
            user.email,
            groupId,
          );
        } else {
          // Create new group
          response = await PartnerService.createGroup(
            groupName.trim(),
            colorId,
            user.email,
          );
        }

        if (response.success) {
          // Reset to first page after adding/editing a group
          setCurrentPage(1);
          await fetchGroups(1, false);
          setModalVisible(false); // Close the modal after successful save
          setSelectedGroup(null);
          Toast.show({
            type: 'success',
            text1: groupId ? t('groups.messages.groupUpdated', { defaultValue: 'Group updated successfully' }) : t('groups.messages.groupCreated', { defaultValue: 'Group created successfully' }),
          });
          reloadGroups();
        } else {
          Toast.show({
            type: 'error',
            text1: t('groups.messages.saveFailed', { defaultValue: 'Failed to save group' }),
          });
        }
      } catch (error) {
        console.error('Error saving group:', error);
        Toast.show({
          type: 'error',
          text1: t('groups.messages.saveError', { defaultValue: 'Error saving group' }),
          text2: (error as Error).message,
        });
      } finally {
        setIsSaving(false); // Reset saving state
      }
    },
    [user?.email, fetchGroups, reloadGroups],
  );

  // Handle deleting a group
  const handleDeleteGroup = useCallback(
    async (groupId: number) => {
      try {
        setIsDeleting(true);
        const response = await PartnerService.deleteGroup(groupId);

        if (response.success) {
          // Reset to first page after deletion
          setCurrentPage(1);
          await fetchGroups(1, false);
          setModalVisible(false);
          setSelectedGroup(null);
          Toast.show({
            type: 'success',
            text1: t('groups.messages.groupDeleted', { defaultValue: 'Group deleted successfully' }),
          });
          reloadGroups();
          setClientsUpdated(prev => !prev);
        } else {
          Toast.show({
            type: 'error',
            text1: response.message || t('groups.messages.deleteFailed', { defaultValue: 'Failed to delete group' }),
          });
        }
      } catch (error) {
        console.error('Error deleting group:', error);
        Toast.show({
          type: 'error',
          text1: t('groups.messages.deleteError', { defaultValue: 'Error deleting group' }),
          text2: (error as Error).message,
        });
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchGroups, reloadGroups, setClientsUpdated],
  );

  // Handle group item press
  const handleGroupPress = useCallback((group: Group2) => {
    setSelectedGroup(group);
    setModalVisible(true);
  }, []);

  // Toggle modal visibility
  const toggleModal = useCallback(() => {
    if (!isSaving && !isDeleting) {
      setSelectedGroup(null); // Clear selected group when opening modal for add
      setModalVisible(prev => !prev);
    }
  }, [isSaving, isDeleting]);

  // Close modal
  const closeModal = useCallback(() => {
    if (!isSaving && !isDeleting) {
      setModalVisible(false);
      setSelectedGroup(null);
    }
  }, [isSaving, isDeleting]);

  // Set header options for iOS
  useEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={[styles.headerAddButton, { backgroundColor: theme.secondaryColor }]}
            onPress={toggleModal}
            disabled={isSaving || isDeleting}>
            <Text style={styles.headerAddButtonText}>+</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, toggleModal, theme.secondaryColor, isSaving, isDeleting]);

  // Get color by master ID
  const getColorByMasterId = useCallback(
    (colorId?: number) => {
      if (!colorId || !masterData?.GroupColor) {
        return '#cccccc';
      }

      const color = masterData.GroupColor.find((c: any) => c.id === colorId);
      return color ? color.masterDetailName : '#cccccc';
    },
    [masterData?.GroupColor],
  );

  // Render a group item
  const renderGroupItem = useCallback(
    ({ item }: { item: Group2 }) => (
      <GroupItem
        item={item}
        getColorByMasterId={getColorByMasterId}
        onPress={handleGroupPress}
      />
    ),
    [getColorByMasterId, handleGroupPress],
  );

  // Initial fetch
  useEffect(() => {
    fetchGroups(1, false);
  }, [fetchGroups]);

  // Keyextractor for FlatList
  const keyExtractor = useCallback((item: Group2) => item.id.toString(), []);

  // Render empty list with theme color
  const renderEmptyList = useCallback(
    () => <EmptyList isLoading={isLoading} themeColor={theme.primaryColor} />,
    [isLoading, theme.primaryColor],
  );

  const Container = Platform.OS === 'ios' ? View : SafeAreaView;

  return (
    <Container style={styles.container}>
      {
        Platform.OS === 'android' && (
          <Header<PartnerDrawerParamList>
            title={t('navigation.groups', { defaultValue: 'Groups' })}
            children={
              <TouchableOpacity
                onPress={toggleModal}
                style={[styles.addButton, { backgroundColor: theme.secondaryColor }]} // Updated with theme
                disabled={isSaving || isDeleting}>
                <Text style={styles.addButtonText}>{t('groups.buttons.addGroup', { defaultValue: 'Add Group' })}</Text>
              </TouchableOpacity>
            }
          />

        )
      }

      <View style={styles.content}>
        <FlatList
          data={groups}
          keyExtractor={keyExtractor}
          renderItem={renderGroupItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primaryColor]} // Updated with theme
              tintColor={theme.primaryColor} // Updated with theme
            />
          }
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
        />
      </View>

      <AddGroupModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={handleSaveGroup}
        onDelete={handleDeleteGroup}
        styles={{
          ...styles,
          saveButton: {
            ...styles.saveButton,
            backgroundColor: theme.primaryColor, // Updated with theme
          },
        }}
        isLoading={isSaving}
        isDeleting={isDeleting}
        group={selectedGroup}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  // Most styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 24,
  },
  groupItem: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  groupMemberCount: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    // backgroundColor is applied dynamically now
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  headerAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerAddButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444444',
  },
  saveButton: {
    // backgroundColor is applied dynamically now
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.white,
  },
  // Add this new style for footer loader
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default GroupsScreen;
