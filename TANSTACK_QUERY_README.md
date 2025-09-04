# TanStack Query Setup Guide

This guide explains how to use TanStack Query (React Query) in the MTOne Mobile App for efficient data fetching, caching, and state management.

## Overview

TanStack Query is configured with:
- **Persistence**: Data is cached in AsyncStorage for offline support
- **Network Awareness**: Automatically pauses queries when offline
- **Retry Logic**: Failed requests are retried with exponential backoff
- **Background Updates**: Data refreshes when app comes back to foreground

## Basic Usage

### 1. Using Custom Hooks

Use the provided custom hooks in `src/hooks/useApi.ts`:

```typescript
import { useApiQuery, useApiMutation } from '../hooks/useApi';

// GET request
const { data, isLoading, error } = useApiQuery(
  ['user', userId],
  () => fetchUser(userId),
  {
    enabled: !!userId, // Only run when userId exists
    staleTime: 1000 * 60 * 5, // 5 minutes
  }
);

// POST/PUT/DELETE mutation
const mutation = useApiMutation(
  (data) => updateUser(data),
  {
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries(['user']);
    },
  }
);
```

### 2. Example Service

See `src/services/userService.ts` for complete examples of:
- Fetching user profiles
- Updating user data
- Paginated property listings

## Key Features

### Persistence
- Data survives app restarts
- Works offline
- Automatic background sync when online

### Network Awareness
- Queries pause when offline
- Resume automatically when back online
- No manual network state management needed

### Error Handling
- Automatic retries with exponential backoff
- Custom error boundaries
- Network error detection

### Performance
- Intelligent caching
- Background refetching
- Request deduplication

## Best Practices

### Query Keys
- Use descriptive, hierarchical keys: `['users', userId, 'posts']`
- Include all variables that affect the data
- Keep keys consistent across components

### Stale Time
- Set appropriate stale times based on data freshness needs
- Static data: longer stale time (5-10 minutes)
- Dynamic data: shorter stale time (30 seconds - 2 minutes)

### Error Handling
```typescript
const { data, error, isError } = useQuery(['data'], fetchData);

if (isError) {
  return <ErrorComponent message={error.message} />;
}
```

### Loading States
```typescript
const { data, isLoading, isFetching } = useQuery(['data'], fetchData);

if (isLoading) return <SkeletonLoader />;
if (isFetching) return <DataWithSpinner data={data} />;
```

## Advanced Usage

### Prefetching
```typescript
const prefetchUser = usePrefetchQuery();
prefetchUser(['user', userId], () => fetchUser(userId));
```

### Manual Cache Updates
```typescript
const setQueryData = useSetQueryData();
setQueryData(['user', userId], newUserData);
```

### Invalidating Queries
```typescript
const invalidateQueries = useInvalidateQueries();
invalidateQueries(['users']); // Invalidates all user-related queries
```

## Configuration

The QueryClient is configured in `src/utils/queryClient.ts` with:
- Default stale time: 5 minutes
- Default cache time: 10 minutes
- Retry attempts: 3
- Network-aware focus management

## Troubleshooting

### Common Issues

1. **Queries not updating**: Check query keys are consistent
2. **Data not persisting**: Ensure AsyncStorage is properly configured
3. **Offline not working**: Verify NetInfo permissions in AndroidManifest.xml
4. **Memory leaks**: Clean up subscriptions in useEffect cleanup

### Debug Tips
- Use React Query DevTools in development
- Check network tab for actual requests
- Monitor AsyncStorage for cached data

## Migration from Other Solutions

If migrating from Redux or Context:
1. Replace state management logic with queries
2. Use mutations for data updates
3. Leverage built-in caching instead of custom solutions
4. Remove manual loading/error states

## Performance Tips

- Use `enabled` option to prevent unnecessary queries
- Implement proper pagination for large datasets
- Use `select` to transform data at query level
- Leverage `keepPreviousData` for smooth pagination
