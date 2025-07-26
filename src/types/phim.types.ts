import type { TheLoai } from './the_loai.types';

export interface PhimListResponse {
    items: Phim[];
    pagination: {
        total: number; // Tổng số phim
        per_page: number; // Số lượng phim trên mỗi trang
        current_page: number; // Trang hiện tại
        last_page: number; // Trang cuối cùng
    };
}
export interface Phim {
    id: number;
    ten: string;
    slug: string;
    mo_ta: string | null;
    hinh_anh: string;
    hinh_anh_thumb: string;
    the_loai: TheLoai[];
    link_online: string;
    link_phim_local: string | null;
    view: number;
    likes: number;
    created_at: Date;
}

export interface hinh_anh_thumb {
    link: string;
}

export interface PhimTimKiemQueryParams {
    query: string;
    page?: number;
    per_page?: number;
}

export interface PhimMoiCapNhatQueryParams {
    page?: number;
    per_page?: number;
}

export interface PhimLienQuanQueryParams {
    page?: number;
    per_page?: number;
}
