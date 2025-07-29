import config from '../config';

export const BASE_URL = config.apiUrl;

const url = {
  //Authentication
  userSignup: BASE_URL + '/account/user-signup',
  otpVerification: BASE_URL + '/account/otp-verification',

  ValidateEmail: BASE_URL + '/account/check-email', //Need to update

  //Users
  users: BASE_URL + '/users',

  //Property
  FilterSearch: BASE_URL + '/property/filterProperty',
  RecommendedProperty: BASE_URL + '/property/getAllProperty',
  ContactProperty: BASE_URL + '/contactProperty/Contact',
  getListOfContactedProperty:
    BASE_URL + '/contactProperty/getAllContactByuserID',

  //Seller
  RegisterSeller: BASE_URL + '/Account/registerseller',
  AddProperty: BASE_URL + '/property/addProperty',
  GetProperty: BASE_URL + '/property/getPropertyByUserid',
  UpdateProperty: BASE_URL + '/property/updateProperty',
  deleteProperty: BASE_URL + '/property/removeProperty',
  GetInTouch: BASE_URL + '/contactProperty/GetinTouch',

  //updateprofile
  UpdateProfile: BASE_URL + '/User/UpdateUser',

  //cloudinary
  imageUpload: 'https://api.cloudinary.com/v1_1/dncrproperty-com/image/upload',
  videoUpload: 'https://api.cloudinary.com/v1_1/proplisting/video/upload',

  //Master Detail
  // getMasterDetail: BASE_URL + '/MasterDetail/getMasterDetailsByMasterName?MasterDetailName=',
  getMasterDetail: BASE_URL + '/master-details',
  getPlaces: BASE_URL + '/master-details/getgoogleplaces',
  deleteUser: BASE_URL + '/User/DeleteUserByUserId',
  searchIntellisense: BASE_URL + '/master-details/search-intellisense',

  //Partner
  agentProperties: BASE_URL + '/partners/agent-properties',
  addAgentProperties: BASE_URL + '/partners/add-agent-property-new',
  agentPropertiesNew: BASE_URL + '/partners/agent-properties-New',
  // updateAgentProperty: BASE_URL + '/partner/UpdateAgentProperty',
  getClientData: BASE_URL + '/partners/getclientdata',
  getDuplicateClients: BASE_URL + '/partners/clients/check-duplicates',
  getGroupsByPartnerId: BASE_URL + '/partners/groups-New',
  // addEditClientData: BASE_URL + '/partner/AddEditClientData',
  // getPartnerProperty: BASE_URL + '/partner-properties',
  deleteAgentProperty: BASE_URL + '/partners/agent-properties',
  clients: BASE_URL + '/partners/clients',
  getClients: BASE_URL + '/partners/clients-data-new',
  addClients: BASE_URL + '/partners/clients-New',
  addEditClientActivity: BASE_URL + '/partners/addeditclient-activity',
  deleteClientActivity: BASE_URL + '/partners/deleteclient-activity',
  getPartnerProperty: (userId: number) => {
    return BASE_URL + '/users/' + userId + '/partner-properties';
  },
  partnerPropertyNew: BASE_URL + '/partners/partner-properties',
  partnerProperty: BASE_URL + '/partners/properties',
  addPartnerProperty: BASE_URL + '/partners/add-partner-property-new',
  deletePartnerPropertyById: (propertyId: number) => {
    return BASE_URL + '/partner/properties/' + propertyId;
  },
  getAssignedUsers: (clientId: number) => {
    return BASE_URL + '/clients/' + clientId + '/assigned-users';
  },
  teamMembers: BASE_URL + '/teammembers',
  getAllTeamMembers: BASE_URL + '/partners/team-members',
  assignClient: BASE_URL + '/assign-client',
  followUps: BASE_URL + '/partners/follow-ups',
  groups: BASE_URL + '/partners/groups-New',
  // addGroups: BASE_URL + '/partners/addedit-groups',
  addGroups: BASE_URL + '/partners/addedit-groups-New',
  feedback: BASE_URL + '/testimonials/by-createdby',
  contentTemplates: BASE_URL + '/partners/content-templates',
  addContentTemplate: (userId: number) => {
    return BASE_URL + '/partners/' + userId + '/templates';
  },
  updateContentTemplate: (userId: number, templateId: number) => {
    return BASE_URL + '/partners/' + userId + '/templates/' + templateId;
  },

  //Admin
  getAllProperties: BASE_URL + '/property/getAllProperty',
  getAllUsers: BASE_URL + '/User/GetAllUser',
  getVisitor: BASE_URL + '/User/GetVisitor',
  getAllContact: BASE_URL + '/contactProperty/getAllContact',
};

export default url;
