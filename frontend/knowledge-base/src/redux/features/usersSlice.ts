import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import API from '@/services/api/api';
import Secure from '@/utils/storage/secureLs';

export const onGetAllPatients = createAsyncThunk(
  'users/getAllPatients',
  async () => {
    try {
      const { data } = await API.get(`/api/users/patients`, {
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
export const onGetAllDoctors = createAsyncThunk(
  'users/getAllDoctors',
  async () => {
    try {
      const { data } = await API.get(`/api/users/physicians`, {
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

export const onGetAllPharmacists = createAsyncThunk(
  'users/getAllPharmacists',
  async () => {
    try {
      const { data } = await API.get(`/api/users/pharmacists`, {
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

export const onGrantAccessDoctor = createAsyncThunk(
  'users/onGrantAccessDoctor',
  async (params: { patientId: string; physicianId: string }) => {
    try {
      const { data } = await API.post(
        `/api/patients/${params.patientId}/physicians/${params.physicianId}`,
        {
          headers: {
            Authorization: `Bearer ${Secure.getToken()}`,
          },
        },
      );
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error?.message,
      );
    }
  },
);

export const onRevokeAccessDoctor = createAsyncThunk(
  'users/onRevokeAccessDoctor',
  async (params: { id: string; physicianId: string }) => {
    try {
      const { data } = await API.post(
        `/api/patients/${params.id}/physicians/${params.physicianId}/revoke`,
        {
          headers: {
            Authorization: `Bearer ${Secure.getToken()}`,
          },
        },
      );
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error?.message,
      );
    }
  },
);

interface initialState {
  patients: any[];
  doctors: any[];
  pharmacists: any[];
  loading: boolean;
  error: string | null;
}

const initialState: initialState = {
  patients: [],
  doctors: [],
  pharmacists: [],
  loading: false,
  error: null,
};

const patientSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(onGetAllPatients.pending, state => {
        state.loading = true;
      })
      .addCase(onGetAllPatients.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.patients = payload;
      })
      .addCase(onGetAllPatients.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      })

      .addCase(onGetAllDoctors.pending, state => {
        state.loading = true;
      })
      .addCase(onGetAllDoctors.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.doctors = payload;
      })
      .addCase(onGetAllDoctors.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      })

      .addCase(onGetAllPharmacists.pending, state => {
        state.loading = true;
      })
      .addCase(
        onGetAllPharmacists.fulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.pharmacists = payload;
        },
      )
      .addCase(onGetAllPharmacists.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message as string;
      });
  },
});

export default patientSlice.reducer;
