// components/TransactionCard.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Transaction} from '../../../../types';
import {convertPaiseToRupees} from '../../../../utils/currency';
import GetIcon, {IconEnum} from '../../../../components/GetIcon';

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

const TransactionCard = React.memo<TransactionCardProps>(
  ({transaction, onPress}) => {
    if (!transaction || !transaction.id) {
      console.warn(
        'TransactionCard received invalid transaction:',
        transaction,
      );
      return null;
    }

    const getStatusColor = (status: string) => {
      if (!status) {
        return '#9E9E9E';
      }

      switch (status.toLowerCase()) {
        case 'captured':
        case 'completed':
          return '#4CAF50';
        case 'failed':
        case 'cancelled':
          return '#F44336';
        case 'pending':
        case 'authorized':
          return '#FF9800';
        default:
          return '#9E9E9E';
      }
    };

    const getMethodIcon = (method: string): IconEnum => {
      if (!method) {
        return 'rupee';
      }
      switch (method.toLowerCase()) {
        case 'upi':
          return 'phone';
        case 'card':
          return 'calendar';
        case 'netbanking':
          return 'globe';
        case 'wallet':
          return 'compass';
        default:
          return 'rupee';
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress?.(transaction)}
        activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {transaction.userName}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {transaction.userEmail}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: getStatusColor(transaction.status)},
            ]}>
            <Text style={styles.statusText}>
              {transaction.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{transaction.planName}</Text>
            <Text style={styles.transactionId}>#{transaction.id}</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {convertPaiseToRupees(transaction.amount)}
            </Text>
            <View style={styles.methodContainer}>
              <GetIcon
                iconName={getMethodIcon(transaction.method)}
                size={16}
                color="#666"
              />
              <Text style={styles.method}>{transaction.method}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <GetIcon iconName="time" size={14} color="#999" />
            <Text style={styles.date}>
              {formatDate(transaction.transactionDate)}
            </Text>
          </View>

          {transaction.razorpayPaymentId && (
            <Text style={styles.paymentId} numberOfLines={1}>
              {transaction.razorpayPaymentId}
            </Text>
          )}
        </View>

        {transaction.errorDescription && (
          <View style={styles.errorContainer}>
            <GetIcon iconName="clear" size={14} color="#F44336" />
            <Text style={styles.errorText} numberOfLines={2}>
              {transaction.errorDescription}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  transactionId: {
    fontSize: 12,
    color: '#999',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  method: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  paymentId: {
    fontSize: 11,
    color: '#999',
    fontFamily: 'monospace',
    maxWidth: 120,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 6,
  },
  errorText: {
    flex: 1,
    fontSize: 11,
    color: '#D32F2F',
    lineHeight: 14,
  },
});

export default TransactionCard;
