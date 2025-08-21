import React from 'react';
import {Modal, View, Text, ActivityIndicator, StyleSheet} from 'react-native';

interface PaymentVerificationModalProps {
  visible: boolean;
}

const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  visible,
}) => (
  <Modal visible={visible} transparent={true} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.verificationModal}>
        <ActivityIndicator size="large" color="#53a20e" />
        <Text style={styles.verificationTitle}>Verifying Payment</Text>
        <Text style={styles.verificationText}>
          Please wait while we confirm your payment...
        </Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
});

export default PaymentVerificationModal;
