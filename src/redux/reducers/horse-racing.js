import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SportService from 'services/SportService';

const initialState = {
  fetchingUpcomingEvents: false,
  upcomingEvents: [],
};

export const fetchHorseRacingUpcomingEvents = createAsyncThunk('horseRacing/fetchUpcomingEvents', async () => {
  const response = await SportService.fetchHorseRacingUpcomingEvents().catch(() => ({ success: false }));

  if (!response.success) {
    return {
      upcomingEvents: [],
    };
  }

  return {
    upcomingEvents: response.data,
  };
});

export const horseRacingSlice = createSlice({
  name: 'horseRacing',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchHorseRacingUpcomingEvents.pending]: (state) => {
      state.fetchingUpcomingEvents = true;
    },
    [fetchHorseRacingUpcomingEvents.rejected]: (state) => {
      state.fetchingUpcomingEvents = false;
    },
    [fetchHorseRacingUpcomingEvents.fulfilled]: (state, { payload }) => {
      state.fetchingUpcomingEvents = false;
      state.upcomingEvents = payload.upcomingEvents;
    },
  },
});

export default horseRacingSlice.reducer;
