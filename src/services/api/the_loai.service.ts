
import { apiClient } from '../httpClient';
import type { ApiResponse } from '../httpClient';
import { API_ENDPOINTS } from '../httpEndpoint';
import type { TheLoaiListResponse, TheLoaiQueryParams } from '../../types/the_loai.types';
import type { PhimListResponse } from '../../types/phim.types';


class TheLoaiService {
  constructor() {
    // Constructor có thể được sử dụng để thiết lập cấu hình nếu cần
  }

  async getDanhSachTheLoai(params?: TheLoaiQueryParams): Promise<ApiResponse<TheLoaiListResponse>> {
    return apiClient.get<TheLoaiListResponse>(API_ENDPOINTS.THELOAI.LIST,  params );
  }

  async getDanhSachTheLoaiRandom(params?: TheLoaiQueryParams): Promise<ApiResponse<TheLoaiListResponse>> {
    return apiClient.get<TheLoaiListResponse>(API_ENDPOINTS.THELOAI.RANDOM, params);
  }

  async getChiTietTheLoai(slug: string, params?: { page?: number; per_page?: number }): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.THELOAI.DETAIL(slug), params);
  }

}

export const theLoaiService = new TheLoaiService();