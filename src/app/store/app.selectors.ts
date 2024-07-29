import { createFeatureSelector, createSelector, State } from '@ngrx/store';
import * as fromApp from './app.reducer';

export const selectAppRootState =
  createFeatureSelector<fromApp.AppState>('app');

export const getPropertyList = createSelector(
  selectAppRootState,
  (state: fromApp.AppState) => state?.propertyList
);
