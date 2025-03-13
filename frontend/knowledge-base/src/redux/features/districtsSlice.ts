import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import API from '@/services/api/api';
import { IDistrict } from '@/types/district.type';

export const onGetItems = createAsyncThunk(
  'districts/onGetItems',
  async () => {
    const { data } = await API.get(`/api/districts`);
    return data;
  },
);

export const onDeleteItem = createAsyncThunk(
  'districts/onDeleteItem',
  async (id: number) => {
    try {
      await API.delete(`/api/districts/${id}`);
      return id;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error.message,
      );
    }
  },
);

export const onEditItem = createAsyncThunk(
  'districts/onEditItem',
  async (district: Partial<IDistrict>) => {
    try {
      const { data } = await API.put(
        `/api/districts/${district.id}`,
        district,
      );
      return data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error.message,
      );
    }
  },
);

export const onAddItem = createAsyncThunk(
  'districts/onAddItem',
  async (district: Partial<IDistrict>) => {
    try {
      const { data } = await API.post(`/api/districts`, district);
      return data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error.message,
      );
    }
  },
);

interface InitialState {
  loading: boolean;
  error: string | null;
  districts: IDistrict[];
}

const initialState: InitialState = {
  loading: false,
  error: null,
  districts: [],
};

const districtslice = createSlice({
  name: 'districts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onGetItems.pending, state => {
        state.loading = true;
      })
      .addCase(onGetItems.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.districts = payload;
      })
      .addCase(onGetItems.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      })
      .addCase(onDeleteItem.pending, state => {
        state.loading = true;
      })
      .addCase(onDeleteItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.districts = state.districts.filter(
          district => district.id !== payload,
        );
        toast.success('District deleted successfully');
      })
      .addCase(onDeleteItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
        toast.error(error.message);
      })
      .addCase(onEditItem.pending, state => {
        state.loading = true;
      })
      .addCase(onEditItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.districts = state.districts.map(district =>
          district.id === payload.id ? payload : district,
        );
        toast.success('District updated successfully');
      })
      .addCase(onEditItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
        toast.error(error.message);
      })
      .addCase(onAddItem.pending, state => {
        state.loading = true;
      })
      .addCase(onAddItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.districts.push(payload);
        toast.success('District added successfully');
      })
      .addCase(onAddItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
        toast.error(error.message);
      });
  },
});

export default districtslice.reducer;
