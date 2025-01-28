import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import Header from '../../../components/Header';
import Colors from '../../../constants/Colors';
import {useClientData} from '../../../hooks/useClientData';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Home'>;

const StatCard = ({
  title,
  count,
  onPress,
}: {
  title: string;
  count: number;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardCount}>{count}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardLabel}>
      {title === 'Agent Properties'
        ? 'Total properties from agents'
        : title === 'My Properties'
        ? 'Properties you manage'
        : 'Total registered clients'}
    </Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const {clients} = useClientData();
  const [agentPropertyCount, setAgentPropertyCount] = useState<number>(0);
  const [partnerPropertyCount, setPartnerPropertyCount] = useState<number>(0);
  const {user} = useAuth();

  const fetchAgentData = useCallback(async () => {
    try {
      const response = await PartnerService.getAgentImportData(
        1,
        20,
        user?.Email || '',
        '',
        '',
        '',
        '',
      );
      setAgentPropertyCount(
        response.data?.responsePagingModel?.TotalCount || [],
      );
    } catch (error) {}
  }, [user?.Email]);

  const fetchPartnerProperty = useCallback(async () => {
    try {
      const response = await PartnerService.getPartnerProperty(
        user?.Email || '',
        1,
        20,
      );
      setPartnerPropertyCount(
        response.data?.responsePagingModel?.TotalCount || [],
      );
    } catch (error) {}
  }, [user?.Email]);

  useEffect(() => {
    fetchAgentData();
    fetchPartnerProperty();
  }, [fetchAgentData, fetchPartnerProperty]);

  const handleCardPress = (screen: keyof PartnerBottomTabParamList) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Dashboard" />
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <StatCard
            title="Agent Properties"
            count={agentPropertyCount}
            onPress={() => handleCardPress('Property')}
          />
          <StatCard
            title="My Properties"
            count={partnerPropertyCount}
            onPress={() => {}}
          />
          <StatCard
            title="Clients"
            count={clients?.length || 0}
            onPress={() => handleCardPress('Clients')}
          />
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
    padding: 16,
  },
  gridContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  cardCount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.main,
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HomeScreen;
