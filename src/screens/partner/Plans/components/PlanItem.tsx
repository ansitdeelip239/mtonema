import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import GetIcon from '../../../../components/GetIcon';
import {convertPaiseToRupees} from '../../../../utils/currency';
import React from 'react';
import {Plan} from '../../../../types/payment';

// Extract PlanItem as a separate memoized component
const PlanItem = React.memo<{
  item: Plan;
  index: number;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
  fadeAnim: Animated.Value;
}>(({item, onEdit, onDelete, fadeAnim}) => {
  return (
    <Animated.View
      style={[
        styles.planItem,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0], // Reduced animation distance
              }),
            },
          ],
        },
      ]}>
      <View style={styles.planGradient}>
        <View style={styles.cardHeader}>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>
              {item.isTrial ? 'TRIAL' : 'PREMIUM'}
            </Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.iconBtn, styles.editBtn]}
              onPress={() => onEdit(item)}
              activeOpacity={0.7}>
              <GetIcon iconName="edit" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, styles.deleteBtn]}
              onPress={() => onDelete(item)}
              activeOpacity={0.7}>
              <GetIcon iconName="delete" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.planContent}>
          <Text style={styles.planName}>{item.planName}</Text>
          {item.description && (
            <Text style={styles.planDescription}>{item.description}</Text>
          )}

          <View style={styles.planDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.planPrice}>
                {convertPaiseToRupees(item.price)}
              </Text>
              <Text style={styles.billingCycle}>
                /{item.billingCycle.toLowerCase()}
              </Text>
            </View>

            <View style={styles.planFeatures}>
              <View style={styles.featureItem}>
                <GetIcon iconName="user" size={16} color="#666" />
                <Text style={styles.featureText}>{item.maxUsers} users</Text>
              </View>
              <View style={styles.featureItem}>
                <GetIcon iconName="time" size={16} color="#666" />
                <Text style={styles.featureText}>{item.durationDays} days</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  planItem: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  planGradient: {
    backgroundColor: '#fff',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  editBtn: {
    backgroundColor: '#2196F3',
  },
  deleteBtn: {
    backgroundColor: '#F44336',
  },
  planContent: {
    gap: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  planDetails: {
    gap: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4CAF50',
    letterSpacing: -1,
  },
  billingCycle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  planFeatures: {
    flexDirection: 'row',
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default PlanItem;
