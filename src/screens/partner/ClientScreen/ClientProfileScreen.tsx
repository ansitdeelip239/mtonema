import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import {Client, ClientActivityDataModel, FollowUp} from '../../../types';
import PartnerService from '../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import GetIcon from '../../../components/GetIcon';
import {usePartner} from '../../../context/PartnerProvider';
import {Appbar, Menu} from 'react-native-paper';
import AddActivityModal from './components/AddActivityModal';
import {useKeyboard} from '../../../hooks/useKeyboard';
import {useAuth} from '../../../hooks/useAuth';
import {useDialog} from '../../../hooks/useDialog';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ScheduleFollowUpModal from './components/ScheduleFollowUpModal';

import ProfileHeader from './components/ProfileHeader';
import ContactButtons from './components/ContactButtons';
import FollowUpCard from './components/FollowUpCard';
import ContactInfoCard from './components/ContactInfoCard';
import GroupsCard from './components/GroupsCard';
import NotesCard from './components/NotesCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';
import AssignedUsersCard from './components/AssignedUsersCard';
import {useMaster} from '../../../context/MasterProvider';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'ClientProfileScreen'
>;

const ClientProfileScreen: React.FC<Props> = ({route, navigation}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [assignedUsersLoading, setAssignedUsersLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
  const [addingActivity, setAddingActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<
    ClientActivityDataModel | undefined
  >();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
  const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);
  const [preSelectedActivityType, setPreSelectedActivityType] = useState<
    number | null
  >(null);
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);

  const {clientsUpdated, setClientsUpdated} = usePartner();
  const {keyboardVisible} = useKeyboard();
  const {user} = useAuth();
  const {showError} = useDialog();
  // Get activity type master data
  const {masterData} = useMaster();

  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PartnerService.getClientById(
        route.params.clientId,
      );
      if (response.success) {
        setClient(response.data);
      }
    } catch (error) {
      console.error('Error in fetchClient', error);
      showError('Failed to fetch client data');
      navigation.goBack();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    try {
      setFollowUpLoading(true);
      const response = await PartnerService.getFollowUpDate(
        route.params.clientId,
      );
      if (response.success) {
        setClient(prevClient =>
          prevClient
            ? {
                ...prevClient,
                followUp: response.data.followUp as FollowUp,
              }
            : null,
        );
      }
    } catch (error) {
      showError('Failed to fetch follow-up date');
    } finally {
      setFollowUpLoading(false);
    }
  }, [route.params.clientId, navigation, showError]);

  const fetchAssignedUsers = useCallback(async () => {
    try {
      setAssignedUsersLoading(true);
      const response = await PartnerService.getAssignedUsers(
        route.params.clientId,
      );
      if (response.success) {
        setAssignedUsers(response.data);
      } else {
        setAssignedUsers([]);
      }
    } catch (error) {
      console.error('Error in fetchAssignedUsers', error);
      showError('Failed to fetch assigned users');
    } finally {
      setAssignedUsersLoading(false);
    }
  }, [route.params.clientId, showError]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient, clientsUpdated]);

  useEffect(() => {
    fetchAssignedUsers();
  }, [fetchAssignedUsers, clientsUpdated]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchClient();
    fetchAssignedUsers();
  }, [fetchClient, fetchAssignedUsers]);

  // Helper function to get activity type ID by name
  const getActivityTypeIdByName = useCallback(
    (activityTypeName: string): number | null => {
      if (!masterData?.ActivityType) {
        return null;
      }

      const activityType = masterData.ActivityType.find(
        type => type.masterDetailName === activityTypeName,
      );

      return activityType?.id || null;
    },
    [masterData?.ActivityType],
  );

  const handleContact = React.useCallback(
    (type: 'phone' | 'whatsapp' | 'email') => {
      if (!client) {
        return;
      }

      // Map contact types to activity type names
      const activityTypeNameMap: Record<string, string> = {
        phone: 'Phone Call',
        whatsapp: 'Whatsapp Message',
        email: 'Notes',
      };

      switch (type) {
        case 'phone':
          Linking.openURL(`tel:${client.mobileNumber}`);
          break;
        case 'whatsapp':
          Linking.openURL(
            `https://api.whatsapp.com/send?phone=${client.whatsappNumber}`,
          );
          break;
        case 'email':
          Linking.openURL(`mailto:${client.emailId}`);
          break;
      }

      // After a delay, open activity modal with pre-selected type
      // Only for phone and whatsapp (not email)
      if (
        (type === 'phone' || type === 'whatsapp') &&
        activityTypeNameMap[type]
      ) {
        setTimeout(() => {
          const activityTypeId = getActivityTypeIdByName(
            activityTypeNameMap[type],
          );
          if (activityTypeId) {
            setPreSelectedActivityType(activityTypeId);
            setIsActivityModalVisible(true);
          }
        }, 1000); // 3 seconds delay
      }
    },
    [client, getActivityTypeIdByName],
  );

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const closeActivityModal = () => setIsActivityModalVisible(false);

  const handleDelete = async () => {
    closeMenu();
    setIsDeleteModalVisible(true);
  };

  const handleDeleteActivity = async (activityId: number) => {
    try {
      setIsDeletingActivity(true);
      const response = await PartnerService.deleteClientActivity(activityId);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Activity deleted successfully',
        });
        await fetchClient();
        setClientsUpdated(prev => !prev);
      }
    } catch (error) {
      console.error('Error in handleDeleteActivity', error);
      showError('Failed to delete activity');
    } finally {
      setIsDeletingActivity(false);
    }
  };

  const handleActivityPress = (activity: ClientActivityDataModel) => {
    setSelectedActivity(activity);
    setIsActivityModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await PartnerService.deleteClientById(
        client?.id as number,
      );
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Client deleted successfully',
        });
        setClientsUpdated(prev => !prev);
        navigation.goBack();
      } else {
        showError('Failed to delete client');
      }
    } catch (error) {
      console.error('Error in handleDelete', error);
      showError('Failed to delete client');
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const handleAddEditActivity = async (
    type: number,
    description: string,
    activityId?: number,
  ) => {
    try {
      setAddingActivity(true);

      // First, add or edit the activity
      const response = await PartnerService.addEditClientActivity(
        type,
        route.params.clientId,
        description,
        user?.email as string,
        activityId,
      );

      if (response.success) {
        // Only process follow-ups for new activities (not edits)
        if (!activityId && client?.followUp?.status === 'Pending') {
          // Check if follow-up is scheduled for today
          const isFollowUpToday = () => {
            if (!client.followUp?.date) {
              return false;
            }

            const followUpDate = new Date(client.followUp.date);
            const today = new Date();

            return (
              followUpDate.getDate() === today.getDate() &&
              followUpDate.getMonth() === today.getMonth() &&
              followUpDate.getFullYear() === today.getFullYear()
            );
          };

          if (isFollowUpToday()) {
            // Reschedule follow-up for 3 days later
            try {
              // Create a new date 3 days in the future
              const newFollowUpDate = new Date();
              newFollowUpDate.setDate(newFollowUpDate.getDate() + 3);

              // Ensure the time is set to a reasonable hour (e.g., 10:00 AM)
              newFollowUpDate.setHours(10, 0, 0, 0);

              // Format the date for the API
              const year = newFollowUpDate.getFullYear();
              const month = String(newFollowUpDate.getMonth() + 1).padStart(
                2,
                '0',
              );
              const day = String(newFollowUpDate.getDate()).padStart(2, '0');
              const hours = String(newFollowUpDate.getHours()).padStart(2, '0');
              const minutes = String(newFollowUpDate.getMinutes()).padStart(
                2,
                '0',
              );

              const followUpDateString = `${year}-${month}-${day}T${hours}:${minutes}`;

              // Schedule the new follow-up
              const followUpPayload = {
                clientId: client.id as number,
                userId: user?.id as number,
                followUpDate: followUpDateString,
                status: 'Pending',
                id: client.followUp.id, // Use the existing follow-up ID to update it
              };

              const followUpResponse = await PartnerService.scheduleFollowUp(
                followUpPayload,
              );

              if (followUpResponse.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2:
                    'Activity added and follow-up rescheduled for 3 days later',
                });
              } else {
                Toast.show({
                  type: 'success',
                  text1: 'Activity Added',
                  text2: 'Activity added but could not reschedule follow-up',
                });
              }
            } catch (followUpError) {
              console.error('Error rescheduling follow-up:', followUpError);
              Toast.show({
                type: 'success',
                text1: 'Activity Added',
                text2: 'Activity added but could not reschedule follow-up',
              });
            }
          } else {
            // For non-today follow-ups, mark as completed (keep existing behavior)
            try {
              const followUpResponse = await PartnerService.completeFollowUp(
                client.followUp.id as number,
                'Completed',
              );

              if (followUpResponse.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: 'Activity added and follow-up marked as completed',
                });
              } else {
                Toast.show({
                  type: 'success',
                  text1: 'Activity Added',
                  text2: 'Activity added but could not update follow-up status',
                });
              }
            } catch (followUpError) {
              console.error('Error updating follow-up status:', followUpError);
              Toast.show({
                type: 'success',
                text1: 'Activity Added',
                text2: 'Activity added but could not update follow-up status',
              });
            }
          }
        } else {
          // Regular success message for edits or when no follow-up exists
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: activityId
              ? 'Activity updated successfully'
              : 'Activity added successfully',
          });
        }

        // Refresh client data to show updated follow-up status
        fetchClient();
        setIsActivityModalVisible(false);
        setSelectedActivity(undefined);
        setClientsUpdated(prev => !prev);
      }
    } catch (error) {
      console.error('Error in handleAddEditActivity', error);
      showError(
        activityId ? 'Failed to update activity' : 'Failed to add activity',
      );
    } finally {
      setAddingActivity(false);
    }
  };

  const handleScheduleFollowUp = async (selectedDate: Date | null) => {
    try {
      setSchedulingFollowUp(true);

      // Format the date to the correct UTC format for the API or null for "someday"
      let followUpDateString = null;
      if (selectedDate) {
        const utcDate = new Date(selectedDate.getTime());

        const year = utcDate.getUTCFullYear();
        const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(utcDate.getUTCDate()).padStart(2, '0');
        const hours = String(utcDate.getUTCHours()).padStart(2, '0');
        const minutes = String(utcDate.getUTCMinutes()).padStart(2, '0');

        followUpDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
      }

      const payload = {
        clientId: client?.id as number,
        userId: user?.id as number,
        followUpDate: followUpDateString,
        status: 'Pending',
      };

      const response = await PartnerService.scheduleFollowUp(payload);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Follow-up scheduled successfully',
        });

        // Update client data with new follow-up info
        fetchClient();
        setClientsUpdated(prev => !prev);
      } else {
        showError('Failed to schedule follow-up');
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      showError('Failed to schedule follow-up');
    } finally {
      setSchedulingFollowUp(false);
      setIsFollowUpModalVisible(false);
    }
  };

  const handleDeleteFollowUp = async () => {
    try {
      setSchedulingFollowUp(true);

      const response = await PartnerService.deleteFollowUp(
        client?.followUp?.id as number,
      );

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Follow-up removed successfully',
        });

        // Update client data with new follow-up info
        fetchClient();
        setClientsUpdated(prev => !prev);
      } else {
        showError('Failed to remove follow-up');
      }
    } catch (error) {
      console.error('Error removing follow-up:', error);
      showError('Failed to remove follow-up');
    } finally {
      setSchedulingFollowUp(false);
    }
  };

  // Hide bottom tabs when this screen is focused
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: {display: 'none'},
        });
      }

      return () => {
        const parentNavigator = navigation.getParent();
        if (parentNavigator) {
          parentNavigator.setOptions({
            tabBarStyle: {display: 'flex'},
          });
        }
      };
    }, [navigation]),
  );

  return (
    <View style={styles.container}>
      <Header
        title="Client Profile"
        navigation={navigation}
        backButton={true}
        onBackPress={() => {
          navigation.navigate('ClientScreen');
        }}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              // eslint-disable-next-line react/no-unstable-nested-components
              icon={() => <GetIcon iconName="threeDots" color="white" />}
              onPress={openMenu}
              style={styles.threeDotsIcon}
            />
          }
          contentStyle={styles.menuContent}>
          <Menu.Item
            onPress={() => {
              closeMenu();
              if (client) {
                navigation.navigate('AddClientScreen', {
                  editMode: true,
                  clientData: client,
                });
              }
            }}
            title="Edit"
            titleStyle={styles.menuItemTitle}
            // eslint-disable-next-line react/no-unstable-nested-components
            leadingIcon={() => <GetIcon iconName="edit" />}
          />
          <Menu.Item
            onPress={handleDelete}
            title="Delete"
            titleStyle={styles.menuItemTitle}
            // eslint-disable-next-line react/no-unstable-nested-components
            leadingIcon={() => <GetIcon iconName="delete" />}
          />
        </Menu>
      </Header>

      {loading ? (
        // Only replace the content area with the loading indicator
        <View style={styles.contentLoadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {client && (
            <>
              <ProfileHeader client={client} />
              <ContactButtons client={client} handleContact={handleContact} />
              <View style={styles.infoSection}>
                <FollowUpCard
                  client={client}
                  isLoading={followUpLoading}
                  onPress={() => setIsFollowUpModalVisible(true)}
                />

                <AssignedUsersCard
                  assignedUsersCount={assignedUsers.length}
                  isLoading={assignedUsersLoading}
                  onPress={() => {
                    navigation.navigate('ClientAssignmentScreen', {
                      clientId: client.id as number,
                      assignedUsers: assignedUsers,
                    });
                  }}
                />

                <ContactInfoCard client={client} />

                <GroupsCard client={client} />

                <NotesCard notes={client.notes} />

                <RecentActivitiesCard
                  activities={client.clientActivityDataModels}
                  onAddActivity={() => setIsActivityModalVisible(true)}
                  onActivityPress={handleActivityPress}
                />

                {/* Add bottom padding when keyboard is visible */}
                {keyboardVisible && <View style={styles.keyboardSpacing} />}
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Fixed Send Quick Response Button - Moved outside ScrollView */}
      {client && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={styles.sendResponseButton}
            onPress={() => {
              navigation.navigate('MessageTemplateScreen', {
                clientId: client.id as number,
                clientName: client.clientName,
                clientPhone: client.mobileNumber,
                clientWhatsapp: client.whatsappNumber,
                clientEmail: client.emailId,
              });
            }}
            activeOpacity={0.7}>
            <GetIcon iconName="message" size={20} color="white" />
            <Text style={styles.sendResponseButtonText}>
              Send Quick Response
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <AddActivityModal
        visible={isActivityModalVisible}
        onClose={() => {
          setIsActivityModalVisible(false);
          setSelectedActivity(undefined);
          setPreSelectedActivityType(null); // Reset pre-selected type
        }}
        onSubmit={handleAddEditActivity}
        onDelete={handleDeleteActivity}
        isDeletingActivity={isDeletingActivity}
        isLoading={addingActivity}
        editMode={!!selectedActivity}
        activityToEdit={selectedActivity}
        closeMenu={closeActivityModal}
        initialActivityType={preSelectedActivityType} // Pass the pre-selected type
      />

      <ScheduleFollowUpModal
        visible={isFollowUpModalVisible}
        onClose={() => setIsFollowUpModalVisible(false)}
        onSubmit={handleScheduleFollowUp}
        onDelete={handleDeleteFollowUp}
        currentDate={
          client?.followUp?.date ? new Date(client.followUp.date) : null
        }
        isLoading={schedulingFollowUp}
        isSomedayFollowUp={
          client?.followUp?.status === 'Pending' && !client?.followUp?.date
        }
      />

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Delete Client"
        message="Are you sure you want to delete this client?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    backgroundColor: 'white',
  },
  menuItemTitle: {
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  threeDotsIcon: {
    marginRight: -10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  infoSection: {
    padding: 16,
  },
  keyboardSpacing: {
    height: 60,
  },
  contentLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  sendResponseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '100%',
  },
  sendResponseButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20, // Changed from 110 to 20 since tabs are hidden
    left: 16,
    right: 16,
  },
});

export default ClientProfileScreen;
