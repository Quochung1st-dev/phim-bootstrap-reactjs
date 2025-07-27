import { apiClient } from '../httpClient';
import type { ApiResponse } from '../httpClient';
import { API_ENDPOINTS } from '../httpEndpoint';
import type { Phim, PhimLienQuanQueryParams, PhimListResponse, PhimMoiCapNhatQueryParams, PhimTimKiemQueryParams } from '../../types/phim.types';
import type { TheLoaiQueryParams } from '../../types/the_loai.types';


class PhimService {
  constructor() {
    // Constructor có thể được sử dụng để thiết lập cấu hình nếu cần
  }

  async getPhimNoiBat(params: {page?: number, per_page?: number}): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIMNOIBAT.LIST, params);
  }

  async getPhimMoiCapNhat(params: PhimMoiCapNhatQueryParams): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIMMOICAPNHAT.LIST, params);
  }

  async getPhimXemNhieuNhat(params: PhimMoiCapNhatQueryParams): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIMXEMNHIEUNHAT.LIST, params);
  }

  async getPhimHayNhat(params: PhimMoiCapNhatQueryParams): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIMHAYNHAT.LIST, params);
  }

  async getPhimBySlug(slug: string): Promise<ApiResponse<Phim>> {
    return apiClient.get<Phim>(API_ENDPOINTS.PHIM.DETAIL(slug));
  }

  async likePhimAction(slug: string): Promise<ApiResponse<Phim>> {
    return apiClient.get<Phim>(API_ENDPOINTS.PHIM.ACTIONLIKE(slug));
  }

  async noibatPhimAction(slug: string): Promise<ApiResponse<Phim>> {
    return apiClient.get<Phim>(API_ENDPOINTS.PHIM.ACTIONNOIBAT(slug));
  }

  async getPhimListDanhSach(params: {array_id: number[], per_page: number, page: number}): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.post<PhimListResponse>(API_ENDPOINTS.PHIMLISTDANHSACH.LIST, params);
  }

  async getPhimByTheLoai(slug: string , params: TheLoaiQueryParams): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIMTHELOAI.LIST(slug), params );
  }

  async getPhimLienQuan(slug: string , params: PhimLienQuanQueryParams): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIM.PHIMLIENQUAN(slug), params);
  }

  async searchPhim(params: PhimTimKiemQueryParams): Promise<ApiResponse<PhimListResponse>> {
    return apiClient.get<PhimListResponse>(API_ENDPOINTS.PHIMTIMKIEM.LIST, params );
  }

  // Lưu id phim đã xem vào mảng trong localStorage
  async savePhimDaXemLocalStorage(phim: Phim): Promise<void> {
      const MAX_ITEMS = 20;
      let phimDaXem = JSON.parse(localStorage.getItem('phimDaXem') || '[]') as number[];

      // Xoá nếu đã tồn tại để đưa lên đầu
      phimDaXem = phimDaXem.filter(id => id !== phim.id);

      // Thêm vào đầu
      phimDaXem.unshift(phim.id);

      // Giới hạn số lượng phần tử
      if (phimDaXem.length > MAX_ITEMS) {
        phimDaXem = phimDaXem.slice(0, MAX_ITEMS);
      }

      localStorage.setItem('phimDaXem', JSON.stringify(phimDaXem));
  }

  async savePhimLuuTruLocalStorage(phim: Phim): Promise<void> {
      const MAX_ITEMS = 5000; // Tăng limit cho danh sách lưu trữ
      let phimLuuTru = JSON.parse(localStorage.getItem('phimLuuTru') || '[]') as number[];

      // Xoá nếu đã tồn tại để đưa lên đầu
      phimLuuTru = phimLuuTru.filter(id => id !== phim.id);

      // Thêm vào đầu
      phimLuuTru.unshift(phim.id);

      // Giới hạn số lượng phần tử
      if (phimLuuTru.length > MAX_ITEMS) {
        phimLuuTru = phimLuuTru.slice(0, MAX_ITEMS);
      }

      localStorage.setItem('phimLuuTru', JSON.stringify(phimLuuTru));
  }

  // Xóa phim khỏi danh sách lưu trữ
  async removePhimLuuTruLocalStorage(phimId: number): Promise<void> {
      let phimLuuTru = JSON.parse(localStorage.getItem('phimLuuTru') || '[]') as number[];
      phimLuuTru = phimLuuTru.filter(id => id !== phimId);
      localStorage.setItem('phimLuuTru', JSON.stringify(phimLuuTru));
  }

  // Lấy danh sách ID phim đã lưu trữ
  getPhimLuuTruIds(): number[] {
      return JSON.parse(localStorage.getItem('phimLuuTru') || '[]') as number[];
  }

  // Kiểm tra phim có trong danh sách lưu trữ không
  isPhimLuuTru(phimId: number): boolean {
      const phimLuuTru = this.getPhimLuuTruIds();
      return phimLuuTru.includes(phimId);
  }

  
}

export const phimService = new PhimService();
