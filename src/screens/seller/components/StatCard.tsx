import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import GetIcon from '../../../components/GetIcon';
import {IconEnum} from '../../../components/GetIcon';

interface StatCardProps {
  icon: IconEnum;
  value: string | number;
  label: string;
  color?: string;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color = '#6366f1',
  bgColor,
}) => (
  <View style={[styles.container, {backgroundColor: bgColor || 'white'}]}>
    <View style={[styles.iconContainer, {backgroundColor: `${color}15`}]}>
      <GetIcon iconName={icon} size={20} color={color} />
    </View>
    <Text style={[styles.value, {color}]}>
      {value}
    </Text>
    <Text style={styles.label}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginHorizontal: 4,
    minWidth: 140,
    maxWidth: 180,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
