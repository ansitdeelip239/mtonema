import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import Header from '../../../components/Header';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';
import {Client} from '../../../types';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Clients'>;

const ClientScreen: React.FC<Props> = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await PartnerService.getClientData(
          user?.Email || '',
          1,
          20,
        );
        console.log(response);

        setClients(response.data.clientDataModel || []);
      } catch (err) {
        setError('Failed to fetch clients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [user?.Email]);

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Clients" />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : clients.length === 0 ? (
        <Text style={styles.emptyText}>No clients found</Text>
      ) : (
        clients &&
        clients?.map(client => (
          <View key={client.Id} style={styles.clientCard}>
            <Text style={styles.clientName}>{client.ClientName}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  clientCard: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
  emptyText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
  },
});

export default ClientScreen;
