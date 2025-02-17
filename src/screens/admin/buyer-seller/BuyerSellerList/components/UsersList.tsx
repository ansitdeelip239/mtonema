import React, {useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';

interface UserModel {
  ID: number;
  Name: string;
  Email: string;
  Phone: string;
  Role: string;
  CreatedOn: string;
  Status: number;
  PropertyListed: number;
  sellerStatus: {
    MasterDetailName: string;
    ID: number;
  };
}

interface Props {
  users: UserModel[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const UsersList: React.FC<Props> = ({
  users,
  loading,
  refreshing,
  error,
  onRefresh,
  onLoadMore,
}) => {
  const renderUserCard = useCallback(
    ({item}: {item: UserModel}) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.Name}</Text>
          <View
            style={[
              styles.statusBadge,
              // eslint-disable-next-line react-native/no-inline-styles
              {backgroundColor: item.Status === 1 ? '#4CAF50' : '#F44336'},
            ]}>
            <Text style={styles.statusText}>
              {item.sellerStatus.MasterDetailName}
            </Text>
          </View>
        </View>

        <Text style={styles.info}>Email: {item.Email}</Text>
        <Text style={styles.info}>Phone: {item.Phone}</Text>
        {/* <Text style={styles.info}>Role: {item.Role}</Text> */}
        <Text style={styles.info}>
          Created: {new Date(item.CreatedOn).toLocaleDateString()}
        </Text>
        {item.Role === 'Seller' && (
          <Text style={styles.info}>
            Properties Listed: {item.PropertyListed}
          </Text>
        )}
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (!loading) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }, [loading]);

  const renderEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{error || 'No users available'}</Text>
      </View>
    ),
    [error],
  );

  const keyExtractor = useCallback((item: UserModel) => item.ID.toString(), []);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserCard}
        keyExtractor={keyExtractor}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={[
          styles.listContainer,
          users.length === 0 && styles.emptyListContainer,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={100}
        initialNumToRender={10}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
});

export default React.memo(UsersList);
