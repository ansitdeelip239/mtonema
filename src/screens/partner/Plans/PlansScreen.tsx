import React, {useCallback, useRef, useState, useMemo} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import ConfirmationModal from '../../../components/ConfirmationModal';
import PartnerService from '../../../services/PartnerService';
import {Plan} from '../../../types/payment';
import Header from '../../../components/Header';
import Colors from '../../../constants/Colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {PlansStackParamList} from '../../../navigator/components/PlansStack';
import GetIcon from '../../../components/GetIcon';
import PlanItem from './components/PlanItem';

type Props = NativeStackScreenProps<PlansStackParamList, 'Plans Screen'>;

const PlansScreen: React.FC<Props> = ({navigation}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    plan: Plan | null;
    loading: boolean;
  }>({
    visible: false,
    plan: null,
    loading: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchPlans = useCallback(async () => {
    try {
      setIsLoadingPlans(true);
      fadeAnim.setValue(0); // Reset animation

      const response = await PartnerService.getPaymentPlans();

      if (response.success) {
        setPlans(response.data);
        // Animate in the list
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400, // Reduced duration
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
  }, [fadeAnim]);

  // Only use useFocusEffect to avoid duplicate calls
  useFocusEffect(
    useCallback(() => {
      fetchPlans();
    }, [fetchPlans]),
  );

  const handleEditPlan = useCallback(
    (plan: Plan) => {
      navigation.navigate('Add Plan Screen', {
        editMode: true,
        planData: plan,
      });
    },
    [navigation],
  );

  const handleDeletePlan = useCallback((plan: Plan) => {
    setDeleteModal({visible: true, plan, loading: false});
  }, []);

  const confirmDeletePlan = useCallback(async () => {
    if (!deleteModal.plan) {
      return;
    }

    setDeleteModal(prev => ({...prev, loading: true}));

    try {
      const response = await PartnerService.deletePaymentPlan(
        deleteModal.plan.id,
      );
      if (response?.success) {
        setDeleteModal({visible: false, plan: null, loading: false});
        fetchPlans(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to delete plan.');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to delete plan.');
    } finally {
      setDeleteModal(prev => ({...prev, loading: false}));
    }
  }, [deleteModal.plan, fetchPlans]);

  const cancelDelete = useCallback(() => {
    setDeleteModal({visible: false, plan: null, loading: false});
  }, []);

  const navigateToAddPlan = useCallback(() => {
    navigation.navigate('Add Plan Screen', {editMode: false});
  }, [navigation]);

  // Memoized header component
  const headerComponent = useMemo(
    () => (
      <Header
        title="Payment Plans"
        children={
          <TouchableOpacity
            style={styles.addButton}
            onPress={navigateToAddPlan}
            activeOpacity={0.8}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        }
      />
    ),
    [navigateToAddPlan],
  );

  // Memoized empty component
  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <GetIcon iconName="plus" size={64} color="#E0E0E0" />
        <Text style={styles.emptyTitle}>No Plans Yet</Text>
        <Text style={styles.emptyMessage}>
          Create your first payment plan to get started
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={navigateToAddPlan}
          activeOpacity={0.8}>
          <Text style={styles.emptyButtonText}>Create Plan</Text>
        </TouchableOpacity>
      </View>
    ),
    [navigateToAddPlan],
  );

  const renderItem = useCallback(
    ({item, index}: {item: Plan; index: number}) => (
      <PlanItem
        item={item}
        index={index}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
        fadeAnim={fadeAnim}
      />
    ),
    [handleEditPlan, handleDeletePlan, fadeAnim],
  );

  const keyExtractor = useCallback((item: Plan) => item.id.toString(), []);

  if (isLoadingPlans) {
    return (
      <View style={styles.container}>
        {headerComponent}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {headerComponent}

      <FlatList
        data={plans}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={emptyComponent}
        contentContainerStyle={
          plans.length === 0 ? styles.emptyList : styles.listContainer
        }
        refreshing={isLoadingPlans}
        onRefresh={fetchPlans}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true} // Performance optimization
        maxToRenderPerBatch={10} // Limit initial render batch
        windowSize={10} // Optimize memory usage
        initialNumToRender={5} // Reduce initial render count
        getItemLayout={(data, index) => ({
          length: 200, // Approximate item height
          offset: 200 * index,
          index,
        })}
      />

      <View style={styles.bottomBarContainer} />

      <ConfirmationModal
        visible={deleteModal.visible}
        title="Delete Plan"
        message={`Are you sure you want to delete the plan "${deleteModal.plan?.planName}"?`}
        onConfirm={confirmDeletePlan}
        onCancel={cancelDelete}
        isLoading={deleteModal.loading}
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 28,
  },
  bottomBarContainer: {
    paddingVertical: 32,
  },
});

export default PlansScreen;
