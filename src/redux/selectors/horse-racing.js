import { createSelector } from '@reduxjs/toolkit';

const selectSelf = (state) => state.horseRacing;

export const selectFetchingUpcomingEvents = createSelector(
  selectSelf,
  (horseRacing) => horseRacing.fetchingUpcomingEvents
);
export const selectUpcomingEvents = createSelector(selectSelf, (horseRacing) => horseRacing.upcomingEvents);
