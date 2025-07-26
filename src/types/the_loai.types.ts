

export interface TheLoaiListResponse {
    items: TheLoai[];
    pagination: {
        total: number; // Tổng số thể loại
        per_page: number; // Số lượng thể loại trên mỗi trang
        current_page: number; // Trang hiện tại
        last_page: number; // Trang cuối cùng
    };
}
export interface TheLoai {
    id: number;
    ten: string;
    slug: string;
    mo_ta: string | null;
}

export interface TheLoaiQueryParams {
    page?: number;
    per_page?: number;
}