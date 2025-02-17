interface Roles {
  ADMIN: 'Admin';
  PARTNER: 'Partner';
  BUYER: 'User';
  SELLER: 'Seller';
}

const Roles = {
  ADMIN: 'Admin',
  PARTNER: 'Partner',
  BUYER: 'User',
  SELLER: 'Seller',
} as const;

export default Roles;
