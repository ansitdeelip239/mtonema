import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AgentData} from '../../../../types';
import {formatCurrency} from '../../../../utils/currency';
import {IconButton, Surface} from 'react-native-paper';
import Colors from '../../../../constants/Colors';
import GetIcon from '../../../../components/GetIcon';
import PartnerService from '../../../../services/PartnerService';
import Toast from 'react-native-toast-message';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import {AgentDataStackParamList} from '../../../../navigator/components/AgentDataStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface RenderItemProps {
  item: AgentData;
  onDataUpdate: () => void;
  navigation: NativeStackNavigationProp<
    AgentDataStackParamList,
    'AgentDataScreen'
  >;
}

const RenderItem: React.FC<RenderItemProps> = ({
  item,
  onDataUpdate,
  navigation,
}) => {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const onEdit = () => {
    navigation.navigate('AddAgentDataScreen', {
      editMode: true,
      propertyData: item,
    });
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await PartnerService.deleteAgentProperty(item.id);
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Property Deleted Successfully',
          visibilityTime: 3000,
        });
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error in deleting property:', error);
      Toast.show({
        type: 'error',
        text1: 'Error in deleting property',
        visibilityTime: 4000,
      });
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <>
      <Surface style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{item.agentName || 'N/A'}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.negotiable ? 'Negotiable' : 'Fixed Price'}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon={() => GetIcon({iconName: 'edit', color: Colors.main})}
              size={20}
              onPress={() => onEdit()}
              iconColor={Colors.main}
              style={styles.actionButton}
            />
            <IconButton
              icon={() => GetIcon({iconName: 'delete', color: Colors.main})}
              size={20}
              onPress={handleDeletePress}
              iconColor={Colors.main}
              style={styles.actionButton}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.contentSection}>
          <View style={styles.row}>
            <Text style={styles.label}>BHK Type:</Text>
            <Text style={styles.value}>{item.bhkType || 'Not Specified'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{item.propertyLocation || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Demand Price:</Text>
            <Text style={[styles.value, styles.priceText]}>
              {formatCurrency(item.demandPrice) || 'N/A'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Security Deposit:</Text>
            <Text style={[styles.value, styles.priceText]}>
              {formatCurrency(item.securityDepositAmount) || 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Contact No.:</Text>
            <Text style={styles.value}>{item.agentContactNo || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Property Type:</Text>
            <Text style={styles.value}>{item.propertyType || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date Added:</Text>
            <Text style={styles.value}>
              {item.createdOn
                ? new Date(item.createdOn).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
            </Text>
          </View>
        </View>

        {item.propertyNotes && (
          <>
            <View style={styles.divider} />
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{item.propertyNotes}</Text>
            </View>
          </>
        )}
      </Surface>

      <ConfirmationModal
        visible={isDeleteModalVisible}
        title="Delete Property"
        message="This action cannot be undone. Are you sure you want to delete this property?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.main,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: Colors.main + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: Colors.main,
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  contentSection: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    width: 140,
    color: '#666',
    fontSize: 14,
  },
  value: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  priceText: {
    fontWeight: '700',
    color: Colors.main,
  },
  notes: {
    padding: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  notesText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RenderItem;
