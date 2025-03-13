/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Logo from '../shared/Logo';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';

import {
  onLogin,
  onRemoveError,
} from '@/redux/features/auth/loginSlice';
import isAuth from '@/utils/isAuth';

const LoginForm = () => {
  const [credentials, setCredentials] = useState<Record<string, any>>(
    {},
  );

  const dispatch = useAppDispatch();
  const { error, loading, token } = useAppSelector(
    state => state.auth,
  );

  const handleChangeInput = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, type } = event.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!credentials.email || !credentials.password) {
      return;
    }
    await dispatch(onLogin(credentials));
  };

  if (error && !loading) {
    toast.error('Invalid credentials');
    dispatch(onRemoveError());
  }

  if (isAuth(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow w-full p-4 md:p-8">
      <div className="flex items-center justify-center mb-8">
        <Logo />
        <Link to="/" className="pl-2">
          <h1 className="text-4xl font-bold">Mbaza</h1>
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-sm w-full bg-white  transition-all duration-300 dark:bg-gray-950 rounded-lg shadow-md p-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Sign in to Mbaza
        </h2>

        <div className="my-4">
          <label htmlFor="email" className="block font-bold mb-2">
            Email
          </label>
          <input
            id="email"
            type="text"
            name="email"
            value={credentials.email || ''}
            onChange={handleChangeInput}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block font-bold mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password || ''}
            onChange={handleChangeInput}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="disabled:cursor-not-allowed mt-4 opacity-70 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg  transition-all duration-300 dark:bg-blue-800 dark:hover:bg-blue-600"
        >
          Sign in
        </button>

        {/* <div className="flex justify-between items-center mt-4">
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600"
          >
            First time? Register here!
          </Link>
        </div> */}
      </form>
    </div>
  );
};

export default LoginForm;
