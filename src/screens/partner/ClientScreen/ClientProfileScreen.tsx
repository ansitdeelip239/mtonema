import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  RefreshControl,
  ActivityIndicator,
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

// Import our new components
import ProfileHeader from './components/ProfileHeader';
import ContactButtons from './components/ContactButtons';
import FollowUpCard from './components/FollowUpCard';
import ContactInfoCard from './components/ContactInfoCard';
import GroupsCard from './components/GroupsCard';
import NotesCard from './components/NotesCard';
import RecentActivitiesCard from './components/RecentActivitiesCard';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'ClientProfileScreen'
>;

const ClientProfileScreen: React.FC<Props> = ({route, navigation}) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const {clientsUpdated, setClientsUpdated} = usePartner();
  const {keyboardVisible} = useKeyboard();
  const {user} = useAuth();
  const {showError} = useDialog();

  const fetchClient = React.useCallback(async () => {
    try {
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
    }
  }, [route.params.clientId, navigation, showError]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient, clientsUpdated]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchClient();
  }, [fetchClient]);

  const handleContact = React.useCallback(
    (type: 'phone' | 'whatsapp' | 'email') => {
      if (!client) {
        return;
      }

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
    },
    [client],
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
        // If we're adding a new activity (not editing) and there's an active follow-up,
        // mark the follow-up as completed
        if (!activityId && client?.followUp?.status === 'Pending') {
          try {
            // Call API to update follow-up status to completed
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
              // Still show success for the activity, but note the follow-up status issue
              Toast.show({
                type: 'success',
                text1: 'Activity Added',
                text2: 'Activity added but could not update follow-up status',
              });
            }
          } catch (followUpError) {
            console.error('Error updating follow-up status:', followUpError);
            // Still consider the overall operation successful if the activity was added
            Toast.show({
              type: 'success',
              text1: 'Activity Added',
              text2: 'Activity added but could not update follow-up status',
            });
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

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
              icon={() => <GetIcon iconName="threeDots" />}
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
                onPress={() => setIsFollowUpModalVisible(true)}
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

      <AddActivityModal
        visible={isActivityModalVisible}
        onClose={() => {
          setIsActivityModalVisible(false);
          setSelectedActivity(undefined);
        }}
        onSubmit={handleAddEditActivity}
        onDelete={handleDeleteActivity}
        isDeletingActivity={isDeletingActivity}
        isLoading={addingActivity}
        editMode={!!selectedActivity}
        activityToEdit={selectedActivity}
        closeMenu={closeActivityModal}
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
    paddingBottom: 80,
  },
  infoSection: {
    padding: 16,
  },
  keyboardSpacing: {
    height: 60,
  },
});

export default ClientProfileScreen;
