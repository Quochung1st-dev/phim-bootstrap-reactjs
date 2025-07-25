import type { RouteObject } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import TrangChu from '../pages/TrangChu/TrangChu';
import PhimChiTiet from '../pages/PhimChiTiet/PhimChiTiet';
import TimKiem from '../pages/TimKiem/TimKiem';


const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <TrangChu />
      },
      {
        path: "/tim-kiem",
        element: <TimKiem />
      },
      {
        path: "/:slug",
        element: <PhimChiTiet />
      },
    //   {
    //     path: "dich-vu",
    //     element: <DichVu />
    //   },
    ]
  },
];

export default routes;
