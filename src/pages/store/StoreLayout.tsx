import { Outlet } from 'react-router-dom';
import StoreNav from '../../components/store/StoreNav';

export default function StoreLayout() {
  return (
    <div>
      <StoreNav />
      <Outlet />
    </div>
  );
}