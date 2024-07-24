import { createSelector } from '@reduxjs/toolkit';

const selectSelf = (state) => state.event;

export const selectAllSports = createSelector(selectSelf, (event) => event.allSports);
