
import { apiClient } from '../httpClient';
import type { ApiResponse } from '../httpClient';
import { API_ENDPOINTS } from '../httpEndpoint';
import type { TheLoai } from '../../types/the_loai.types';
import type { Phim } from '../../types/phim.types';


class TheLoaiService {
  constructor() {
    // Constructor có thể được sử dụng để thiết lập cấu hình nếu cần
  }

  async getDanhSachTheLoai(): Promise<ApiResponse<TheLoai[]>> {
    return apiClient.get<TheLoai[]>(API_ENDPOINTS.THELOAI.LIST);
  }

  async getChiTietTheLoai(slug: string): Promise<ApiResponse<Phim[]>> {
    return apiClient.get<Phim[]>(API_ENDPOINTS.THELOAI.DETAIL(slug));
  }

}

export const theLoaiService = new TheLoaiService();