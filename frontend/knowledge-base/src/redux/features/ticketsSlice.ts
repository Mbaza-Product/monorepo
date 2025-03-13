import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from '@/services/api/api';
import Secure from '@/utils/storage/secureLs';

export const onGetTickets = createAsyncThunk(
  'tickets/onGetTickets',
  async () => {
    try {
      const { data } = await API.get(`/api/tickets`, {
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
  tickets: any[];
  loading: boolean;
  error: string | null;
}

const initialState: initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketslice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onGetTickets.pending, state => {
        state.loading = true;
      })
      .addCase(onGetTickets.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tickets = payload;
      })
      .addCase(onGetTickets.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      });
  },
});

export default ticketslice.reducer;
