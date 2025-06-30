import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ClientStackParamList} from '../../../navigator/components/ClientScreenStack';
import Header from '../../../components/Header';
import PartnerService from '../../../services/PartnerService';
import {User} from '../../../types';
import {useAuth} from '../../../hooks/useAuth';
import GetIcon from '../../../components/GetIcon';
import Colors from '../../../constants/Colors';
import {useDialog} from '../../../hooks/useDialog';
import Toast from 'react-native-toast-message';
import {usePartner} from '../../../context/PartnerProvider';
import {useTheme} from '../../../context/ThemeProvider';

type Props = NativeStackScreenProps<
  ClientStackParamList,
  'ClientAssignmentScreen'
>;

interface UserWithSelection extends User {
  isSelected: boolean;
}

const ClientAssignmentScreen: React.FC<Props> = ({navigation, route}) => {
  const {clientId, assignedUsers} = route.params;
  const [users, setUsers] = useState<UserWithSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {user} = useAuth();
  const {showError} = useDialog();
  const {setClientsUpdated} = usePartner();
  const {theme} = useTheme();

  const fetchTeamMembers = useCallback(async () => {
    if (!user?.email) {
      showError('User email is not available');
      return;
    }

    try {
      setLoading(true);
      const response = await PartnerService.getTeamMembers(user.email);

      if (response.success) {
        const usersWithSelection: UserWithSelection[] = response.data.map(
          teamUser => ({
            ...teamUser,
            // isSelected: assignedUsers.includes(teamUser.id),
            isSelected: assignedUsers.map(assignedUser => assignedUser.id).includes(teamUser.id),
          }),
        );
        setUsers(usersWithSelection);
      } else {
        showError('Failed to fetch team members');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      showError('Error loading team members');
    } finally {
      setLoading(false);
    }
  }, [user?.email, assignedUsers, showError]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const toggleUserSelection = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(_user =>
        _user.id === userId ? {..._user, isSelected: !_user.isSelected} : _user,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const selectedUserIds = users
        .filter(_user => _user.isSelected)
        .map(_user => _user.id);

      const response = await PartnerService.assignClient({
        clientId,
        userId: selectedUserIds,
      });

      if (response.success) {
        // showSuccess('Users assigned successfully');
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Users assigned successfully',
        });

        setClientsUpdated(prev => !prev);
        navigation.goBack();
      } else {
        showError('Failed to assign users');
      }
    } catch (error) {
      console.error('Error assigning users:', error);
      showError('Error assigning users');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedCount = () => {
    return users.filter(_user => _user.isSelected).length;
  };

  const renderUserItem = ({item}: {item: UserWithSelection}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => toggleUserSelection(item.id)}
      activeOpacity={0.7}>
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <GetIcon
            iconName="user"
            color={item.isSelected ? theme.primaryColor : '#999'}
            size={20}
          />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
      </View>

      <View
        style={[
          styles.checkbox,
          item.isSelected && {
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor,
          },
        ]}>
        {item.isSelected && (
          <GetIcon iconName="checkmark" color="white" size={16} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No team members found</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="Client Assignment"
          backButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primaryColor} />
          <Text style={styles.loadingText}>Loading team members...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Client Assignment"
        backButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>Assign Team Members</Text>
          <Text style={styles.sectionSubtitle}>
            Select team members to assign to this client
          </Text>
          {getSelectedCount() > 0 && (
            <Text style={[styles.selectedCount, {color: theme.primaryColor}]}>
              {getSelectedCount()} user{getSelectedCount() > 1 ? 's' : ''}{' '}
              selected
            </Text>
          )}
        </View>

        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.submitSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              {backgroundColor: theme.primaryColor},
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.8}>
            {submitting ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text style={styles.submitButtonText}>Assigning...</Text>
              </>
            ) : (
              <Text style={styles.submitButtonText}>
                Assign {getSelectedCount()} User
                {getSelectedCount() !== 1 ? 's' : ''}
              </Text>
            )}
          </TouchableOpacity>
          {/* Add bottom spacing for tab bar */}
          <View style={styles.bottomSpacing} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  headerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  userItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: Colors.MT_PRIMARY_1,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  submitSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100, // Add 80px gap below submit button
  },
});

export default ClientAssignmentScreen;
