// Query Key Factory for TanStack Query
// This centralizes all query keys to ensure consistency and avoid typos

export const queryKeys = {
  // Auth related queries
  auth: {
    user: () => ['auth', 'user'],
    profile: (userId?: string) => ['auth', 'profile', userId],
    permissions: () => ['auth', 'permissions'],
    session: () => ['auth', 'session'],
  },

  // User related queries
  users: {
    all: () => ['users'],
    lists: () => [...queryKeys.users.all(), 'list'],
    list: (filters?: Record<string, any>) => [...queryKeys.users.lists(), filters],
    details: () => [...queryKeys.users.all(), 'detail'],
    detail: (id: string) => [...queryKeys.users.details(), id],
    profile: (id: string) => [...queryKeys.users.detail(id), 'profile'],
    settings: (id: string) => [...queryKeys.users.detail(id), 'settings'],
  },

  // Properties related queries
  properties: {
    all: () => ['properties'],
    lists: () => [...queryKeys.properties.all(), 'list'],
    list: (filters?: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
    }) => [
      ...queryKeys.properties.lists(),
      (filters?.page || 1).toString(),
      (filters?.limit || 10).toString(),
      filters?.search || '',
      filters?.category || '',
      filters?.status || '',
    ],
    details: () => [...queryKeys.properties.all(), 'detail'],
    detail: (id: string) => [...queryKeys.properties.details(), id],
    images: (id: string) => [...queryKeys.properties.detail(id), 'images'],
    documents: (id: string) => [...queryKeys.properties.detail(id), 'documents'],
    analytics: (id: string) => [...queryKeys.properties.detail(id), 'analytics'],
  },

  // Partners related queries
  partners: {
    all: () => ['partners'],
    lists: () => [...queryKeys.partners.all(), 'list'],
    list: (filters?: Record<string, any>) => [...queryKeys.partners.lists(), filters],
    details: () => [...queryKeys.partners.all(), 'detail'],
    detail: (id: string) => [...queryKeys.partners.details(), id],
    zones: (partnerId: string) => [...queryKeys.partners.detail(partnerId), 'zones'],
    stats: (partnerId: string) => [...queryKeys.partners.detail(partnerId), 'stats'],
  },

  // Billing/Subscription related queries
  billing: {
    all: () => ['billing'],
    plans: () => [...queryKeys.billing.all(), 'plans'],
    subscriptions: () => [...queryKeys.billing.all(), 'subscriptions'],
    subscription: (id: string) => [...queryKeys.billing.subscriptions(), id],
    invoices: () => [...queryKeys.billing.all(), 'invoices'],
    invoice: (id: string) => [...queryKeys.billing.invoices(), id],
    transactions: () => [...queryKeys.billing.all(), 'transactions'],
    transaction: (id: string) => [...queryKeys.billing.transactions(), id],
  },

  // Master data queries
  master: {
    all: () => ['master'],
    categories: () => [...queryKeys.master.all(), 'categories'],
    locations: () => [...queryKeys.master.all(), 'locations'],
    languages: () => [...queryKeys.master.all(), 'languages'],
    currencies: () => [...queryKeys.master.all(), 'currencies'],
    countries: () => [...queryKeys.master.all(), 'countries'],
    states: (countryId?: string) => [...queryKeys.master.all(), 'states', countryId],
    cities: (stateId?: string) => [...queryKeys.master.all(), 'cities', stateId],
  },

  // Search related queries
  search: {
    all: () => ['search'],
    properties: (query: string) => [...queryKeys.search.all(), 'properties', query],
    users: (query: string) => [...queryKeys.search.all(), 'users', query],
    global: (query: string) => [...queryKeys.search.all(), 'global', query],
  },

  // Notifications
  notifications: {
    all: () => ['notifications'],
    lists: () => [...queryKeys.notifications.all(), 'list'],
    list: (filters?: { read?: boolean; type?: string }) => [
      ...queryKeys.notifications.lists(),
      filters,
    ],
    unread: () => [...queryKeys.notifications.all(), 'unread'],
    count: () => [...queryKeys.notifications.all(), 'count'],
  },

  // App settings and configuration
  app: {
    all: () => ['app'],
    config: () => [...queryKeys.app.all(), 'config'],
    version: () => [...queryKeys.app.all(), 'version'],
    features: () => [...queryKeys.app.all(), 'features'],
  },
};

// Type-safe query key types
export type QueryKeys = typeof queryKeys;

// Helper function to get all keys for a specific domain
export const getQueryKeys = {
  users: () => [
    queryKeys.users.all(),
    queryKeys.users.lists(),
    queryKeys.users.details(),
  ],
  properties: () => [
    queryKeys.properties.all(),
    queryKeys.properties.lists(),
    queryKeys.properties.details(),
  ],
  partners: () => [
    queryKeys.partners.all(),
    queryKeys.partners.lists(),
    queryKeys.partners.details(),
  ],
  billing: () => [
    queryKeys.billing.all(),
    queryKeys.billing.plans(),
    queryKeys.billing.subscriptions(),
    queryKeys.billing.invoices(),
    queryKeys.billing.transactions(),
  ],
  master: () => [
    queryKeys.master.all(),
    queryKeys.master.categories(),
    queryKeys.master.locations(),
    queryKeys.master.languages(),
    queryKeys.master.currencies(),
    queryKeys.master.countries(),
  ],
  search: () => [queryKeys.search.all()],
  notifications: () => [
    queryKeys.notifications.all(),
    queryKeys.notifications.lists(),
    queryKeys.notifications.unread(),
    queryKeys.notifications.count(),
  ],
  app: () => [
    queryKeys.app.all(),
    queryKeys.app.config(),
    queryKeys.app.version(),
    queryKeys.app.features(),
  ],
} as const;
