// let BASE_URL = 'https://dncrpropertyapi.azurewebsites.net'; //Dev Url
// export let BASE_URL = 'https://devdncrbe.azurewebsites.net';
// let BASE_URL = 'https://dncrpropertyapi.azurewebsites.net';
// export let BASE_URL = 'https://freehostingweb.bsite.net';
export const BASE_URL =
  'https://dncrnewapi-bmbfb6f6awd8b0bd.westindia-01.azurewebsites.net';

// export const BASE_URL =
//   'https://mtestatesapi-f0bthnfwbtbxcecu.southindia-01.azurewebsites.net';

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
  getGroupsByPartnerId: BASE_URL + '/partners/groups-New',
  // addEditClientData: BASE_URL + '/partner/AddEditClientData',
  // getPartnerProperty: BASE_URL + '/partner-properties',
  deleteAgentProperty: BASE_URL + '/partners/agent-properties',
  clients: BASE_URL + '/partners/clients',
  addClients: BASE_URL + '/partners/clients-New',
  addEditClientActivity: BASE_URL + '/partners/addeditclient-activity',
  deleteClientActivity: BASE_URL + '/partners/deleteclient-activity',

  //Partner Properties
  getPartnerProperty: (userId: number) => {
    return BASE_URL + '/users/' + userId + '/partner-properties';
  },
  partnerPropertyNew: BASE_URL + '/partners/partner-properties',
  partnerProperty: BASE_URL + '/partners/properties',
  addPartnerProperty: BASE_URL + '/partners/add-partner-property-new',
  deletePartnerPropertyById: (propertyId: number) => {
    return BASE_URL + '/partner/properties/' + propertyId;
  },

  //Partner Follow-ups
  followUps: BASE_URL + '/partners/follow-ups',

  //Groups
  groups: BASE_URL + '/partners/groups',
  addGroups: BASE_URL + '/partners/addedit-groups',

  //Partner Feedback
  feedback: BASE_URL + '/testimonials/by-createdby',

  //Admin
  getAllProperties: BASE_URL + '/property/getAllProperty',
  getAllUsers: BASE_URL + '/User/GetAllUser',
  getVisitor: BASE_URL + '/User/GetVisitor',
  getAllContact: BASE_URL + '/contactProperty/getAllContact',
};

export default url;
