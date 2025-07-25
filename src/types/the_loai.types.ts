

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