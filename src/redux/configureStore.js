import { configureStore } from '@reduxjs/toolkit';

import landingReducer from './reducers/landing';
import betslipReducer from './reducers/betslip';
import marketReducer from './reducers/market';
import footballReducer from './reducers/football';
import eventReducer from './reducers/event';
import liveReducer from './reducers/live';
import userReducer from './reducers/user';
import authReducer from './reducers/auth';
import horseRacingReducer from './reducers/horse-racing';
import { initialState as userInitialState } from './reducers/user';

export const STORAGE_KEY_USER = 'tether_user';

const userPersistedState = localStorage.getItem(STORAGE_KEY_USER)
  ? JSON.parse(localStorage.getItem(STORAGE_KEY_USER))
  : undefined;

const store = configureStore({
  reducer: {
    landing: landingReducer,
    football: footballReducer,
    event: eventReducer,
    live: liveReducer,
    market: marketReducer,
    betslip: betslipReducer,
    user: userReducer,
    auth: authReducer,
    horseRacing: horseRacingReducer,
  },
  preloadedState: {
    user: {
      ...userInitialState,
      ...userPersistedState,
    },
  },
});

store.subscribe(() => {
  const { user } = store.getState();

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
});

export default store;
