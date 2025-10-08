import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useTranslation} from 'react-i18next';
import Roles from '../../../../constants/Roles';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  const {t} = useTranslation();

  const roleOptions = [
    {label: t('users.roleSelector.buyer', 'Buyer'), value: Roles.BUYER},
    {label: t('users.roleSelector.seller', 'Seller'), value: Roles.SELLER},
    {label: t('users.roleSelector.partner', 'Partner'), value: Roles.PARTNER},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {t('users.roleSelector.selectRole', 'Select Role')}
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedRole}
          onValueChange={onRoleChange}
          style={styles.picker}
          itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined}>
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
    height: Platform.OS === 'ios' ? 150 : 50,
    color: '#374151',
  },
  pickerItem: {
    fontSize: 16,
    color: '#374151',
  },
});

export default RoleSelector;