import { useEffect } from 'react';

import MainLayout from '@/components/layouts/MainLayout';
import RegisterForm from '@/components/register/RegisterForm';
import Keys from '@/utils/appConstants/keys';
import isAuth from '@/utils/isAuth';
import Secure from '@/utils/storage/secureLs';
import { useAppSelector } from '@/components/hooks/useRedux';

const RegisterPage = () => {
  const { token } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuth(token)) {
      const redirectLink = Secure.get(Keys.REDIRECT_KEY);
      if (redirectLink) {
        Secure.remove(Keys.REDIRECT_KEY);
        window.location.href = redirectLink;
      }
      window.location.href = '/knowledgebase';
    }
  }, [token]);

  if (isAuth(token)) {
    return null;
  }
  return (
    <MainLayout>
      <RegisterForm />
    </MainLayout>
  );
};

export default RegisterPage;
