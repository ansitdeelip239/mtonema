import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {
  PartnerBottomTabParamList,
  PartnerDrawerParamList,
} from '../../../types/navigation';
import Header from '../../../components/Header';
// import { api } from '../../../utils/api';

type Props = BottomTabScreenProps<PartnerBottomTabParamList, 'Clients'>;

const ClientScreen: React.FC<Props> = () => {
  // const [clients, setClients] = useState([]);

  useEffect(() => {
    // Fetch clients
    // const fetchClients = async () => {
    //   try {
    //     const response = await api.get<>();
    //   } catch (error) {}
    // };
  }, []);
  return (
    <View>
      <Header<PartnerDrawerParamList> title="Clients" />
      <Text>Client Screen</Text>
    </View>
  );
};

export default ClientScreen;
