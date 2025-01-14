//let url1 = 'https://dncrpropertyapi.azurewebsites.net'; //Dev Url
// export let url1 = 'https://devdncrbe.azurewebsites.net';
let url1 = 'https://dncrpropertyapi.azurewebsites.net';

export default {
    //Authentication
    SignUp: url1 + '/api/v1/Account/signup',
    VerifyOTP: url1 + '/api/v1/Account/CheckOTP',
    GetUserByToken: url1 + '/api/v1/Account/GetUserByToken?token=',
    ValidateEmail: url1 + '/api/v1/User/varifyUserbyEmail?email=',
    Login: url1 + '/api/v1/Account/loginUser',
    ForgotPassword: url1 + '/api/v1/Account/ForgetPasword',
    ChangePassword: url1 + '/api/v1/Account/ChangePassword',

    //Property

    FilterSearch: url1 + '/api/v1/property/filterProperty',
    // RecommendedProperty: url1 + '/api/v1/property/getAllProperty?pageNumber=1&pageSize=10',
    RecommendedProperty: url1 + '/api/v1/property/getAllProperty',
    ContactProperty: url1 + '/api/v1/contactProperty/Contact',
    getListOfContactedProperty: url1 + '/api/v1/contactProperty/getAllContactByuserID',

    //Seller

    RegisterSeller: url1 + '/api/v1/Account/registerseller',
    AddProperty: url1 + '/api/v1/property/addProperty',
    GetProperty: url1 + '/api/v1/property/getPropertyByUserid',
    UpdateProperty: url1 + '/api/v1/property/updateProperty',
    deleteProperty: url1 + '/api/v1/property/removeProperty?id=',
    GetInTouch: url1 + '/api/v1/contactProperty/GetinTouch',

//updateprofile
UpdateProfile: url1 + '/api/v1/User/UpdateUser',

//Master Detail
getMasterDetail: url1 + '/api/v1/MasterDetail/getMasterDetailsByMasterName?MasterDetailName=',
getPlaces: url1 + '/api/v1/MasterDetail/getgoogleplaces',
deleteUser: url1 + '/api/v1/User/DeleteUserByUserId',
};
