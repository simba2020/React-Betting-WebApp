import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  betslip_add_data: [],
};

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setBetslipAddData: (state, action) => {
      state.betslip_add_data = action.payload;
    },
  },
});

export const { setBetslipAddData } = marketSlice.actions;

export default marketSlice.reducer;
