import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const {user} = useAuth();

  const fetchAgentData = useCallback(async () => {
    try {
      const response = await PartnerService.getAgentProperties(
        1,
        20,
        user?.email || '',
        '',
        '',
        '',
        '',
      );
      setAgentPropertyCount(
        response.data?.responsePagingModel?.totalCount || 0,
      );
    } catch (error) {
      console.error(error);
    }
  }, [user?.email]);

  const fetchPartnerProperty = useCallback(async () => {
    try {
      const response = await PartnerService.getPartnerProperty(
        user?.email || '',
        1,
        20,
      );
      setPartnerPropertyCount(
        response.data?.responsePagingModel?.totalCount || 0,
      );
    } catch (error) {
      console.error(error);
    }
  }, [user?.email]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchAgentData(), fetchPartnerProperty()]);
    setRefreshing(false);
  }, [fetchAgentData, fetchPartnerProperty]);

  useEffect(() => {
    fetchAgentData();
    fetchPartnerProperty();
  }, [fetchAgentData, fetchPartnerProperty]);

  return (
    <View style={styles.container}>
      <Header<PartnerDrawerParamList> title="Dashboard" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.main]}
            tintColor={Colors.main}
          />
        }>
        <View style={styles.gridContainer}>
          <StatCard
            title="Agent Properties"
            count={agentPropertyCount || 0}
            onPress={() => navigation.navigate('Property')}
          />
          <StatCard
            title="My Properties"
            count={partnerPropertyCount || 0}
            onPress={() => {}}
          />
          <StatCard
            title="Clients"
            count={clients?.length || 0}
            onPress={() =>
              navigation.navigate('Clients', {
                screen: 'ClientScreen',
              })
            }
          />
        </View>
      </ScrollView>
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
    borderRadius: 8,
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
    elevation: 4,
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
