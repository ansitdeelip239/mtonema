
export interface StatusType {
  ACTIVE: 'Active';
  INACTIVE: 'Inactive';
  DELETED: 'Deleted';
}

const Status: StatusType = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
} as const;

export default Status;
