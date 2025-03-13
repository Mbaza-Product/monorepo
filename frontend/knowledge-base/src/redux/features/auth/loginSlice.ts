import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import API from '@/services/api/api';
import Secure from '@/utils/storage/secureLs';
import isAuth from '@/utils/isAuth';


export const onLogin = createAsyncThunk(
  'auth/login',
  async (data: Record<string, any>) => {
    try {
      const { data: authData } = await API.post(
        '/api/auth/login',
        data,
      );
      return authData;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error?.message,
      );
    }
  },
);

export const onRegister = createAsyncThunk(
  'auth/register',
  async (data: Record<string, any>) => {
    const { membership, ...rest } = data;
    let endpoint: string;
    switch (data.membership) {
      case 'patient':
        endpoint = '/api/auth/patient/register';
        break;
      case 'pharmacist':
        endpoint = '/api/auth/pharmacist/register';
        break;
      case 'physician':
        endpoint = '/api/auth/physician/register';
        break;
      default:
        return null;
    }
    try {
      const { data: authData } = await API.post(endpoint, rest);
      if (data.navigate) {
        toast.success('Account created successfully, Login now');
        data.navigate('/login');
      }
      return authData;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error?.message,
      );
    }
  },
);

interface initialState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: initialState = {
  token: isAuth() ? Secure.getToken() : null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    onLogout(state) {
      Secure.removeToken();
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    onRemoveError(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(onLogin.pending, state => {
        state.loading = true;
      })
      .addCase(onLogin.fulfilled, (state, { payload }) => {
        state.loading = false;

        if (payload?.roles?.includes('ADMIN')) {
          state.token = payload?.accessToken;
          Secure.setToken(payload.accessToken);
        } else {
          toast.error("You're not allowed to access this site.");
        }
      })
      .addCase(onLogin.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      })

      .addCase(onRegister.pending, state => {
        state.loading = true;
      })
      .addCase(onRegister.fulfilled, (state, { payload }) => {
        state.loading = false;
      })
      .addCase(onRegister.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      });
  },
});

export const { onLogout, onRemoveError } = loginSlice.actions;

export default loginSlice.reducer;
