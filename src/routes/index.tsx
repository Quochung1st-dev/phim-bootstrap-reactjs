import type { RouteObject } from 'react-router-dom';
import routePath from './routePath';
import PublicLayout from '../layout/PublicLayout';
import TrangChu from '../pages/TrangChu/TrangChu';
import PhimChiTiet from '../pages/PhimChiTiet/PhimChiTiet';
import TimKiem from '../pages/TimKiem/TimKiem';
import TheLoai from '../pages/TheLoai/TheLoai';
import TheLoaiDetail from '../pages/TheLoai/TheLoaiDetail';
import PhimMoi from '../pages/PhimMoi/PhimMoi';


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
        path: routePath.MOVIE_DETAIL(':slug'),
        element: <PhimChiTiet />
      },
    ]
  },
];

export default routes;
