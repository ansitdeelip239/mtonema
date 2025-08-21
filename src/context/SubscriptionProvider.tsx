import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {useAuth} from '../hooks/useAuth';
import PartnerService from '../services/PartnerService';
import Roles from '../constants/Roles';

interface SubscriptionStatus {
  trialStatus: {
    trialStatus: string;
    trialStartDate: string;
    trialEndDate: string;
    remainingDays: number;
    convertedToPaid: boolean;
  };
  orderStatus: {
    orderId: number;
    status: string;
    paymentStatus: string;
    startDate: string;
    endDate: string;
    remainingDays: number;
    planId: number;
    planName: string;
    razorpayOrderId: string;
    amount: number;
    billingCycle: string;
    needsRenewal: boolean;
  };
  hasActiveAccess: boolean;
  trialDaysLeft: number;
  orderDaysLeft: number;
  chosenPlan: {
    planId: number;
    planName: string;
    billingCycle: string;
    amount: number;
  };
}

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

interface PaymentOrderData {
  orderId: number;
  razorpayOrderId: string;
  customerId: string;
  keyId: string;
  remainingTrialDays: number;
  amount: number;
  planId: number;
  planName: string;
  billingCycle: string;
  durationDays: number;
}

interface SubscriptionContextType {
  // State
  subscriptionStatus: SubscriptionStatus | null;
  plans: Plan[];
  hasActiveSubscription: boolean;

  // Loading states
  isLoadingSubscription: boolean;
  isLoadingPlans: boolean;
  isCreatingOrder: boolean;

  // Error states
  subscriptionError: string | null;
  plansError: string | null;
  orderError: string | null;

  // Actions
  checkSubscriptionStatus: (skipLoading?: boolean) => Promise<boolean>;
  fetchPlans: () => Promise<void>;
  createPaymentOrder: (payload: {
    userId: number;
    planId: number;
    customerId: string;
  }) => Promise<PaymentOrderData | null>;
  refreshSubscription: () => Promise<void>;

  // Computed values
  isPartnerOrTeam: boolean;
  isInTrial: boolean;
  isActivePaidSubscription: boolean;
  trialDaysRemaining: number;
  subscriptionDaysRemaining: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionProvider',
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const {user} = useAuth();

  // State
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Loading states
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Error states
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null,
  );
  const [plansError, setPlansError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Computed values
  const isPartnerOrTeam =
    user?.role === Roles.PARTNER || user?.role === Roles.TEAM;

  const isInTrial =
    subscriptionStatus?.trialStatus?.trialStatus?.toLowerCase() === 'active';

  const isActivePaidSubscription =
    subscriptionStatus?.orderStatus?.status?.toLowerCase() === 'active';

  const trialDaysRemaining = subscriptionStatus?.trialDaysLeft || 0;

  const subscriptionDaysRemaining = subscriptionStatus?.orderDaysLeft || 0;

  // Check subscription status
  const checkSubscriptionStatus = useCallback(async (skipLoading: boolean = false): Promise<boolean> => {
    if (!user?.id || !isPartnerOrTeam) {
      setHasActiveSubscription(false);
      return false;
    }

    try {
      if (!skipLoading) {
        setIsLoadingSubscription(true);
      }
      setSubscriptionError(null);

      const response = await PartnerService.getSubscriptionStatus(user.id);

      console.log('Subscription status response:', response);
      

      if (response.success) {
        const data = response.data;
        setSubscriptionStatus(data);
        setHasActiveSubscription(data.hasActiveAccess);
        return data.hasActiveAccess; // Return the fresh status
      } else {
        setSubscriptionError('Failed to fetch subscription status');
        setHasActiveSubscription(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setSubscriptionError('Error checking subscription status');
      setHasActiveSubscription(false);
      return false;
    } finally {
      if (!skipLoading) {
        setIsLoadingSubscription(false);
      }
    }
  }, [user?.id, isPartnerOrTeam]);

  // Fetch payment plans
  const fetchPlans = useCallback(async () => {
    try {
      setIsLoadingPlans(true);
      setPlansError(null);

      const response = await PartnerService.getPaymentPlans();

      if (response.success) {
        setPlans(response.data);
      } else {
        setPlansError('Failed to load plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlansError('Error loading plans');
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  // Create payment order
  const createPaymentOrder = useCallback(
    async (payload: {
      userId: number;
      planId: number;
      customerId: string;
    }): Promise<PaymentOrderData | null> => {
      try {
        setIsCreatingOrder(true);
        setOrderError(null);

        const response = await PartnerService.createPaymentOrder(payload);

        if (response.success) {
          return response.data;
        } else {
          setOrderError('Failed to create payment order');
          return null;
        }
      } catch (error) {
        console.error('Error creating payment order:', error);
        setOrderError('Error creating payment order');
        return null;
      } finally {
        setIsCreatingOrder(false);
      }
    },
    [],
  );

  // Refresh subscription (alias for checkSubscriptionStatus)
  const refreshSubscription = useCallback(async () => {
    await checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  // Auto-check subscription status when user changes or component mounts
  useEffect(() => {
    if (isPartnerOrTeam) {
      checkSubscriptionStatus();
    } else {
      setSubscriptionStatus(null);
      setHasActiveSubscription(false);
      setIsLoadingSubscription(false);
    }
  }, [checkSubscriptionStatus, isPartnerOrTeam]);

  const contextValue: SubscriptionContextType = {
    // State
    subscriptionStatus,
    plans,
    hasActiveSubscription,

    // Loading states
    isLoadingSubscription,
    isLoadingPlans,
    isCreatingOrder,

    // Error states
    subscriptionError,
    plansError,
    orderError,

    // Actions
    checkSubscriptionStatus,
    fetchPlans,
    createPaymentOrder,
    refreshSubscription,

    // Computed values
    isPartnerOrTeam,
    isInTrial,
    isActivePaidSubscription,
    trialDaysRemaining,
    subscriptionDaysRemaining,
  };

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
