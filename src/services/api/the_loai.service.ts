
import { apiClient } from '../httpClient';
import type { ApiResponse } from '../httpClient';
import { API_ENDPOINTS } from '../httpEndpoint';
import type { TheLoai, TheLoaiListResponse, TheLoaiQueryParams } from '../../types/the_loai.types';
import type { Phim } from '../../types/phim.types';


class TheLoaiService {
  constructor() {
    // Constructor có thể được sử dụng để thiết lập cấu hình nếu cần
  }

  async getDanhSachTheLoai(params?: TheLoaiQueryParams): Promise<ApiResponse<TheLoaiListResponse>> {
    return apiClient.get<TheLoaiListResponse>(API_ENDPOINTS.THELOAI.LIST,  params );
  }

  async getChiTietTheLoai(slug: string): Promise<ApiResponse<Phim[]>> {
    return apiClient.get<Phim[]>(API_ENDPOINTS.THELOAI.DETAIL(slug));
  }

}

export const theLoaiService = new TheLoaiService();