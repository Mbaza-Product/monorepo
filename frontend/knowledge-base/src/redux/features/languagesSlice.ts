import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import API from '@/services/api/api';
import { ILanguage } from '@/types/language.type';

export const onGetLanguages = createAsyncThunk(
  'languages/onGetLanguages',
  async () => {
    const { data } = await API.get(`/api/languages`);
    return data;
  },
);

export const onDeleteItem = createAsyncThunk(
  'languages/onDeleteItem',
  async (id: number) => {
    try {
      await API.delete(`/api/languages/${id}`);
      return id;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error.message,
      );
    }
  },
);

export const onEditItem = createAsyncThunk(
  'languages/onEditItem',
  async (language: Partial<ILanguage>) => {
    try {
      const { data } = await API.put(
        `/api/languages/${language.id}`,
        language,
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
  'languages/onAddItem',
  async (language: Partial<ILanguage>) => {
    try {
      const { data } = await API.post(`/api/languages`, language);
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
  languages: ILanguage[];
}

const initialState: InitialState = {
  loading: false,
  error: null,
  languages: [],
};

const languageslice = createSlice({
  name: 'languages',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onGetLanguages.pending, state => {
        state.loading = true;
      })
      .addCase(onGetLanguages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.languages = payload;
      })
      .addCase(onGetLanguages.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      })
      .addCase(onDeleteItem.pending, state => {
        state.loading = true;
      })
      .addCase(onDeleteItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.languages = state.languages.filter(
          language => language.id !== payload,
        );
        toast.success('Language deleted successfully');
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
        state.languages = state.languages.map(language =>
          language.id === payload.id ? payload : language,
        );
        toast.success('Language updated successfully');
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
        state.languages.push(payload);
        toast.success('Language added successfully');
      })
      .addCase(onAddItem.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
        toast.error(error.message);
      });
  },
});

export default languageslice.reducer;
