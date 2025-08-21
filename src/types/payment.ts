export interface Plan {
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

export interface NextBillResponse {
  nextBill: {
    amount: number;
    currency: string;
    billingCycle: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    partner: {
      id: number;
      name: string;
      email: string;
      phone: string;
      plan: {
        id: number;
        planName: string;
        price: number;
      };
    };
    teamMembers: {
      id: number;
      name: string;
      email: string;
      phone: string;
      plan: {
        id: number;
        planName: string;
        price: number;
      };
    }[];
    totalAmountBreakdown: {
      partnerAmount: number;
      teamMemberAmount: number;
    };
  };
  transactionHistory: {
    id: number;
    userId: number;
    paidAccountId: number;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    planId: number;
    status: number;
    statusName: string;
    amount: number;
    transactionType: number;
    transactionTypeName: string;
    transactionDate: string;
    paymentDate?: string;
    eventType: number;
    eventTypeName: string;
    reason?: string;
    razorpayInvoiceId?: string;
    createdOn: string;
  }[];
}

export interface PayNextBillData {
  orderId: number;
  razorpayOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
  partnerName: string;
  partnerEmail: string;
  description: string;
  planId: number;
  planName: string;
  billingCycle: string;
  durationDays: number;
  paymentLink: string;
}
