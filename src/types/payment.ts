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
