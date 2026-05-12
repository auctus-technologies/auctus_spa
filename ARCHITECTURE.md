# Frontend Architecture

This project follows a layered architecture pattern:

```
axios → types → services → store → hook → UI
```

## Layer Structure

### 1. Axios Layer (`src/lib/axios.ts`)
- HTTP client configuration
- Request/Response interceptors
- Error handling
- Base URL configuration

### 2. Types Layer (`src/types/`)
- TypeScript interfaces for all data structures
- API payload definitions
- Response type definitions
- Shared type definitions

**Files:**
- `employee.ts` - Employee related types
- `user.ts` - User related types
- `common.ts` - Shared types (ApiError, RequestStatus, etc.)
- `index.ts` - Type exports

### 3. Services Layer (`src/services/`)
- API call functions
- Business logic for data fetching
- Error handling at service level
- No UI or state management

**Files:**
- `employeeService.ts` - Employee API calls
- `userService.ts` - User API calls
- `index.ts` - Service exports

### 4. Store Layer (`src/store/`)
- Zustand stores for state management
- Holds application state
- Calls services for data fetching
- Manages loading and error states

**Files:**
- `employeeStore.ts` - Employee state management
- `userStore.ts` - User state management
- `index.ts` - Store exports

### 5. Hooks Layer (`src/hooks/`)
- Custom React hooks
- Connects stores to UI components
- Provides loading/error states
- Handles side effects (useEffect)

**Files:**
- `useEmployee.ts` - Employee operations hook
- `useUser.ts` - User operations hook
- `index.ts` - Hook exports

### 6. UI Layer (`src/app/dashboard/...`)
- React components
- Uses hooks for data and operations
- No direct API calls
- No direct state management

## Data Flow

```
UI Component (uses hook)
    ↓
Hook (connects to store)
    ↓
Store (manages state, calls services)
    ↓
Service (makes API calls)
    ↓
Axios (HTTP client)
    ↓
Backend API
```

## Usage Example

### Before (Direct API calls in component):
```tsx
// ❌ Old pattern - messy and hard to maintain
const fetchUser = async () => {
  const res = await fetch(`http://localhost:8000/api/users/${id}`, {
    credentials: 'include'
  });
  const data = await res.json();
  setUser(data);
};
```

### After (Using the new architecture):
```tsx
// ✅ New pattern - clean and maintainable
import { useEmployee } from '@/hooks';
import { EmployeeCreatePayload } from '@/types';

function EmployeeList() {
  // Hook provides data, loading states, and actions
  const {
    employees,
    isLoadingEmployees,
    employeesError,
    createEmployee,
  } = useEmployee();

  const handleCreate = async (payload: EmployeeCreatePayload) => {
    await createEmployee(payload);
  };

  return (
    <div>
      {isLoadingEmployees && <Spinner />}
      {employeesError && <Error message={employeesError} />}
      {employees.map(emp => <EmployeeCard key={emp.id} employee={emp} />)}
    </div>
  );
}
```

## Benefits

1. **Separation of Concerns** - Each layer has a specific responsibility
2. **Testability** - Easy to test each layer independently
3. **Maintainability** - Changes in one layer don't affect others
4. **Type Safety** - Full TypeScript support across all layers
5. **Reusability** - Hooks and stores can be used across multiple components
6. **Developer Experience** - Clear patterns make development faster

## Migration Guide

To migrate existing components:

1. **Identify the data needs** - What data does the component need?
2. **Use the appropriate hook** - `useEmployee()` or `useUser()`
3. **Remove direct API calls** - Delete `fetch()` calls from components
4. **Use hook actions** - Replace API calls with hook functions
5. **Handle loading states** - Use `isLoading` flags from hooks
6. **Handle errors** - Use error states from hooks

## Example Migration

See `src/app/dashboard/users/EmployeeListWithHooks.tsx` for a complete example of the new architecture pattern.
