import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from '../../services/UserService';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';

export const activate = createAsyncThunk('auth/activate', async (token, { rejectWithValue }) => {
  const response = await UserService.activate(token).catch((e) => e);

  if (response.status !== StatusCodes.OK) {
    toast.error(response.data.data.message);

    return rejectWithValue(response.data);
  }

  return response.data;
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  const response = await UserService.resetPassword(data).catch((e) => e);

  if (response.status !== StatusCodes.OK) {
    toast.error(response.data.data.message);

    return rejectWithValue(response.data);
  }

  return response.data;
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  if (!email) {
    toast.warning('Please enter your email');

    return rejectWithValue({ success: false });
  }

  const response = await UserService.forgotPassword(email).catch((e) => e);

  if (response.status !== StatusCodes.OK) {
    toast.error(response.data.message);

    return rejectWithValue(response.data);
  }

  return response.data;
});

const initialState = {
  quickLogin: false,
  activating: false,
  resettingPassword: false,
  forgotPassword: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    showQuickLogin: (state) => {
      state.quickLogin = true;
    },
    hideQuickLogin: (state) => {
      state.quickLogin = false;
    },
  },
  extraReducers: {
    [activate.pending]: (state) => {
      state.activating = true;
    },
    [activate.fulfilled]: (state) => {
      state.activating = false;
    },
    [activate.rejected]: (state) => {
      state.activating = false;
    },
    [resetPassword.pending]: (state) => {
      state.resettingPassword = true;
    },
    [resetPassword.fulfilled]: (state) => {
      state.resettingPassword = false;
    },
    [resetPassword.rejected]: (state) => {
      state.resettingPassword = false;
    },
    [forgotPassword.pending]: (state) => {
      state.forgotPassword = true;
    },
    [forgotPassword.fulfilled]: (state) => {
      state.forgotPassword = false;
    },
    [forgotPassword.rejected]: (state) => {
      state.forgotPassword = false;
    },
  },
});

export const { showQuickLogin, hideQuickLogin } = authSlice.actions;

export default authSlice.reducer;
