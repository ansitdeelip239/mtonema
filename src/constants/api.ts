// let BASE_URL = 'https://dncrpropertyapi.azurewebsites.net'; //Dev Url
// export let BASE_URL = 'https://devdncrbe.azurewebsites.net';
// let BASE_URL = 'https://dncrpropertyapi.azurewebsites.net';
// export let BASE_URL = 'https://freehostingweb.bsite.net';
export const BASE_URL =
  'https://dncrnewapi-bmbfb6f6awd8b0bd.westindia-01.azurewebsites.net';

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
  // updateAgentProperty: BASE_URL + '/partner/UpdateAgentProperty',
  getClientData: BASE_URL + '/partners/getclientdata',
  getGroupsByPartnerId: BASE_URL + '/partners/groups',
  // addEditClientData: BASE_URL + '/partner/AddEditClientData',
  // getPartnerProperty: BASE_URL + '/partner-properties',
  deleteAgentProperty: BASE_URL + '/partners/agent-properties',
  clients: BASE_URL + '/partners/clients',
  addEditClientActivity: BASE_URL + '/partners/addeditclient-activity',
  deleteClientActivity: BASE_URL + '/partners/deleteclient-activity',

  //Partner Follow-ups
  followUps: BASE_URL + '/partners/follow-ups',

  //Admin
  getAllProperties: BASE_URL + '/property/getAllProperty',
  getAllUsers: BASE_URL + '/User/GetAllUser',
  getVisitor: BASE_URL + '/User/GetVisitor',
  getAllContact: BASE_URL + '/contactProperty/getAllContact',
};

export default url;
