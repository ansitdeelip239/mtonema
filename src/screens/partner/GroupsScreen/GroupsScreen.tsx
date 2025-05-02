import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import Colors from '../../../constants/Colors';
import {Group2} from '../../../types';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {useMaster} from '../../../context/MasterProvider';
import AddGroupModal from './components/AddGroupModal';
import Toast from 'react-native-toast-message';
import {usePartner} from '../../../context/PartnerProvider';
import {useTheme} from '../../../context/ThemeProvider'; // Added theme import

// Updated EmptyList component to use theme
const EmptyList = memo(
  ({isLoading, themeColor}: {isLoading: boolean; themeColor: string}) => {
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
          No groups available. Groups will appear here when created.
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
          // eslint-disable-next-line react-native/no-inline-styles
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

const GroupsScreen = () => {
  // Get theme from context
  const {theme} = useTheme();

  const [groups, setGroups] = useState<Group2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group2 | null>(null);
  const {user} = useAuth();
  const {masterData} = useMaster();
  const {reloadGroups} = usePartner();

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    if (!user?.email) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await PartnerService.getGroupsByEmail(user.email);
      if (response?.data) {
        setGroups(response.data.groups || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  }, [fetchGroups]);

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
          await fetchGroups(); // Refresh the list
          setModalVisible(false); // Close the modal after successful save
          setSelectedGroup(null);
          Toast.show({
            type: 'success',
            text1: groupId ? 'Group updated successfully' : response.message,
          });
          reloadGroups();
        } else {
          Toast.show({
            type: 'error',
            text1: response.message || 'Failed to save group',
          });
        }
      } catch (error) {
        console.error('Error saving group:', error);
        Toast.show({
          type: 'error',
          text1: 'Error saving group',
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
          await fetchGroups();
          setModalVisible(false);
          setSelectedGroup(null);
          Toast.show({
            type: 'success',
            text1: 'Group deleted successfully',
          });
          reloadGroups();
        } else {
          Toast.show({
            type: 'error',
            text1: response.message || 'Failed to delete group',
          });
        }
      } catch (error) {
        console.error('Error deleting group:', error);
        Toast.show({
          type: 'error',
          text1: 'Error deleting group',
          text2: (error as Error).message,
        });
      } finally {
        setIsDeleting(false);
      }
    },
    [fetchGroups, reloadGroups],
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
    ({item}: {item: Group2}) => (
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
    fetchGroups();
  }, [fetchGroups]);

  // Keyextractor for FlatList
  const keyExtractor = useCallback((item: Group2) => item.id.toString(), []);

  // Render empty list with theme color
  const renderEmptyList = useCallback(
    () => <EmptyList isLoading={isLoading} themeColor={theme.primaryColor} />,
    [isLoading, theme.primaryColor],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Groups"
        children={
          <TouchableOpacity
            onPress={toggleModal}
            style={[styles.addButton, {backgroundColor: theme.secondaryColor}]} // Updated with theme
            disabled={isSaving || isDeleting}>
            <Text style={styles.addButtonText}>+ Add Group</Text>
          </TouchableOpacity>
        }
      />

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
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
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
    </SafeAreaView>
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
    shadowOffset: {width: 0, height: 1},
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
    shadowOffset: {width: 0, height: 1},
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
});

export default GroupsScreen;
