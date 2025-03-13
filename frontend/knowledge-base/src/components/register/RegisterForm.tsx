/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, FormEvent, ChangeEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Logo from '../shared/Logo';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';

import {
  onRegister,
  onRemoveError,
} from '@/redux/features/auth/loginSlice';
import isAuth from '@/utils/isAuth';

const RegisterForm = () => {
  const navigate = useNavigate();
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
      [name]: type === 'number' ? +value : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !['patient', 'pharmacist', 'physician'].includes(
        credentials.membership,
      )
    ) {
      return;
    }
    credentials.navigate = navigate;
    await dispatch(onRegister(credentials));
  };

  const getLoginInput = () => {
    switch (credentials.membership) {
      case 'patient':
        return {
          label: 'Username',
          type: 'text',
          name: 'username',
        };
      case 'pharmacist':
        return {
          label: 'Phone number',
          type: 'tel',
          name: 'phone',
        };
      case 'physician':
        return {
          label: 'Email',
          type: 'email',
          name: 'email',
        };
      // eslint-disable-next-line sonarjs/no-duplicated-branches
      default:
        return {
          label: 'Username',
          type: 'text',
          name: 'username',
        };
    }
  };

  const handleChangeMembership = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const { value } = event.target;
    setCredentials(prev => ({
      membership: value,
    }));
  };

  if (error && !loading) {
    toast.error(error);
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
        className="flex flex-col md:inline-grid grid-cols-2 gap-4 max-w-md w-full bg-white  transition-all duration-300 dark:bg-gray-950 rounded-lg shadow-md p-8"
      >
        <h2 className="col-span-full text-2xl font-bold mb-4 text-center">
          Register to Mbaza
        </h2>

        <div className="col-span-full">
          <label
            htmlFor="membership"
            className="block font-bold mb-2"
          >
            Membership
          </label>
          <select
            id="membership"
            required
            value={credentials.membership || ''}
            onChange={handleChangeMembership}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
          >
            <option value="">Select your membership</option>
            <option value="patient">Patient</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="physician">Physician</option>
          </select>
        </div>

        <div className="col-span-full">
          <label htmlFor="name" className="block font-bold mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={credentials.name || ''}
            onChange={handleChangeInput}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
            required
          />
        </div>

        <div className="">
          <label htmlFor="gender" className="block font-bold mb-2">
            Gender
          </label>
          <select
            id="gender"
            required
            name="gender"
            value={credentials.gender || ''}
            onChange={event => {
              setCredentials(prev => ({
                ...prev,
                gender: event.target.value,
              }));
            }}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="">
          <label htmlFor="age" className="block font-bold mb-2">
            Age
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={credentials.age || ''}
            onChange={handleChangeInput}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
            required
          />
        </div>

        {credentials.membership === 'patient' && (
          <div className="col-span-full">
            <label
              htmlFor="symptoms"
              className="block font-bold mb-2"
            >
              Symptoms
            </label>
            <input
              id="symptoms"
              type="text"
              name="symptoms"
              placeholder="Add your symptoms here (separated by commas)"
              value={credentials.symptoms || ''}
              onChange={handleChangeInput}
              className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
              required
            />
          </div>
        )}

        <div className="">
          <label htmlFor="username" className="block font-bold mb-2">
            {getLoginInput().label}
          </label>
          <input
            id="username"
            type={getLoginInput().type}
            name={getLoginInput().name}
            value={credentials[getLoginInput().name] || ''}
            onChange={handleChangeInput}
            className="w-full border border-gray-300 outline-none p-2 rounded-lg  transition-all duration-300 dark:bg-slate-800 dark:border-slate-900"
            required
          />
        </div>

        <div className="">
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
          className="col-span-full disabled:cursor-not-allowed mt-4 opacity-70 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg  transition-all duration-300 dark:bg-blue-800 dark:hover:bg-blue-600"
        >
          Register
        </button>

        <div className="flex justify-between items-center mt-4 col-span-full">
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600"
          >
            Already have an account? Login here!
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
