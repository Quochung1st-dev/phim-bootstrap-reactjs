import type { RouteObject } from 'react-router-dom';
import routePath from './routePath';
import PublicLayout from '../layout/PublicLayout';
import TrangChu from '../pages/TrangChu/TrangChu';
import PhimChiTiet from '../pages/PhimChiTiet/PhimChiTiet';
import TimKiem from '../pages/TimKiem/TimKiem';
import TheLoai from '../pages/TheLoai/TheLoai';
import TheLoaiDetail from '../pages/TheLoai/TheLoaiDetail';
import PhimMoi from '../pages/PhimMoi/PhimMoi';
import PhimXemNhieu from '../pages/PhimXemNhieu/PhimXemNhieu';
import PhimHayNhat from '../pages/PhimHayNhat/PhimHayNhat';
import PhimLuuTru from '../pages/PhimLuuTru/PhimLuuTru';
import PhimDaXem from '../pages/PhimDaXem/PhimDaXem';


const routes: RouteObject[] = [
  {
    path: routePath.TRANGCHU,
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <TrangChu />
      },
      {
        path: routePath.TIM_KIEM,
        element: <TimKiem />
      },
      {
        path: routePath.THE_LOAI.LIST,
        element: <TheLoai />
      },
      {
        path: routePath.THE_LOAI.DETAIL(':slug'),
        element: <TheLoaiDetail />
      },
      {
        path: routePath.PHIM_MOI,
        element: <PhimMoi />
      },
      {
        path: routePath.PHIM_XEM_NHIEU,
        element: <PhimXemNhieu />
      },
      {
        path: routePath.PHIM_HAY_NHAT,
        element: <PhimHayNhat />
      },
      {
        path: routePath.PHIM_LUU_TRU,
        element: <PhimLuuTru />
      },
      {
        path: routePath.PHIM_DA_XEM,
        element: <PhimDaXem />
      },
      {
        path: routePath.MOVIE_DETAIL(':slug'),
        element: <PhimChiTiet />
      },
    ]
  },
];

export default routes;
