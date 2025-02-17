import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {VisitorDetail} from '../../../../../types/admin';

interface Props {
  visitor: VisitorDetail;
}

const VisitorCard: React.FC<Props> = ({visitor}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.ipContainer}>
          <Text style={styles.ipLabel}>IP Address</Text>
          <Text style={styles.ip} numberOfLines={1} ellipsizeMode="middle">
            {visitor.Visitor_Ip}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Visit Date</Text>
          <Text style={styles.date}>{visitor.dates}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.content}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location</Text>
          <Text style={styles.address} numberOfLines={2}>
            {visitor.Visitor_Address}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Time</Text>
          <Text style={styles.time}>{visitor.Time}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  ipContainer: {
    flex: 2,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  ipLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  ip: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2196F3',
    maxWidth: '100%',
  },
  date: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  content: {
    gap: 12,
  },
  locationContainer: {
    flexDirection: 'column',
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  time: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
});

export default React.memo(VisitorCard);
