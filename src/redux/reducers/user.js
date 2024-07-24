import { createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit';
import MessageBusService from 'services/MessageBusService';
import SportService from 'services/SportService';
import { selectFavoriteEvents, selectFavoriteOpponents, selectUserInfo } from 'redux/selectors/user';
import UserService from 'services/UserService';
import jwt_decode from 'jwt-decode';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

export const login = createAsyncThunk(
  'user/login',
  async (data = { username: '', password: '' }, { rejectWithValue }) => {
    const response = await UserService.login(data, { _skipToken: true, _noRetry: true }).catch((e) => e);

    if (response.status !== StatusCodes.OK) {
      toast.error(response.data.message);

      return rejectWithValue(response.data);
    }

    const { token, refresh_token: refreshToken } = response.data;
    const {
      subId,
      first_name: firstName,
      balance: { active: activeBalance },
      currency_iso: currencyIso,
      currency,
    } = jwt_decode(token);

    return { accessToken: token, refreshToken, subId, firstName, activeBalance, currencyIso, currency };
  }
);

export const register = createAsyncThunk('user/register', async (data, { rejectWithValue, dispatch }) => {
  const response = await UserService.register(data).catch((e) => e);

  if (response.status !== StatusCodes.OK) {
    toast.error(response.data.message);

    return rejectWithValue(response.data);
  }

  toast.success(response.data.message);

  const { type, refresh_token: refreshToken, token } = response.data.data;

  if (type === 'signin') {
    dispatch(autoSignIn({ token, refreshToken }));

    return { type, success: true };
  }

  // only two types for now, this path should be `activation`

  return { type, success: true };
});

export const refreshToken = createAsyncThunk(
  'user/refreshToken',
  async (data = { refresh_token: '' }, { getState }) => {
    const { isLoggedIn } = selectUserInfo(getState());

    if (!isLoggedIn) {
      return Promise.reject();
    }

    const response = await UserService.refreshToken(data, { _skipToken: true, _noRetry: true });

    if (response.status !== StatusCodes.OK) {
      return Promise.reject(response);
    }

    const { token, refresh_token: refreshToken } = response.data;
    const {
      subId,
      first_name: firstName,
      balance: { active: activeBalance },
      currency_iso: currencyIso,
      currency,
    } = jwt_decode(token);

    return { accessToken: token, refreshToken, subId, firstName, activeBalance, currencyIso, currency };
  }
);

export const heartbeat = createAsyncThunk('user/heartbeat', async (data = undefined, { rejectWithValue }) => {
  const response = await UserService.heartbeat({ _noRetry: true });

  if (response.status !== StatusCodes.OK) {
    return rejectWithValue(response.data);
  }

  return true;
});

export const fetchFavoriteOpponents = createAsyncThunk('user/fetchFavoriteOpponents', async (ids, { dispatch }) => {
  const fetchAndMap = async (id) => {
    const response = await SportService.checkFavouriteOpponent(id);

    dispatch(updateFavoriteOpponents({ id, favorite: response.data.favorite }));

    return { id, favorite: response.data.favorite };
  };

  const promises = (Array.isArray(ids) ? ids : [ids]).map((id) => fetchAndMap(id));

  return await Promise.all(promises);
});

export const toggleFavoriteOpponent = createAsyncThunk(
  'user/toggleFavoriteOpponent',
  async (id, { dispatch, getState }) => {
    const favoriteOpponents = selectFavoriteOpponents(getState());
    const isFav = favoriteOpponents.includes(id);
    let result;

    if (isFav) {
      result = await SportService.delFavouriteOpponent(id).catch(() => ({ success: false }));
    } else {
      result = await SportService.addFavouriteOpponent(id).catch(() => ({ success: false }));
    }

    if (result.success) {
      dispatch(fetchFavoriteOpponents(id));
    }
  }
);

export const fetchFavoriteEvents = createAsyncThunk('user/fetchFavoriteEvents', async (ids, { dispatch }) => {
  const fetchAndMap = async (id) => {
    const response = await SportService.checkFavouriteEvent(id);

    return { id, favorite: response.data.favorite };
  };

  const promises = (Array.isArray(ids) ? ids : [ids]).map((id) => fetchAndMap(id));

  const results = await Promise.all(promises);

  dispatch(updateFavoriteEvents(results));

  return results;
});

export const toggleFavoriteEvent = createAsyncThunk('user/toggleFavoriteEvent', async (id, { dispatch, getState }) => {
  const favEvents = selectFavoriteEvents(getState());
  const isFav = favEvents.includes(id);
  let result;

  if (isFav) {
    result = await SportService.delFavouriteEvent(id).catch(() => ({ success: false }));
  } else {
    result = await SportService.addEventFavourite(id).catch(() => ({ success: false }));
  }

  if (result.success) {
    dispatch(updateFavoriteEvents({ id, favorite: !isFav }));
  }
});

export const abroadTokenRequest = createAsyncThunk('user/abroadTokenRequest', async (_, { dispatch, getState }) => {
  const { accessToken } = selectUserInfo(getState());
  const payload = {
    accessToken,
  };

  await MessageBusService.post({ id: 'SportsBook/AbroadTokenResponse', payload });
});

export const abroadTokenRefreshRequest = createAsyncThunk(
  'user/abroadTokenRefreshRequest',
  async (_, { dispatch, getState }) => {
    const { refreshToken: refresh_token } = selectUserInfo(getState());

    const { accessToken } = await dispatch(refreshToken({ refresh_token })).then(unwrapResult);

    await MessageBusService.post({
      id: 'SportsBook/AbroadTokenRefreshResponse',
      payload: { accessToken },
    });
  }
);

export const autoSignIn = createAsyncThunk('user/abroadSignIn', async ({ token, refreshToken }) => {
  const {
    subId,
    first_name: firstName,
    balance: { active: activeBalance },
    currency_iso: currencyIso,
    currency,
  } = jwt_decode(token);

  return { accessToken: token, refreshToken, subId, firstName, activeBalance, currencyIso, currency };
});

export const initialState = {
  loggingIn: false,
  registering: false,
  refreshingToken: false,
  subId: null,
  accessToken: null,
  refreshToken: null,
  firstName: null,
  activeBalance: 0.0,
  currency: null,
  currencyIso: null,
  favoriteOpponents: [],
  favoriteEvents: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
    updateBalance: (state, { payload }) => {
      state.activeBalance = payload.active;
    },
    updateFavoriteOpponents: (state, { payload }) => {
      const updates = Array.isArray(payload) ? [...payload] : [payload];
      state.favoriteOpponents = updates
        .reduce(
          (accu, { id, favorite }) => {
            if (favorite) {
              return [...accu, id];
            }

            return accu.filter((currentId) => !(currentId === id));
          },
          [...state.favoriteOpponents]
        )
        .filter((id, idx, arr) => arr.indexOf(id) === idx);
    },
    updateFavoriteEvents: (state, { payload }) => {
      const updates = Array.isArray(payload) ? [...payload] : [payload];
      state.favoriteEvents = updates
        .reduce(
          (accu, { id, favorite }) => {
            if (favorite) {
              return [...accu, id];
            }

            return accu.filter((currentId) => !(currentId === id));
          },
          [...state.favoriteEvents]
        )
        .filter((id, idx, arr) => arr.indexOf(id) === idx);
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loggingIn = true;
    },
    [login.fulfilled]: (state, { payload }) => {
      return { ...state, ...payload, loggingIn: false };
    },
    [login.rejected]: () => {
      return initialState;
    },
    [register.pending]: (state) => {
      state.registering = true;
    },
    [register.fulfilled]: (state) => {
      state.registering = false;
    },
    [register.rejected]: (state) => {
      state.registering = false;
    },
    [refreshToken.pending]: (state) => {
      state.refreshingToken = true;
    },
    [refreshToken.fulfilled]: (state, { payload }) => {
      return { ...state, ...payload, refreshingToken: false };
    },
    [refreshToken.rejected]: () => {
      return initialState;
    },
    [autoSignIn.pending]: (state) => {
      state.loggingIn = true;
    },
    [autoSignIn.fulfilled]: (state, { payload }) => {
      return { ...state, ...payload, loggingIn: false };
    },
  },
});

export const { logout, updateFavoriteOpponents, updateFavoriteEvents, updateBalance } = userSlice.actions;

export default userSlice.reducer;
