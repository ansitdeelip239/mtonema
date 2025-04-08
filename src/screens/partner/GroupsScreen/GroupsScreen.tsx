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

// Memoized GroupItem component
const GroupItem = memo(
  ({
    item,
    getColorByMasterId,
  }: {
    item: Group2;
    getColorByMasterId: (id?: number) => string;
  }) => (
    <View style={styles.groupItem}>
      <View
        style={[
          styles.colorIndicator,
          {
            backgroundColor: item.color?.id
              ? getColorByMasterId(item.color.id)
              : '#cccccc',
          },
        ]}
      />
      <Text style={styles.groupName}>{item.groupName}</Text>
    </View>
  ),
);

// Memoized EmptyList component
const EmptyList = memo(({isLoading}: {isLoading: boolean}) => {
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.main} />
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
});

const GroupsScreen = () => {
  const [groups, setGroups] = useState<Group2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const {user} = useAuth();
  const {masterData} = useMaster();

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

  // Handle adding a new group
  const handleAddGroup = useCallback(
    async (groupName: string, colorId: number) => {
      if (!groupName.trim() || !user?.email) {
        return;
      }

      try {
        setIsSaving(true); // Set saving state to true
        const response = await PartnerService.createGroup(
          groupName.trim(),
          colorId,
          user.email,
        );

        if (response.success) {
          await fetchGroups(); // Refresh the list
          setModalVisible(false); // Close the modal after successful save
          Toast.show({
            type: 'success',
            text1: response.message,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: response.message || 'Failed to create group',
          });
        }
      } catch (error) {
        console.error('Error creating group:', error);
        Toast.show({
          type: 'error',
          text1: 'Error creating group',
          text2: (error as Error).message,
        });
      } finally {
        setIsSaving(false); // Reset saving state
      }
    },
    [user?.email, fetchGroups],
  );

  // Toggle modal visibility
  const toggleModal = useCallback(() => {
    if (!isSaving) {
      // Only toggle if not currently saving
      setModalVisible(prev => !prev);
    }
  }, [isSaving]);

  // Close modal
  const closeModal = useCallback(() => {
    if (!isSaving) {
      // Only close if not currently saving
      setModalVisible(false);
    }
  }, [isSaving]);

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
      <GroupItem item={item} getColorByMasterId={getColorByMasterId} />
    ),
    [getColorByMasterId],
  );

  // Initial fetch
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Keyextractor for FlatList
  const keyExtractor = useCallback((item: Group2) => item.id.toString(), []);

  // Render empty list
  const renderEmptyList = useCallback(
    () => <EmptyList isLoading={isLoading} />,
    [isLoading],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Groups"
        children={
          <TouchableOpacity
            onPress={toggleModal}
            style={styles.addButton}
            disabled={isSaving}>
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
              colors={[Colors.main]}
              tintColor={Colors.main}
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
        onSave={handleAddGroup}
        styles={styles}
        isLoading={isSaving}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styles remain the same
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
    backgroundColor: Colors.main,
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
    backgroundColor: Colors.main,
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.white,
  },
});

export default GroupsScreen;
