import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  collapse: [],
  favCollapse: [],
  marketgroup: [],
  marketgroup2: [],
  fmarketgroup: '',
  fmarketgroup2: '',
  favData: null,
  flagFav: false,
  access_token: localStorage.getItem('access_token'),
  userInfo: null,
  profileFlag: null,
  socialLinks: null,
};

export const landingSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    collapseBetpart: (state, action) => {
      state.collapse = state.collapse.map((collapse, idx) =>
        idx === action.payload ? { ...collapse, sport: !collapse.sport } : { ...collapse }
      );
    },
    collapseTournament: (state, action) => {
      state.collapse = state.collapse.map((collapse, sportIdx) =>
        sportIdx === action.payload[0]
          ? {
              ...collapse,
              tournament: collapse.tournament.map((tournament, tournamentIdx) =>
                tournamentIdx === action.payload[1] ? !tournament : tournament
              ),
            }
          : { ...collapse }
      );
    },
    clearMarketgroup: (state, action) => {
      state.marketgroup = [];
      state.marketgroup2 = [];
    },
    setHomepageCollapse: (state, action) => {
      const keys = Object.keys(action.payload);
      const collapse = state.collapse.map((collapse) => ({ ...collapse }));
      const marketgroup = state.marketgroup.map((marketgroup) => ({ ...marketgroup }));
      const marketgroup2 = state.marketgroup2.map((marketgroup2) => ({ ...marketgroup2 }));

      if (state.collapse.length === 0) {
        for (let i = 0; i < keys.length; i++) {
          if (i < 3) {
            const tournament = [];
            for (let j = 0; j < action.payload[keys[i]].items.length; j++) {
              tournament.push(j < 1);
            }
            collapse.push({ sport: true, tournament });
          } else {
            const tournament = [];
            for (let j = 0; j < action.payload[keys[i]].items.length; j++) {
              tournament.push(j < 1);
            }
            collapse.push({ sport: true, tournament });
          }
        }
      } else {
        for (let i = 0; i < keys.length; i++) {
          const tournament = [];
          for (let j = 0; j < action.payload[keys[i]].items.length; j++) {
            tournament.push(j < 1);
          }
          collapse[i] = {
            ...collapse[i],
            tournament,
          };
        }
      }

      if (!state.marketgroup.length) {
        for (let i = 0; i < keys.length; i++) {
          marketgroup.push(Object.keys(action.payload[keys[i]].commonMarketGroups)[0]);
        }
      }

      if (!state.marketgroup2.length) {
        for (let i = 0; i < keys.length; i++) {
          marketgroup2.push(Object.keys(action.payload[keys[i]].commonMarketGroups)[1]);
        }
      }

      state.data = action.payload;
      state.collapse = collapse;
      state.marketgroup = marketgroup;
      state.marketgroup2 = marketgroup2;
    },
    changeMarketgroup: (state, action) => {
      state.marketgroup[action.payload[1]] = action.payload[0];
    },
    changeMarketgroup2: (state, action) => {
      state.marketgroup2[action.payload[1]] = action.payload[0];
    },
    changeFMarketgroup: (state, action) => {
      state.fmarketgroup = action.payload;
    },
    changeFMarketgroup2: (state, action) => {
      state.fmarketgroup2 = action.payload;
    },
    saveFavourites: (state, action) => {
      state.favData = action.payload;
      const favData = action.payload.data;
      state.fmarketgroup = Object.keys(favData.commonMarketGroups)[0];
      state.fmarketgroup2 = Object.keys(favData.commonMarketGroups)[1];
    },
    openFav: (state, action) => {
      state.flagFav = !state.flagFav;
    },
    closeFav: (state, action) => {
      state.flagFav = false;
    },
    collapseFav: (state, action) => {
      state.favCollapse[action.payload] = !state.favCollapse[action.payload];
    },
    saveAccessToken: (state, action) => {
      state.access_token = action.payload;
    },
    saveUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    openProfile: (state, action) => {
      state.profileFlag = action.payload;
    },
    closeProfile: (state) => {
      state.profileFlag = null;
    },
    saveSocialLinks: (state, action) => {
      state.socialLinks = action.payload;
    },
  },
});

export const {
  collapseBetpart,
  collapseTournament,
  clearMarketgroup,
  changeMarketgroup2,
  setHomepageCollapse,
  changeMarketgroup,
  changeFMarketgroup2,
  changeFMarketgroup,
  saveFavourites,
  openFav,
  closeFav,
  collapseFav,
  saveAccessToken,
  saveUserInfo,
  openProfile,
  closeProfile,
  saveSocialLinks,
} = landingSlice.actions;

export default landingSlice.reducer;
