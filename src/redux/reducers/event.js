import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allSports: null,
  event: null,
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    saveAllSports: (state, action) => {
      state.allSports = action.payload;
    },
    saveEvent: (state, action) => {
      state.event = action.payload;
    },
  },
});

export const { saveAllSports, saveEvent } = eventSlice.actions;

export default eventSlice.reducer;
