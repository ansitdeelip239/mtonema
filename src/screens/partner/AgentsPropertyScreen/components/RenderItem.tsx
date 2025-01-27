import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AgentData} from '../../../../types';
import formatCurrency from '../../../../utils/currency';
import {IconButton, Surface} from 'react-native-paper';
import Colors from '../../../../constants/Colors';
import GetIcon from '../../../../components/GetIcon';

const renderItem = ({item}: {item: AgentData}) => {
  const onEdit = (id: number) => {
    console.log('Edit:', id);
  };

  const onDelete = (id: number) => {
    console.log('Delete:', id);
  };

  return (
    <Surface style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{item.AgentName || 'N/A'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.Negotiable ? 'Negotiable' : 'Fixed Price'}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={() => GetIcon({iconName: 'edit', color: Colors.main})}
            size={20}
            onPress={() => onEdit(item.Id)}
            iconColor={Colors.main}
            style={styles.actionButton}
          />
          <IconButton
            icon={() => GetIcon({iconName: 'delete', color: Colors.red})}
            size={20}
            onPress={() => onDelete(item.Id)}
            iconColor={Colors.red || '#ff4444'}
            style={styles.actionButton}
          />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.contentSection}>
        <View style={styles.row}>
          <Text style={styles.label}>BHK Type:</Text>
          <Text style={styles.value}>
            {item.FlatSize?.MasterDetailName || 'Not Specified'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{item.PropertyLocation || 'N/A'}</Text>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Demand Price:</Text>
            <Text style={[styles.value, styles.priceText]}>
              {formatCurrency(item.DemandPrice) || 'N/A'}
            </Text>
          </View>
          <View style={[styles.row, styles.securityDeposit]}>
            <Text style={styles.label}>Security Deposit:</Text>
            <Text style={[styles.value, styles.priceText]}>
              {formatCurrency(item.SecurityDepositAmount) || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date Added:</Text>
          <Text style={styles.value}>
            {item.CreatedOn
              ? new Date(item.CreatedOn).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'N/A'}
          </Text>
        </View>
      </View>

      {item.PropertyNotes && (
        <>
          <View style={styles.divider} />
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{item.PropertyNotes}</Text>
          </View>
        </>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
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
  securityDeposit: {
    marginBottom: 0,
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
  priceSection: {
    backgroundColor: '#F8F9FA',
    margin: 0,
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
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

export default renderItem;
