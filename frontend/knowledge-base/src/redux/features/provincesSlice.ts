import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import API from '@/services/api/api';
import { IProvince } from '@/types/province.type';

export const onGetItems = createAsyncThunk(
  'provinces/onGetItems',
  async () => {
    const { data } = await API.get(`/api/provinces`);
    return data;
  },
);

export const onDeleteItem = createAsyncThunk(
  'provinces/onDeleteItem',
  async (id: number) => {
    try {
      await API.delete(`/api/provinces/${id}`);
      return id;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error.message,
      );
    }
  },
);

export const onEditItem = createAsyncThunk(
  'provinces/onEditItem',
  async (province: Partial<IProvince>) => {
    try {
      const { data } = await API.put(
        `/api/provinces/${province.id}`,
        province,
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
  'provinces/onAddItem',
  async (province: Partial<IProvince>) => {
    try {
      const { data } = await API.post(`/api/provinces`, province);
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
  provinces: IProvince[];
}

const initialState: InitialState = {
  loading: false,
  error: null,
  provinces: [],
};

const provinceslice = createSlice({
  name: 'provinces',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onGetItems.pending, state => {
        state.loading = true;
      })
      .addCase(onGetItems.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.provinces = payload;
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
        state.provinces = state.provinces.filter(
          province => province.id !== payload,
        );
        toast.success('Province deleted successfully');
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
        state.provinces = state.provinces.map(province =>
          province.id === payload.id ? payload : province,
        );
        toast.success('Province updated successfully');
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
        state.provinces.push(payload);
        toast.success('Province added successfully');
      })
      .addCase(onAddItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
        toast.error(error.message);
      });
  },
});

export default provinceslice.reducer;
