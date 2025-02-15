import React, {useState} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import Header from '../../../components/Header';
import PropertyList from '../../../components/PropertyList';
import {api} from '../../../utils/api';
import url from '../../../constants/api';
import {PropertyModel} from '../../../types';
import PropertyModal from '../../buyer/PropertyModal';
import { useAuth } from '../../../hooks/useAuth';

const AdminPropertiesScreen = () => {
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyModel | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {dataUpdated} = useAuth();

  const fetchAdminProperties = async (page: number) => {
    // Replace with your actual admin property fetching logic
    const response = await api.get<any>(
      `${url.getAllProperties}?pageNumber=${page}&pageSize=10`,
    );
    return response;
  };

  const handlePropertyPress = (property: PropertyModel) => {
    setSelectedProperty(property);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProperty(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Properties List" />
      <PropertyList
        fetchProperties={fetchAdminProperties}
        onPropertyPress={handlePropertyPress}
        dataUpdated={dataUpdated}
      />
      <PropertyModal
        property={selectedProperty}
        visible={modalVisible}
        onClose={handleCloseModal}
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

export default AdminPropertiesScreen;
