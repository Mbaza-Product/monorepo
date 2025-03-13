import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';

import PrivateRoute from './PrivateRoute';

// import RegisterPage from '@/pages/RegisterPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route path="/*" element={<PrivateRoute />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
