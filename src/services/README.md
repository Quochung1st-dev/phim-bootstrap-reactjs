# Services

Thư mục này chứa các service functions để tương tác với APIs và external services.

## Mục đích:
- API calls và HTTP requests
- External service integrations
- Data fetching logic
- Business logic liên quan đến backend

## Ví dụ cấu trúc:
```
services/
├── api/
│   ├── auth.ts
│   ├── users.ts
│   ├── products.ts
│   └── index.ts
├── http.ts (axios instance)
└── storage.ts
```

## Ví dụ service:
```typescript
// services/api/auth.ts
import { http } from '../http';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await http.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await http.post('/auth/logout');
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await http.get('/auth/me');
    return response.data;
  },
};
```
