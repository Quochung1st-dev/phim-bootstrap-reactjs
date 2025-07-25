import type { RouteObject } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import TrangChu from '../pages/TrangChu/TrangChu';


const routes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <TrangChu />
      },
    //   {
    //     path: "dich-vu",
    //     element: <DichVu />
    //   },
    ]
  },
];

export default routes;
