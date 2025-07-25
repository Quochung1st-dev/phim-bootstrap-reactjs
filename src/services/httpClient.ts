// api/httpClient.ts
// HTTP Client sử dụng Fetch API

import { API_CONFIG } from './httpEndpoint';
import { toast } from 'react-toastify';

// Interface định nghĩa response từ API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  statusCode?: number;
}

export interface ApiUploadFileResponse <T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
  statusCode?: number;
}



class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  // biến này có thể được sử dụng trong tương lai cho timeout của request
  private useCredentials: boolean = false; // Mặc định không dùng credentials
  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = config.headers;
  }
  
  /**
   * Bật/tắt chế độ sử dụng credentials trong request
   * @param use - true để bật, false để tắt
   */
  public setUseCredentials(use: boolean): void {
    this.useCredentials = use;
  }

  // Hàm lấy token từ localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
  // Hàm thiết lập headers, bao gồm token và x-key
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      ...this.defaultHeaders as Record<string, string>,
      ...(customHeaders as Record<string, string> || {}),
      'x-key': import.meta.env.VITE_API_X_KEY || 'keykey', // Thêm x-key vào mọi request
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Hàm xử lý lỗi từ API
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // Nếu response không phải JSON, trả về lỗi
    console.log('Response status:', response);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        message: 'Response không phải định dạng JSON',
        statusCode: response.status,
      };
    }

    // Parse JSON từ response
    const data = await response.json();

    // Nếu request thành công
    if (response.ok) {
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Thành công',
        statusCode: response.status,
      };
    }
    
    // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
    if (response.status === 401) {
      // Xóa token và user data khi hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Chuyển hướng về trang chủ ngay lập tức
      // toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      // Removed direct navigation from httpClient
      // window.location.href = '/'; // Ensure this line is removed
    }

    // Trả về lỗi
    return {
      success: false,
      message: data.message || 'Có lỗi xảy ra',
      errors: data.errors || {},
      statusCode: response.status,
    };
  }

  // Phương thức GET
  public async get<T>(endpoint: string, params?: Record<string, any>, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {
      // Xử lý query params
      const url = new URL(`${this.baseURL}${endpoint}`);
      console.log('GET request URL:', url.toString());
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
          }
        });
      }      // Thực hiện request
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(customHeaders),
        ...(this.useCredentials ? { credentials: 'include' } : {}),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ',
      };
    }
  }

  // Phương thức POST
  public async post<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders({
          ...customHeaders,
        }),
        ...(this.useCredentials ? { credentials: 'include' } : {}),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      toast.error('Lỗi kết nối đến máy chủ');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ',
      };
    }
  }

  // Phương thức PUT
  public async put<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(customHeaders),
        ...(this.useCredentials ? { credentials: 'include' } : {}),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      toast.error('Lỗi kết nối đến máy chủ');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ',
      };
    }
  }

  // Phương thức DELETE
  public async delete<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(customHeaders),
        ...(this.useCredentials ? { credentials: 'include' } : {}),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      toast.error('Lỗi kết nối đến máy chủ');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ',
      };
    }
  }

  // Phương thức PATCH
  public async patch<T>(endpoint: string, data?: any, customHeaders?: HeadersInit): Promise<ApiResponse<T>> {
    try {      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(customHeaders),
        ...(this.useCredentials ? { credentials: 'include' } : {}),
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      toast.error('Lỗi kết nối đến máy chủ');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ',
      };
    }
  }
  // Phương thức upload file chuyên dụng
  public async uploadFile(endpoint: string, formData: FormData): Promise<ApiUploadFileResponse> {
    try {
      const headers = this.getHeaders() as Record<string, string>;
      delete headers['Content-Type']; // Let browser set content-type

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      return this.handleResponse<{
        url: string;
        fileName: string;
        fileSize: number;
        fileType: string;
      }>(response) as Promise<ApiUploadFileResponse>;
    } catch (error) {
      toast.error('Lỗi kết nối đến máy chủ');
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi kết nối đến máy chủ',
      };
    }
  }
}

// Export instance của HttpClient với cấu hình mặc định
export const apiClient = new HttpClient(API_CONFIG);
// Mặc định không sử dụng credentials để tránh lỗi CORS
// Nếu server hỗ trợ, bạn có thể bật lại bằng cách gọi: apiClient.setUseCredentials(true);
