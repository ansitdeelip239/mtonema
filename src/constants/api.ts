// let BASE_URL = 'https://dncrpropertyapi.azurewebsites.net'; //Dev Url
// export let BASE_URL = 'https://devdncrbe.azurewebsites.net';
// let BASE_URL = 'https://dncrpropertyapi.azurewebsites.net';
// export let BASE_URL = 'https://freehostingweb.bsite.net';
export const BASE_URL = 'https://dncrnewapi-bmbfb6f6awd8b0bd.westindia-01.azurewebsites.net';


export default {
  //Authentication
  userSignup: BASE_URL + '/account/user-signup',
  otpVerification: BASE_URL + '/account/otp-verification',

  ValidateEmail: BASE_URL + '/User/varifyUserbyEmail?email=',  //Need to update

  //Users
  users: BASE_URL + '/users',

  //Property
  FilterSearch: BASE_URL + '/property/filterProperty',
  RecommendedProperty: BASE_URL + '/property/getAllProperty',
  ContactProperty: BASE_URL + '/contactProperty/Contact',
  getListOfContactedProperty: BASE_URL + '/contactProperty/getAllContactByuserID',

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
  getMasterDetail: BASE_URL + '/MasterDetail?masterName=',
  getPlaces: BASE_URL + '/MasterDetail/getgoogleplaces',
  deleteUser: BASE_URL + '/User/DeleteUserByUserId',
  searchIntellisense: BASE_URL + '/MasterDetail/SearchIntelligence',

  //Partner
  getAgentImportData: BASE_URL + '/partner/GetAgentImportDataUserId',
  updateAgentProperty: BASE_URL + '/partner/UpdateAgentProperty',
  getClientData: BASE_URL + '/partner/GetClientData',
  getGroupsByPartnerId: BASE_URL + '/partner/GetGroupByPartnerId',
  addEditClientData: BASE_URL + '/partner/AddEditClientData',
  getPartnerProperty: BASE_URL + '/partner/GetPartnerPropertyUserId',
  deleteAgentProperty: BASE_URL + '/partner/DeleteAgentProperty',
  getClientById: BASE_URL + '/partner/GetClientById',
  deleteClientById: BASE_URL + '/partner/DeleteClientDetails',
  addEditClientActivity: BASE_URL + '/partner/AddEditClientActivity',
  deleteClientActivity: BASE_URL + '/partner/DeleteClientActivity',

  //Admin
  getAllProperties: BASE_URL + '/property/getAllProperty',
  getAllUsers: BASE_URL + '/User/GetAllUser',
  getVisitor: BASE_URL + '/User/GetVisitor',
  getAllContact: BASE_URL + '/contactProperty/getAllContact',
};
