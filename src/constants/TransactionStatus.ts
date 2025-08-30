export interface TransactionStatusType {
  CAPTURED: 'Captured';
  FAILED: 'Failed';
  AUTHORIZED: 'Authorized';
  PAUSED: 'Paused';
  COMPLETED: 'Completed';
  HALTED: 'Halted';
  CANCELLED: 'Cancelled';
  PRORATED_PENDING: 'Prorated Pending';
  PRORATED: 'Prorated';
}

const TransactionStatus: TransactionStatusType = {
  CAPTURED: 'Captured',
  FAILED: 'Failed',
  AUTHORIZED: 'Authorized',
  PAUSED: 'Paused',
  COMPLETED: 'Completed',
  HALTED: 'Halted',
  CANCELLED: 'Cancelled',
  PRORATED_PENDING: 'Prorated Pending',
  PRORATED: 'Prorated',
} as const;

export default TransactionStatus;
