import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from '@/services/api/api';
import Secure from '@/utils/storage/secureLs';

export const onGetUser = createAsyncThunk(
  'user/getUser',
  async (userId: string) => {
    try {
      const { data } = await API.get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${Secure.getToken()}`,
        },
      });
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error?.message,
      );
    }
  },
);

interface initialState {
  user: Record<string, any> | null;
  loading: boolean;
  error: string | null;
}

const initialState: initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onGetUser.pending, state => {
        state.loading = true;
      })
      .addCase(onGetUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(onGetUser.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      });
  },
});

export default userSlice.reducer;
