import React, {useCallback, useState, useEffect} from 'react';
import {Platform, StyleSheet, FlatList, View, Text, ActivityIndicator} from 'react-native';
import Header from '../../../components/Header';
import {PartnerDrawerParamList} from '../../../types/navigation';
import {useTranslation} from 'react-i18next';
import UserCard from './components/UserCard';
import UserHeader from './components/UserHeader';
import RoleSelector from './components/RoleSelector';
import Roles from '../../../constants/Roles';
import AuthService from '../../../services/AuthService';
import { User } from '../../../types';

const UsersScreen: React.FC = () => {
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(Roles.PARTNER);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const PAGE_SIZE = 20;

  // Fetch users by role
  const fetchUsersByRole = useCallback(async (role: string, page: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await AuthService.getUserByRole(role, page, PAGE_SIZE) as any;

      if (response.success && response.data) {
        const newUsers = response.data.users || [];
        const pagination = response.data.responsePagingModel;

        if (append) {
          setUsers(prevUsers => [...prevUsers, ...newUsers]);
        } else {
          setUsers(newUsers);
        }

        // Update pagination state
        setHasNextPage(pagination?.nextPage || false);
        if (!append) {
          setCurrentPage(1);
        }
      } else {
        setError(response.message || 'Failed to fetch users');
        if (!append) {
          setUsers([]);
        }
      }
    } catch (err) {
      setError('Failed to fetch users');
      if (!append) {
        setUsers([]);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [PAGE_SIZE]);

  // Fetch users when role changes
  useEffect(() => {
    fetchUsersByRole(selectedRole, 1, false);
  }, [selectedRole, fetchUsersByRole]);

  // Handle role change - reset pagination
  const handleRoleChange = useCallback((role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
    setHasNextPage(true);
  }, []);

  // Load more users for infinite scroll
  const loadMoreUsers = useCallback(() => {
    if (hasNextPage && !isLoadingMore && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUsersByRole(selectedRole, nextPage, true);
    }
  }, [hasNextPage, isLoadingMore, loading, currentPage, selectedRole, fetchUsersByRole]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    setHasNextPage(true);
    fetchUsersByRole(selectedRole, 1, false).finally(() => {
      setRefreshing(false);
    });
  }, [selectedRole, fetchUsersByRole]);

  const renderItem = useCallback(
    ({item}: {item: User}) => <UserCard item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: User) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <Header<PartnerDrawerParamList>
          title={t('navigation.drawer.users', 'Users')}>
          {/* Add button can be added here if needed in the future */}
        </Header>
      )}

      <RoleSelector
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
      />

      <UserHeader userCount={users.length} />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          onEndReached={loadMoreUsers}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#007bff" />
                <Text style={styles.loadingMoreText}>Loading more users...</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
});

export default UsersScreen;
