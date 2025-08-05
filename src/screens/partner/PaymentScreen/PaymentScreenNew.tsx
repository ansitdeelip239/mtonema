import React, {useState, useEffect} from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import {View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView} from 'react-native';
import PartnerService from '../../../services/PartnerService';
import {useAuth} from '../../../hooks/useAuth';

interface Plan {
  id: number;
  planName: string;
  description: string;
  price: number;
  billingCycle: string;
  durationDays: number;
  maxUsers: number;
  isTrial: boolean;
  razorpayItemId: string;
}

const PaymentScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const {user} = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await PartnerService.getPaymentPlans();
      if (response.success) {
        setPlans(response.data);
        // Select the first plan by default
        if (response.data.length > 0) {
          setSelectedPlan(response.data[0]);
        }
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

  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const handlePayment = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan first.');
      return;
    }

    setIsLoading(true);

    try {
      // Create order first
      const orderResponse = await PartnerService.createPaymentOrder({
        userId: parseInt(user.id, 10),
        planId: selectedPlan.id,
        customerId: '', // Empty for new customers
      });

      if (!orderResponse.success) {
        Alert.alert('Error', 'Failed to create payment order. Please try again.');
        return;
      }

      const orderData = orderResponse.data;

      // Prepare Razorpay options with dynamic data
      const options = {
        description: `${orderData.planName} - ${orderData.billingCycle}`,
        image: 'https://i.imgur.com/3g7nmJC.png', // Replace with your logo URL
        currency: 'INR',
        key: orderData.keyId,
        amount: orderData.amount,
        name: 'MT One',
        order_id: orderData.razorpayOrderId,
        prefill: {
          email: user.email || 'ansitdeelip239@gmail.com',
          contact: user.phone || '7485898570',
          name: user.name || 'User',
        },
        theme: {color: '#53a20e'},
      };

      // Open Razorpay checkout
      RazorpayCheckout.open(options)
        .then(data => {
          // Handle success
          Alert.alert(
            'Payment Success',
            `Payment ID: ${data.razorpay_payment_id}`,
          );
          console.log('Payment Success:', data);
          console.log('Order Data:', orderData);
        })
        .catch(error => {
          // Handle error or failure
          Alert.alert(
            'Payment Failed',
            error.description || 'Something went wrong',
          );
          console.log('Payment Error:', error);
        });
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPlans) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#53a20e" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Your Plan</Text>

      {/* Plan Selection */}
      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan?.id === plan.id && styles.selectedPlanCard,
            ]}
            onPress={() => setSelectedPlan(plan)}
            activeOpacity={0.8}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.planName}</Text>
              <Text style={styles.planPrice}>{formatPrice(plan.price)}</Text>
              <Text style={styles.planCycle}>/{plan.billingCycle}</Text>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.planFeature}>• Max {plan.maxUsers} users</Text>
              <Text style={styles.planFeature}>• {plan.durationDays} days duration</Text>
            </View>
            {selectedPlan?.id === plan.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedText}>✓ Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Button */}
      {selectedPlan && (
        <View style={styles.paymentSection}>
          <View style={styles.paymentCard}>
            <Text style={styles.cardTitle}>Payment Summary</Text>
            <Text style={styles.selectedPlanName}>{selectedPlan.planName}</Text>
            <Text style={styles.amount}>{formatPrice(selectedPlan.price)}</Text>
            <Text style={styles.description}>{selectedPlan.billingCycle} subscription</Text>

            <TouchableOpacity
              style={[styles.payButton, isLoading && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={isLoading}
              activeOpacity={0.8}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.payButtonText}>Pay with Razorpay</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  plansContainer: {
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedPlanCard: {
    borderColor: '#53a20e',
    backgroundColor: '#f9fff9',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#53a20e',
  },
  planCycle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 2,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  planFeatures: {
    marginBottom: 10,
  },
  planFeature: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  selectedIndicator: {
    alignItems: 'center',
    marginTop: 10,
  },
  selectedText: {
    color: '#53a20e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentSection: {
    marginTop: 10,
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  selectedPlanName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#53a20e',
    marginBottom: 5,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#53a20e',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  payButton: {
    backgroundColor: '#53a20e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
