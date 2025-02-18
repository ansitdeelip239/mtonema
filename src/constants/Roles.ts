export interface RoleTypes {
  ADMIN: 'Admin';
  PARTNER: 'Partner';
  BUYER: 'Buyer';
  SELLER: 'Seller';
}

const Roles: RoleTypes = {
  ADMIN: 'Admin',
  PARTNER: 'Partner',
  BUYER: 'Buyer',
  SELLER: 'Seller',
} as const;

export default Roles;
