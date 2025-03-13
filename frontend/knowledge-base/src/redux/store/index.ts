import {
  configureStore,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';

import authReducer from '../features/auth/loginSlice';
import userReducer from '../features/userSlice';
import usersReducer from '../features/usersSlice';
import ticketsReducer from '../features/ticketsSlice';
import categoriesReducer from '../features/categoriesSlice';
import languagesReducer from '../features/languagesSlice';
import provincesReducer from '../features/provincesSlice';
import districtsReducer from '../features/districtsSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      users: usersReducer,
      tickets: ticketsReducer,
      categories: categoriesReducer,
      languages: languagesReducer,
      provinces: provincesReducer,
      districts: districtsReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
