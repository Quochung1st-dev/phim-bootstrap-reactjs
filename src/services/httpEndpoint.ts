// api/config.ts
// Cấu hình API

const API_BASE_URL = import.meta.env.VITE_SERVER_API_URL || '/api/v1';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const API_ENDPOINTS = {
    // AUTH: {
    //     LOGIN: '/dang-nhap/email-pass',
    //     REGISTER: '/dang-ky',
    //     LOGOUT: '/dang-xuat',
    //     REFRESH_TOKEN: '/refresh-token',
    //     FORGOT_PASSWORD: '/quen-mat-khau',
    //     RESET_PASSWORD: '/dat-lai-mat-khau',
    //     CHECK_EMAIL: '/dang-ky/kiem-tra-email',
    // },
    THELOAI: {
        LIST: '/the-loai',
        DETAIL: (slug: string) => `/the-loai/${slug}`,
    },
    PHIMNOIBAT: {
        LIST: '/phim-noi-bat',
    },
    PHIMMOICAPNHAT: {
        LIST: '/phim-moi-cap-nhat',
    },
    PHIMHAYNHAT: {
        LIST: '/phim-hay-nhat',
    },
    PHIMXEMNHIEUNHAT: {
        LIST: '/phim-xem-nhieu-nhat',
    },
    PHIM: {
        DETAIL: (slug: string) => `/${slug}`,
        PHIMLIENQUAN: (slug: string) => `/phim-lien-quan/${slug}`,
        ACTIONLIKE: (slug: string) => `/phim-action-like/${slug}`,
        ACTIONNOIBAT: (slug: string) => `/phim-action-noi-bat/${slug}`,
    },
    PHIMTIMKIEM: {
        LIST: '/tim-kiem',
    },
    PHIMLISTDANHSACH: {
        LIST: '/danh-sach-phim',
    },
    PHIMTHELOAI: {
        LIST: (slug: string) => `/the-loai/${slug}`,
    }

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
