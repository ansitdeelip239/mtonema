import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import PropertyList from '../../components/PropertyList';
import {api} from '../../utils/api';
import url from '../../constants/api';
import {PropertyModel} from '../../types';
import PropertyModal from '../buyer/PropertyModal';
import {useAuth} from '../../hooks/useAuth';
import Header from '../../components/Header';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {SellerBottomTabParamList} from '../../types/navigation';

type Props = BottomTabScreenProps<SellerBottomTabParamList, 'Home'>;

const PropertyListScreen: React.FC<Props> = ({navigation}) => {
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyModel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {user, dataUpdated, authToken} = useAuth();

  const fetchSellerProperties = useCallback(
    async (page: number) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      const response = await api.get<any>(
        `${url.GetProperty}?id=${user.ID}&pageNumber=${page}&pageSize=10`,
      );
      return response;
    },
    [user],
  );

  const handlePropertyPress = (property: PropertyModel) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    console.log(authToken);
  }, [authToken]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Listed Property" />
      <PropertyList
        fetchProperties={fetchSellerProperties}
        onPropertyPress={handlePropertyPress}
        dataUpdated={dataUpdated}
      />
      <PropertyModal
        property={selectedProperty}
        visible={modalVisible}
        onClose={handleCloseModal}
        navigation={navigation}
        isRecommended={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    position: 'relative',
  },
});

export default PropertyListScreen;
