import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import * as fromApp from './app.reducer';

export const selectAppRootState =
  createFeatureSelector<fromApp.AppState>('app');

export const fetchUsers = createSelector(
  selectAppRootState,
  (state: fromApp.AppState) => state?.usersData
);

export const getPropertyList = createSelector(
  selectAppRootState,
  (state: fromApp.AppState) => state?.propertyList
);

export const getSignedInUser = createSelector(
  selectAppRootState,
  (state: fromApp.AppState) => state?.signedInUser
);
