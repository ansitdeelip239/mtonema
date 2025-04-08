import React, {useEffect, useState, useCallback} from 'react';
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

const GroupsScreen = () => {
  const [groups, setGroups] = useState<Group2[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {user} = useAuth();
  const {masterData} = useMaster();

  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await PartnerService.getGroupsByEmail(
        user?.email as string,
      );
      if (response) {
        setGroups(response.data.groups || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  };

  const handleAddGroup = async (groupName: string, colorId: number) => {
    if (!groupName.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await PartnerService.createGroup(
        groupName.trim(),
        colorId,
        user?.email as string,
      );

      if (response && response.data) {
        await fetchGroups();
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user?.email, fetchGroups]);

  const getColorByMasterId = (colorId?: number) => {
    if (!colorId || !masterData?.GroupColor) {
      return '#cccccc';
    }

    const color = masterData.GroupColor.find((c: any) => c.id === colorId);
    return color ? color.masterDetailName : '#cccccc';
  };

  const renderGroupItem = ({item}: {item: Group2}) => (
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
  );

  const renderEmptyList = () => {
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header<PartnerDrawerParamList>
        title="Groups"
        children={
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <FlatList
          data={groups}
          keyExtractor={item => item.id.toString()}
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
        />
      </View>

      <AddGroupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddGroup}
        styles={styles}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
