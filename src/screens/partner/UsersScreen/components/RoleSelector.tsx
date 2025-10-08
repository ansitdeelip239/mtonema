import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import Roles from '../../../../constants/Roles';
import {SafeAreaView} from 'react-native-safe-area-context';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  const {t} = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [tempRole, setTempRole] = useState(selectedRole);

  const roleOptions = [
    {label: t('users.roleSelector.buyer', 'Buyer'), value: Roles.BUYER},
    {label: t('users.roleSelector.seller', 'Seller'), value: Roles.SELLER},
    {label: t('users.roleSelector.partner', 'Partner'), value: Roles.PARTNER},
  ];

  const getSelectedRoleLabel = () => {
    const selectedOption = roleOptions.find(
      option => option.value === selectedRole,
    );
    return selectedOption?.label || '';
  };

  const handleConfirm = () => {
    onRoleChange(tempRole);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempRole(selectedRole);
    setShowPicker(false);
  };

  if (Platform.OS === 'ios') {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.label}>
            {t('users.roleSelector.selectRole', 'Select Role')}
          </Text>
          <TouchableOpacity
            style={styles.iosButton}
            onPress={() => {
              setTempRole(selectedRole);
              setShowPicker(true);
            }}>
            <Text style={styles.iosButtonText}>{getSelectedRoleLabel()}</Text>
            <Text style={styles.chevronIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}>
          <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.modalButton}>
                  <Text style={styles.cancelText}>
                    {t('common.actions.cancel', 'Cancel')}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {t('users.roleSelector.selectRole', 'Select Role')}
                </Text>
                <TouchableOpacity
                  onPress={handleConfirm}
                  style={styles.modalButton}>
                  <Text style={styles.doneText}>
                    {t('common.actions.done', 'Done')}
                  </Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={tempRole}
                onValueChange={setTempRole}
                style={styles.iosPicker}
                itemStyle={styles.iosPickerItem}>
                {roleOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </SafeAreaView>
          </View>
        </Modal>
      </>
    );
  }

  // Android version
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {t('users.roleSelector.selectRole', 'Select Role')}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRole}
          onValueChange={onRoleChange}
          style={styles.picker}>
          {roleOptions.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#374151',
  },
  // iOS specific styles
  iosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  iosButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  cancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  doneText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
  iosPickerItem: {
    fontSize: 18,
    color: '#374151',
  },
  chevronIcon: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default RoleSelector;
