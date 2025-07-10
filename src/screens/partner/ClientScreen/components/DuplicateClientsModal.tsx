import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {Client} from '../../../../types';
import GetIcon from '../../../../components/GetIcon';
import {formatDate} from '../../../../utils/dateUtils';

interface DuplicateClientsModalProps {
  visible: boolean;
  onClose: () => void;
  duplicateClients: Partial<Client>[];
  onClientPress: (clientId: number) => void;
}

const DuplicateClientsModal: React.FC<DuplicateClientsModalProps> = ({
  visible,
  onClose,
  duplicateClients,
  onClientPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Duplicate Clients</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <GetIcon iconName="delete" color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.list}>
            {duplicateClients.map(client => (
              <TouchableOpacity
                key={client.id}
                style={styles.card}
                onPress={() => client.id && onClientPress(client.id)}>
                <View>
                  <Text style={styles.cardName}>{client.clientName}</Text>
                  <Text style={styles.cardInfo}>
                    {client.mobileNumber || client.whatsappNumber}
                  </Text>
                  <Text style={styles.cardInfo}>{client.emailId}</Text>
                  <Text style={styles.cardDate}>
                    Added on:{' '}
                    {formatDate(client.createdOn || '', 'dd MMM yyyy')}
                  </Text>
                </View>
                <GetIcon iconName="chevronRight" size={24} color="#999" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '80%',
    width: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default DuplicateClientsModal;
