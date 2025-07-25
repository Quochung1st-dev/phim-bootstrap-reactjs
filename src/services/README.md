# API Services

This directory contains all API-related services for the application.

## Structure

- `httpClient.ts`: Main axios instance with interceptors
- `/api`: Contains all endpoint-specific API services
  - `httpEndpoint.ts`: Example API service for endpoints

## Usage

Import the required API service and use it in your components or hooks:

```typescript
import { getEndpoints } from '../services/api/httpEndpoint';

// In an async function or useEffect
const fetchData = async () => {
  try {
    const endpoints = await getEndpoints();
    // Process data
  } catch (error) {
    // Handle error
  }
};
```
