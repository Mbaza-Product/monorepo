import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from 'react-router-dom';

import NotFoundPage from '../pages/NotFoundPage';

import { useAppSelector } from './hooks/useRedux';

import LogoutPage from '@/pages/LogoutPage';
import DashboardPage from '@/pages/DashboardPage';
import Secure from '@/utils/storage/secureLs';
import Keys from '@/utils/appConstants/keys';
import isAuth from '@/utils/isAuth';
import TicketPage from '@/pages/TicketPage';
import LanguagePage from '@/pages/LanguagePage';
import ProvincePage from '@/pages/ProvincePage';
import DistrictPage from '@/pages/DistrictsPage';

const PrivateRoute = () => {
  const { token } = useAppSelector(state => state.auth);
  const { pathname, search } = useLocation();

  if (!isAuth(token)) {
    Secure.set(Keys.REDIRECT_KEY, `${pathname}${search}`);
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/logout" element={<LogoutPage />} />

      <Route path="/knowledgebase" element={<DashboardPage />} />
      <Route path="/tickets" element={<TicketPage />} />
      <Route path="/languages" element={<LanguagePage />} />
      <Route path="/provinces" element={<ProvincePage />} />
      <Route path="/districts" element={<DistrictPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PrivateRoute;
