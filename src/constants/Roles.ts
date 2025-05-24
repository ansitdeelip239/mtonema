export interface RoleTypes {
  ADMIN: 'Admin';
  PARTNER: 'Partner';
  BUYER: 'Buyer';
  SELLER: 'Seller';
  TEAM: 'TeamMember';
}

const Roles: RoleTypes = {
  ADMIN: 'Admin',
  PARTNER: 'Partner',
  BUYER: 'Buyer',
  SELLER: 'Seller',
  TEAM: 'TeamMember',
} as const;

export default Roles;
