import React, {useCallback, useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Header from '../../../../components/Header';
import UsersList from './components/UsersList';
import Colors from '../../../../constants/Colors';
import Roles from '../../../../constants/Roles';
import AdminService from '../../../../services/AdminService';
import { UserModel } from '../../../../types/admin';

const Tab = createMaterialTopTabNavigator();

interface Props {
  viewType?: 'partner' | 'buyerseller';
}

const BuyerSellerList: React.FC<Props> = ({viewType = 'buyerseller'}) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialRender = useRef(true);
  const pageSize = 100;

  const fetchUsers = useCallback(
    async (pageNumber: number, shouldRefresh = false) => {
      if (!hasMore && !shouldRefresh) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await AdminService.getAllUser(pageNumber, pageSize);

        const {userModels, responsePagingModel} = response.data;

        if (shouldRefresh) {
          setUsers(userModels);
        } else {
          setUsers(prevUsers => [...prevUsers, ...userModels]);
        }

        setHasMore(responsePagingModel.NextPage);
        setPage(responsePagingModel.CurrentPage);
      } catch (err) {
        const errorMessage = (err as Error).message || 'Failed to fetch users';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
        if (shouldRefresh) {
          setUsers([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pageSize, hasMore],
  );

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      fetchUsers(1, true);
    }
  }, [fetchUsers]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers(1, true);
  }, [fetchUsers]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchUsers(page + 1);
    }
  }, [loading, hasMore, page, fetchUsers]);

  if (viewType === 'partner') {
    return (
      <View style={styles.container}>
        <Header title="Partners List" />
        <UsersList
          users={users.filter(user => user.Role === Roles.PARTNER)}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Buyer/Seller List" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.indicator,
          tabBarActiveTintColor: Colors.MT_PRIMARY_1,
          tabBarInactiveTintColor: '#666',
          tabBarLabelStyle: styles.tabLabel,
        }}>
        <Tab.Screen
          name="Buyers"
          children={() => (
            <UsersList
              users={users.filter(user => user.Role === Roles.BUYER)}
              loading={loading}
              refreshing={refreshing}
              error={error}
              onRefresh={handleRefresh}
              onLoadMore={handleLoadMore}
            />
          )}
        />
        <Tab.Screen
          name="Sellers"
          children={() => (
            <UsersList
              users={users.filter(user => user.Role === Roles.SELLER)}
              loading={loading}
              refreshing={refreshing}
              error={error}
              onRefresh={handleRefresh}
              onLoadMore={handleLoadMore}
            />
          )}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  indicator: {
    backgroundColor: Colors.MT_PRIMARY_1,
    height: 3,
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default React.memo(BuyerSellerList);
