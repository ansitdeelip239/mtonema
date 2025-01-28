import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import Header from '../../../components/Header';
import { useClientData } from '../../../hooks/useClientData';
import { ClientCard } from './components/ClientCard';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Clients'>;

const ClientScreen: React.FC<Props> = () => {
  const {clients, isLoading, error, refreshing, onRefresh} = useClientData();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    if (clients.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No clients found</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={clients}
        renderItem={({item}) => <ClientCard client={item} />}
        keyExtractor={client => client.Id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0066cc']}
            tintColor="#0066cc"
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Clients" />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    margin: 16,
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
    fontSize: 15,
  },
});

export default ClientScreen;
