const url = {
  auth: {
    userSignup: '/account/user-signup',
    partnerSignup: '/account/partner-signup',
    otpVerification: '/account/otp-verification',
    validateEmail: '/account/check-email',
  },
  users: {
    list: '/users',
    updateProfile: '/User/UpdateUser',
    delete: '/User/DeleteUserByUserId',
  },
  property: {
    filterSearch: '/property/filterProperty',
    recommended: '/property/getAllProperty',
    search: '/properties', // New endpoint for property search
    contact: '/contactProperty/Contact',
    getContactedList: '/contactProperty/getAllContactByuserID',
    getInTouch: '/properties/GetInTouch',
    contacted: '/properties/contacted',
  },
  seller: {
    register: '/Account/registerseller',
    property: {
      add: '/properties',
      get: '/property/getPropertyByUserid',
      update: '/property/updateProperty',
      delete: '/property/removeProperty',
      listByUserId: (userId: number) => `/users/${userId}/properties`,
    },
    getInTouch: '/contactProperty/GetinTouch',
  },
  upload: {
    image: 'https://api.cloudinary.com/v1_1/dncrproperty-com/image/upload',
    video: 'https://api.cloudinary.com/v1_1/proplisting/video/upload',
  },
  masterDetails: {
    get: '/master-details',
    getPlaces: '/master-details/getgoogleplaces',
    searchIntellisense: '/master-details/search-intellisense',
  },
  partners: {
    agentProperties: {
      base: '/partners/agent-properties',
      add: '/partners/add-agent-property-new',
      new: '/partners/agent-properties-New',
      delete: '/partners/agent-properties',
    },
    partnerProperties: {
      base: '/partners/properties',
      new: '/partners/partner-properties',
      add: '/partners/add-partner-property-new',
      getByUserId: (userId: number) => `/users/${userId}/partner-properties`,
      deleteById: (propertyId: number) => `/partner/properties/${propertyId}`,
    },

    clients: {
      list: '/partners/clients',
      getData: '/partners/getclientdata',
      getDataNew: '/partners/clients-data-new',
      add: '/partners/clients-New',
      checkDuplicates: '/partners/clients/check-duplicates',
      getAssignedUsers: (clientId: number) =>
        `/clients/${clientId}/assigned-users`,
      assign: '/assign-client',
      activities: {
        addEdit: '/partners/addeditclient-activity',
        delete: '/partners/deleteclient-activity',
      },
    },

    team: {
      members: '/teammembers',
      getAllMembers: '/partners/team-members',
    },

    groups: {
      list: '/partners/groups-New',
      getByPartnerId: '/partners/groups-New',
      addEdit: '/partners/addedit-groups-New',
    },

    followUps: '/partners/follow-ups',
    feedback: '/testimonials/by-createdby',

    templates: {
      list: '/partners/content-templates',
      add: (userId: number) => `/partners/${userId}/templates`,
      update: (userId: number, templateId: number) =>
        `/partners/${userId}/templates/${templateId}`,
    },
  },
  admin: {
    properties: '/property/getAllProperty',
    users: '/User/GetAllUser',
    visitors: '/User/GetVisitor',
    contacts: '/contactProperty/getAllContact',
  },
  payment: {
    orders: {
      create: '/payment/orders/create',
      status: '/payment/orders/status',
    },
    transactions: '/payment/admin/transactions',
    billing: {
      nextBill: '/payment/next-bill',
      payNextBill: '/payment/pay-next-bill',
    },
    plans: {
      list: '/payment/plans',
      switch: '/payment/switch-plan',
    },
  },
};

export default url;
