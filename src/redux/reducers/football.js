import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  collapse: [true],
  collapse_quick: [],
  trigger_tournament: [],
  odd: localStorage.getItem('odd') === null ? 'Decimal (2.20)' : localStorage.getItem('odd'),
  collapse_tournament: [],
  tournaments_marketgroup: '',
  tournaments_marketgroup2: [],
  quicklinkData: {},
  collapse_horsegroup: [],
  horseQuicklink: null,
  featuredEvents: [],
};

export const footbalSlice = createSlice({
  name: 'football',
  initialState,
  reducers: {
    collapseFootball: (state, action) => {
      state.collapse[action.payload] = !state.collapse[action.payload];
    },
    setCollapseQuickLink: (state, action) => {
      state.collapse_quick = Array.from({ length: action.payload[0] }, (_, idx) => idx === action.payload[1]);
    },
    collapseQuickLink: (state, action) => {
      state.collapse_quick = state.collapse_quick.map((collapsed, idx) =>
        idx === action.payload ? !collapsed : false
      );
    },
    clearTriggerTournament: (state, action) => {
      state.trigger_tournament = [];
    },
    triggerTournament: (state, action) => {
      state.trigger_tournament = action.payload;
    },
    closeQuickLink: (state, action) => {
      for (let i = 0; i < state.collapse_quick.length; i++) {
        state.collapse_quick[i] = false;
      }
    },
    setOdd: (state, action) => {
      state.odd = action.payload;
    },
    clearTournamentCollapse: (state, action) => {
      state.collapse_tournament = [];
      state.tournaments_marketgroup = '';
    },
    setTournamentCollapse: (state, action) => {
      for (let i = 0; i < action.payload.length; i++) {
        state.collapse_tournament.push(true);
      }

      for (let i = 0; i < action.payload.length; i++) {
        if (action.payload[i].commonMarketGroups !== null) {
          state.tournaments_marketgroup2.push(Object.keys(action.payload[i].commonMarketGroups)[1]);
        } else {
          state.tournaments_marketgroup.push('');
          state.tournaments_marketgroup2.push('');
        }
      }
    },
    collapseSportTournament: (state, action) => {
      state.collapse_tournament[action.payload] = !state.collapse_tournament[action.payload];
    },

    changeTournamentMarketGroup: (state, action) => {
      state.tournaments_marketgroup = action.payload[0];
    },
    changeTournamentMarketGroup2: (state, action) => {
      state.tournaments_marketgroup2[action.payload[1]] = action.payload[0];
    },
    addMarketGroup: (state, action) => {
      state.tournaments_marketgroup = action.payload[0];
    },
    saveQuickLinkData: (state, action) => {
      state.quicklinkData = action.payload;
    },
    saveFeaturedEvents: (state, action) => {
      state.featuredEvents = action.payload;
    },
    setHorseGroupCollapse: (state, action) => {
      for (let i = 0; i < action.payload; i++) {
        state.collapse_horsegroup[i] = true;
      }
    },
    collapseHorseGroup: (state, action) => {
      state.collapse_horsegroup[action.payload] = !state.collapse_horsegroup[action.payload];
    },
    saveHorseQuickLinks: (state, action) => {
      state.horseQuicklink = action.payload;
    },
  },
});

export const {
  collapseFootball,
  setCollapseQuickLink,
  collapseQuickLink,
  clearTriggerTournament,
  triggerTournament,
  closeQuickLink,
  setOdd,
  clearTournamentCollapse,
  setTournamentCollapse,
  collapseSportTournament,
  changeTournamentMarketGroup,
  changeTournamentMarketGroup2,
  addMarketGroup,
  saveQuickLinkData,
  saveFeaturedEvents,
  setHorseGroupCollapse,
  collapseHorseGroup,
  saveHorseQuickLinks,
} = footbalSlice.actions;

export default footbalSlice.reducer;
