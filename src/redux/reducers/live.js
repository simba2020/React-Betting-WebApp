import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SportService from 'services/SportService';

const initialState = {
  loading: false,
  eventLoading: false,
  liveNav: [],
  collapse_live: [],
  liveMarketgroup: [],
  liveGameData: null,
};

export const getLiveNav = createAsyncThunk('live/getLiveNav', async () => {
  const response = await SportService.getLiveNav();

  return response.data;
});

export const fetchEvent = createAsyncThunk('live/fetchEvent', async (id) => {
  const response = await SportService.getEvent(id);

  return response.data;
});

export const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },

    setCollapseLive: (state, action) => {
      const data = action.payload;
      state.collapse_live = Object.keys(data).map(() => true);

      state.liveMarketgroup = Object.keys(data).map((key) => {
        const item = data[key][0];

        return item.commonMarketGroups ? Object.keys({ ...item.mgs.first, ...item.mgs.second })[0] : ''
      });
    },

    collapseLive: (state, action) => {
      state.collapse_live[action.payload] = !state.collapse_live[action.payload];
    },

    clearCollapseLive: (state) => {
      state.collapse_live = [];
      state.liveMarketgroup = [];
    },

    changeLiveMarketGroup: (state, action) => {
      state.liveMarketgroup[action.payload[1]] = action.payload[0];
    },

    saveLiveGameData: (state, action) => {
      state.liveGameData = action.payload;
    },
  },
  extraReducers: {
    [getLiveNav.pending]: (state) => {
      state.loading = true;
    },
    [getLiveNav.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.liveNav = payload;
    },
    [getLiveNav.rejected]: (state) => {
      state.loading = false;
      state.liveNav = [];
    },
    [fetchEvent.pending]: (state) => {
      state.eventLoading = true;
    },
    [fetchEvent.fulfilled]: (state, { payload }) => {
      state.eventLoading = false;
      state.liveGameData = payload;
    },
    [fetchEvent.rejected]: (state) => {
      state.eventLoading = false;
    },
  },
});

export const {
  setLoading,
  setCollapseLive,
  collapseLive,
  clearCollapseLive,
  saveLiveGameData,
  changeLiveMarketGroup,
} = liveSlice.actions;

export default liveSlice.reducer;
