import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Alert, FlatList, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import ConfirmationModal from '../../../components/ConfirmationModal';
import PartnerService from '../../../services/PartnerService';
import { Plan } from '../../../types/payment';
import { convertPaiseToRupees } from '../../../utils/currency';
import Header from '../../../components/Header';
import Colors from '../../../constants/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlansStackParamList } from '../../../navigator/components/PlansStack';
import GetIcon from '../../../components/GetIcon';

type Props = NativeStackScreenProps<PlansStackParamList, 'Plans Screen'>;

const PlansScreen: React.FC<Props> = ({navigation}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPlans();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPlans();
    }, [])
  );

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await PartnerService.getPaymentPlans();

      if (response.success) {
        setPlans(response.data);
        // Animate in the list
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } else {
        Alert.alert('Error', 'Failed to load plans. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      Alert.alert('Error', 'Failed to load plans. Please try again.');
    } finally {
      setIsLoadingPlans(false);
    }
  };

  // Delete plan handler
  const handleDeletePlan = async () => {
    if (!selectedPlan) return;
    setDeleteLoading(true);
    try {
      const response = await PartnerService.deletePaymentPlan(selectedPlan.id);
      if (response && response.success) {
        setDeleteModalVisible(false);
        setSelectedPlan(null);
        fetchPlans();
      } else {
        Alert.alert('Error', 'Failed to delete plan.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete plan.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Payment Plans" children={
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            navigation.navigate('Add Plan Screen', { editMode: false });
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      } />
      {isLoadingPlans ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.listWrapper, { opacity: fadeAnim }]}>
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <Animated.View 
                style={[
                  styles.planItem,
                  {
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 * (index + 1), 0]
                      })
                    }]
                  }
                ]}
              >
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
                        onPress={() => {
                          navigation.navigate('Add Plan Screen', { editMode: true, planData: item });
                        }}
                        activeOpacity={0.7}
                      >
                        <GetIcon iconName='edit' size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconBtn, styles.deleteBtn]}
                        onPress={() => {
                          setSelectedPlan(item);
                          setDeleteModalVisible(true);
                        }}
                        activeOpacity={0.7}
                      >
                        <GetIcon iconName='delete' size={18} color="#fff" />
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
                        {/* <Text style={styles.currencySymbol}>₹</Text> */}
                        <Text style={styles.planPrice}>{convertPaiseToRupees(item.price)}</Text>
                        <Text style={styles.billingCycle}>/{item.billingCycle.toLowerCase()}</Text>
                      </View>
                      
                      <View style={styles.planFeatures}>
                        <View style={styles.featureItem}>
                          <GetIcon iconName='user' size={16} color="#666" />
                          <Text style={styles.featureText}>{item.maxUsers} users</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <GetIcon iconName='time' size={16} color="#666" />
                          <Text style={styles.featureText}>{item.durationDays} days</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <GetIcon iconName='plus' size={64} color="#E0E0E0" />
                <Text style={styles.emptyTitle}>No Plans Yet</Text>
                <Text style={styles.emptyMessage}>Create your first payment plan to get started</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => navigation.navigate('Add Plan Screen', { editMode: false })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.emptyButtonText}>Create Plan</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={plans.length === 0 ? styles.emptyList : styles.listContainer}
            refreshing={isLoadingPlans}
            onRefresh={fetchPlans}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Plan"
        message={`Are you sure you want to delete the plan "${selectedPlan?.planName}"?`}
        onConfirm={handleDeletePlan}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedPlan(null);
        }}
        isLoading={deleteLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafe',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  listWrapper: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: Colors.MT_PRIMARY_2,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: Colors.MT_PRIMARY_2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  planItem: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
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
    shadowOffset: { width: 0, height: 2 },
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
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.MT_PRIMARY_2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.MT_PRIMARY_2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
});

export default PlansScreen;
