import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from '@/services/api/api';
import { ICategory } from '@/types/category.type';

export const onCategories = createAsyncThunk(
  'categories/onCategories',
  async (languageId: number) => {
    const { data } = await API.get(
      `/api/categories?languageId=${languageId}`,
    );
    return data;
  },
);

interface initialState {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
}

const initialState: initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorieslice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onCategories.pending, state => {
        state.loading = true;
      })
      .addCase(onCategories.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categories = payload;
      })
      .addCase(onCategories.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      });
  },
});

export default categorieslice.reducer;
