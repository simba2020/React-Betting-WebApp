import { createSelector } from '@reduxjs/toolkit';

const selectSelf = (state) => state.auth;

export const selectIsQuickLogin = createSelector(selectSelf, (auth) => auth.quickLogin);

export const selectIsActivating = createSelector(selectSelf, (auth) => auth.activating);

export const selectIsResettingPassword = createSelector(selectSelf, (auth) => auth.resettingPassword);

export const selectIsRecoveringPassword = createSelector(selectSelf, (auth) => auth.forgotPassword);
