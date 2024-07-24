import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  betslip_conflicts: [],
  betslip_single_bets: [],
  betslip_multi_combined: [],
  betslip_total_stake: 0,
  betslip_total_win: 0,
  betslip_valid: 0,
  betslip_status_message: '',
  betslip_status: null,
  betslip_deposit_click: false,
  betslip_quicklogin: false,
};

export const betslipSlice = createSlice({
  name: 'betslip',
  initialState,
  reducers: {
    setConflicts: (state, action) => {
      state.betslip_conflicts = action.payload;
    },
    setSingleBets: (state, action) => {
      state.betslip_single_bets = action.payload;
    },
    setMultiCombined: (state, action) => {
      state.betslip_multi_combined = action.payload;
    },
    setTotalStake: (state, action) => {
      state.betslip_total_stake = action.payload;
    },
    setTotalWin: (state, action) => {
      state.betslip_total_win = action.payload;
    },
    setValid: (state, action) => {
      state.betslip_valid = action.payload;
    },
    setStatusMessage: (state, action) => {
      state.betslip_status_message = action.payload;
    },
    setStatus: (state, action) => {
      state.betslip_status = action.payload;
    },
    setDepositClick: (state, action) => {
      state.betslip_deposit_click = action.payload;
    },
    setQuickLogin: (state, action) => {
      state.betslip_quicklogin = action.payload;
    },
  },
});

export const {
  setConflicts,
  setSingleBets,
  setMultiCombined,
  setTotalStake,
  setTotalWin,
  setValid,
  setStatusMessage,
  setStatus,
  setDepositClick,
  setQuickLogin,
} = betslipSlice.actions;

export default betslipSlice.reducer;
