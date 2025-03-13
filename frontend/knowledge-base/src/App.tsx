import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import AppProviders from './components/AppProviders';
import AppRoutes from './components/AppRoutes';
import { useTheme } from './components/contexts/ThemeContext';

const App = () => {
  const { theme } = useTheme();
  return (
    <AppProviders>
      <AppRoutes />
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
    </AppProviders>
  );
};

export default App;
