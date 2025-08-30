export interface BillingCycleType {
  MONTHLY: 'Monthly';
  YEARLY: 'Yearly';
}

const BillingCycle: BillingCycleType = {
  MONTHLY: 'Monthly',
  YEARLY: 'Yearly',
} as const;

export default BillingCycle;
