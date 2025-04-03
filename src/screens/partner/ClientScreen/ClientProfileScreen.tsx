import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import Colors from '../../../constants/Colors';
import {usePartner} from '../../../context/PartnerProvider';
import {Appbar, Menu} from 'react-native-paper';
import AddActivityModal from './components/AddActivityModal';
import {useKeyboard} from '../../../hooks/useKeyboard';
import {useAuth} from '../../../hooks/useAuth';
import ActivityTimeline from './components/ActivityTimeline';
import {useDialog} from '../../../hooks/useDialog';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {formatFollowUpDate, formatTime} from '../../../utils/dateUtils';
import ScheduleFollowUpModal from './components/ScheduleFollowUpModal';

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
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: 'Failed to fetch client data',
      // });
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
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: 'Failed to delete activity',
      // });
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
      const response = await PartnerService.addEditClientActivity(
        type,
        route.params.clientId,
        description,
        user?.email as string,
        activityId,
      );

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: activityId
            ? 'Activity updated successfully'
            : 'Activity added successfully',
        });
        fetchClient();
        setIsActivityModalVisible(false);
        setSelectedActivity(undefined);
        setClientsUpdated(prev => !prev);
      }
    } catch (error) {
      console.error('Error in handleAddEditActivity', error);
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: activityId
      //     ? 'Failed to update activity'
      //     : 'Failed to add activity',
      // });
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
        userId: user?.id || 101,
        followUpDate: followUpDateString,
        status: 'Pending',
      };

      const response = await PartnerService.scheduleFollowUp(
        payload,
        user?.id || 101,
      );

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

  // Add this new function to handle follow-up deletion

  const handleDeleteFollowUp = async () => {
    try {
      setSchedulingFollowUp(true);

      const payload = {
        clientId: client?.id as number,
        userId: user?.id || 101,
        followUpDate: null,
        status: 'Cancelled',
      };

      const response = await PartnerService.scheduleFollowUp(
        payload,
        user?.id || 101,
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

  const renderContactInfo = React.useCallback(() => {
    if (!client) {
      return null;
    }

    const contactFields = [
      {label: 'Mobile', value: client.mobileNumber},
      {label: 'WhatsApp', value: client.whatsappNumber},
      {label: 'Email', value: client.emailId},
    ].filter(field => field.value);

    if (contactFields.length === 0) {
      return null;
    }

    return (
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {contactFields.map(field => (
          <View key={field.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{field.label}:</Text>
            <Text style={styles.infoValue}>{field.value}</Text>
          </View>
        ))}
      </View>
    );
  }, [client]);

  const renderGroups = React.useCallback(() => {
    return client?.groups.map((group, index) => (
      <View
        key={`group-${group.id}-${group.name}-${index}`} // Added index to make key unique
        style={[styles.groupBadge, {backgroundColor: `${group.groupColor}20`}]}>
        <Text style={[styles.groupText, {color: group.groupColor}]}>
          {group.name}
        </Text>
      </View>
    ));
  }, [client?.groups]);

  const renderActivities = React.useCallback(() => {
    if (!client?.clientActivityDataModels.length) {
      return <Text style={styles.noActivityText}>No activities yet</Text>;
    }

    const sortedActivities = client.clientActivityDataModels
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
      )
      .slice(0, 5);

    return sortedActivities.map((activity, index) => (
      <ActivityTimeline
        key={`activity-${activity.id}`}
        activity={activity}
        isLast={index === sortedActivities.length - 1}
        onPress={handleActivityPress}
      />
    ));
  }, [client?.clientActivityDataModels]);

  const renderFollowUpCard = () => {
    // Calculate days difference for proper display
    const getDaysText = () => {
      if (!client?.followUp?.date) {
        return '';
      }

      const daysLeft = Math.ceil(
        (new Date(client.followUp.date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );

      return daysLeft === 1 ? '1 day' : `${daysLeft} days`;
    };

    // Determine if this is a "Someday" follow-up
    const isSomedayFollowUp =
      client?.followUp?.status === 'Pending' && !client?.followUp?.date;

    return (
      <TouchableOpacity
        style={[
          styles.infoCard,
          styles.followUpCard,
          client?.followUp?.date && styles.activeFollowUpCard,
        ]}
        onPress={() => setIsFollowUpModalVisible(true)}>
        <View style={styles.followUpHeader}>
          <Text style={styles.sectionTitle}>
            {client?.followUp?.date
              ? `Follow Up in ${getDaysText()}`
              : isSomedayFollowUp
              ? 'Follow Up: Someday'
              : 'No Follow Up Scheduled'}
          </Text>
          <View style={styles.scheduleButton}>
            {client?.followUp?.date ? (
              <GetIcon iconName="edit" size={20} color="#0066cc" />
            ) : (
              <GetIcon iconName="plus" size={20} color="#0066cc" />
            )}
          </View>
        </View>
        {client?.followUp?.date ? (
          <View style={styles.followUpDateContainer}>
            <Text style={styles.infoValue}>
              {formatFollowUpDate(new Date(client.followUp.date))}
            </Text>
            <Text style={styles.followUpTime}>
              {formatTime(new Date(client.followUp.date))}
            </Text>
          </View>
        ) : isSomedayFollowUp ? (
          <Text style={styles.infoValue}>To be scheduled later</Text>
        ) : (
          <Text style={styles.infoValue}>No date set</Text>
        )}
      </TouchableOpacity>
    );
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
      <Header title="Client Profile" navigation={navigation} backButton={true}>
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
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {client.clientName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.clientName}>{client.clientName}</Text>
              {client.displayName && (
                <Text style={styles.displayName}>{client.displayName}</Text>
              )}
            </View>

            {(client.mobileNumber ||
              client.whatsappNumber ||
              client.emailId) && (
              <View style={styles.contactButtons}>
                {client.mobileNumber && (
                  <TouchableOpacity
                    key="contact-phone"
                    style={styles.contactButton}
                    onPress={() => handleContact('phone')}>
                    <GetIcon iconName="phone" size="24" color="#0066cc" />
                    <Text style={styles.contactText}>Call</Text>
                  </TouchableOpacity>
                )}
                {client.whatsappNumber && (
                  <TouchableOpacity
                    key="contact-whatsapp"
                    style={styles.contactButton}
                    onPress={() => handleContact('whatsapp')}>
                    <GetIcon iconName="whatsapp" size="24" color="#0066cc" />
                    <Text style={styles.contactText}>WhatsApp</Text>
                  </TouchableOpacity>
                )}
                {client.emailId && (
                  <TouchableOpacity
                    key="contact-email"
                    style={styles.contactButton}
                    onPress={() => handleContact('email')}>
                    <GetIcon iconName="contactus" size="24" color="#0066cc" />
                    <Text style={styles.contactText}>Email</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={styles.infoSection}>
              {renderFollowUpCard()}

              {renderContactInfo()}

              {client.groups && client.groups.length > 0 && (
                <View style={styles.infoCard}>
                  <Text style={styles.sectionTitle}>Groups</Text>
                  <View style={styles.groupsContainer}>{renderGroups()}</View>
                </View>
              )}

              {client.notes && (
                <View style={styles.infoCard}>
                  <Text style={styles.sectionTitle}>Notes</Text>
                  <Text style={styles.notesText}>{client.notes}</Text>
                </View>
              )}

              <View style={styles.infoCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.sectionTitle}>Recent Activities</Text>
                  <TouchableOpacity
                    style={styles.addActivityButton}
                    onPress={() => {
                      setIsActivityModalVisible(true);
                    }}>
                    <Text style={styles.addActivityButtonText}>
                      Add Activity
                    </Text>
                  </TouchableOpacity>
                </View>
                {renderActivities()}
              </View>

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
  followUpDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  followUpTime: {
    fontSize: 14,
    color: '#1a1a1a',
    textAlign: 'right',
  },
  keyboardSpacing: {
    height: 60,
  },
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
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  clientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    color: '#666',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactButton: {
    alignItems: 'center',
  },
  contactIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#0066cc',
  },
  infoSection: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  followUpCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  activeFollowUpCard: {
    borderWidth: 1,
    borderColor: '#0066cc',
    backgroundColor: '#e6f0ff',
    shadowColor: '#0066cc',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  groupText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  addActivityButton: {
    backgroundColor: Colors.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  addActivityButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  activityItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  assignedTo: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noActivityText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: Colors.main,
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
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
});

export default ClientProfileScreen;
