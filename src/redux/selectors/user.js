import { createSelector } from '@reduxjs/toolkit';

const selectSelf = (state) => state.user;

export const selectUserInfo = createSelector(selectSelf, (user) => ({
  accessToken: user.accessToken,
  refreshToken: user.refreshToken,
  subId: user.subId,
  isLoggedIn: !!user.accessToken,
  isLoggingIn: user.loggingIn,
  isRegistering: user.registering,
  firstName: user.firstName,
  activeBalance: user.activeBalance,
  currencyIso: user.currencyIso,
}));

export const selectFavoriteOpponents = createSelector(selectSelf, (user) => user.favoriteOpponents);

export const selectFavoriteEvents = createSelector(selectSelf, (user) => user.favoriteEvents);
