import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Plan } from '../../../../types/payment';


export const PlanCard = React.memo(
  ({
    plan,
    isSelected,
    onSelect,
    formatPrice,
  }: {
    plan: Plan;
    isSelected: boolean;
    onSelect: (plan: Plan) => void;
    formatPrice: (price: number) => string;
  }) => (
    <TouchableOpacity
      style={[styles.planCard, isSelected && styles.selectedPlanCard]}
      onPress={() => onSelect(plan)}
      activeOpacity={0.8}>
      <View style={styles.planHeader}>
        <Text style={[styles.planName, isSelected && styles.selectedPlanText]}>
          {plan.planName}
        </Text>
        <View
          style={[
            styles.selectionIndicator,
            isSelected && styles.selectedIndicator,
          ]}
        />
      </View>

      <Text style={styles.planPrice}>
        {formatPrice(plan.price)}
        <Text style={styles.billingCycle}> / {plan.billingCycle}</Text>
      </Text>

      <Text style={styles.planDescription}>{plan.description}</Text>

      <View style={styles.planFeatures}>
        <Text style={styles.feature}>• Max Users: {plan.maxUsers}</Text>
        <Text style={styles.feature}>• Duration: {plan.durationDays} days</Text>
        {plan.isTrial && <Text style={styles.trialBadge}>Trial Plan</Text>}
      </View>
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlanCard: {
    borderColor: '#53a20e',
    backgroundColor: '#f8fff8',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  selectedPlanText: {
    color: '#53a20e',
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  selectedIndicator: {
    borderColor: '#53a20e',
    backgroundColor: '#53a20e',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53a20e',
    marginBottom: 8,
  },
  billingCycle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  planFeatures: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  trialBadge: {
    fontSize: 12,
    color: '#ff6b35',
    fontWeight: 'bold',
    marginTop: 5,
  },
});
