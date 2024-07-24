import { createSelector } from '@reduxjs/toolkit';

const selectSelf = (state) => state.live;

export const selectIsLoading = createSelector(selectSelf, (live) => live.loading);

export const selectLiveNav = createSelector(selectSelf, (live) => live.liveNav);

export const selectLiveGameData = createSelector(selectSelf, (live) => live.liveGameData);
