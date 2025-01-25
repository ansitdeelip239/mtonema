import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AgentData} from '../../../../types';
import formatCurrency from '../../../../utils/currency';

const renderItem = ({item}: {item: AgentData}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.AgentName || 'N/A'}</Text>
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
      <View style={styles.row}>
        <Text style={styles.label}>Demand Price:</Text>
        <Text style={styles.value}>{formatCurrency(item.DemandPrice) || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Security Deposit:</Text>
        <Text style={styles.value}>
          {formatCurrency(item.SecurityDepositAmount) || 'N/A'}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Negotiable:</Text>
        <Text style={styles.value}>
          {item.Negotiable !== undefined
            ? item.Negotiable
              ? 'Yes'
              : 'No'
            : 'N/A'}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date Added:</Text>
        <Text style={styles.value}>
            {item.CreatedOn ? new Date(item.CreatedOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
        </Text>
      </View>
      {item.PropertyNotes && (
        <View style={styles.notes}>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.value}>{item.PropertyNotes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    width: 120,
    color: '#666',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  notes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default renderItem;
