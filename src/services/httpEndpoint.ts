// api/config.ts
// Cấu hình API

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL || 'http://127.0.0.1:8000/api/v1';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

export const API_ENDPOINTS = {
    BAOHANH: {
        KIEMTRABAOHANH: '/kiem-tra-bao-hanh',
    },

  // Thêm các endpoint khác khi cần thiết
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
