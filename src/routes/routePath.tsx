/**
 * routePath.tsx
 * File này chứa các định nghĩa đường dẫn URL (routes) trong ứng dụng.
 * Giúp quản lý tập trung các đường dẫn và dễ dàng sử dụng/thay đổi chúng.
 */

// Các đường dẫn cơ bản
export const routePath = {
  // Trang chủ
  TRANGCHU: '/',

  // Trang tìm kiếm
  TIM_KIEM: '/tim-kiem',

  // Trang thể loại
  THE_LOAI: {
    LIST: '/the-loai',
    DETAIL: (slug: string) => `/the-loai/${slug}`,
  },

  // Trang phim mới
  PHIM_MOI: '/phim-moi',

  // Trang phim xem nhiều
  PHIM_XEM_NHIEU: '/phim-xem-nhieu',

  // Trang phim hay nhất
  PHIM_HAY_NHAT: '/phim-hay-nhat',

  // Trang phim lưu trữ
  PHIM_LUU_TRU: '/phim-luu-tru',

  // Trang chi tiết phim
  MOVIE_DETAIL: (slug: string) => `/${slug}`,

  // Các trang khác (có thể mở rộng sau này)
  // SERVICES: '/dich-vu',
  // ABOUT: '/gioi-thieu',
  // CONTACT: '/lien-he',
};

/**
 * Hàm tạo URL tìm kiếm với các tham số query
 * @param query Từ khóa tìm kiếm
 * @param page Số trang (mặc định là 1)
 * @returns URL tìm kiếm đã được định dạng
 */
export const createSearchUrl = (query: string, page: number = 1): string => {
  return `${routePath.TIM_KIEM}?query=${encodeURIComponent(query)}&page=${page}`;
};

/**
 * Hàm tạo URL thể loại với tham số trang
 * @param slug Slug của thể loại
 * @param page Số trang (mặc định là 1)
 * @returns URL thể loại đã được định dạng
 */
export const createGenreUrl = (slug: string, page: number = 1): string => {
  return `${routePath.THE_LOAI.DETAIL(slug)}?page=${page}`;
};

/**
 * Hàm tạo URL phim mới với tham số trang
 * @param page Số trang (mặc định là 1)
 * @returns URL phim mới đã được định dạng
 */
export const createPhimMoiUrl = (page: number = 1): string => {
  return `${routePath.PHIM_MOI}?page=${page}`;
};

/**
 * Hàm tạo URL phim xem nhiều với tham số trang
 * @param page Số trang (mặc định là 1)
 * @returns URL phim xem nhiều đã được định dạng
 */
export const createPhimXemNhieuUrl = (page: number = 1): string => {
  return `${routePath.PHIM_XEM_NHIEU}?page=${page}`;
};

/**
 * Hàm tạo URL phim hay nhất với tham số trang
 * @param page Số trang (mặc định là 1)
 * @returns URL phim hay nhất đã được định dạng
 */
export const createPhimHayNhatUrl = (page: number = 1): string => {
  return `${routePath.PHIM_HAY_NHAT}?page=${page}`;
};

/**
 * Hàm tạo URL phim lưu trữ với tham số trang
 * @param page Số trang (mặc định là 1)
 * @returns URL phim lưu trữ đã được định dạng
 */
export const createPhimLuuTruUrl = (page: number = 1): string => {
  return `${routePath.PHIM_LUU_TRU}?page=${page}`;
};

export default routePath;
