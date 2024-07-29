import { createReducer, on } from '@ngrx/store';
import { propertyList, users } from '../shared/data/initial-data';
import { UserInfo } from '../shared/models/user-info.model';
import { Property } from '../shared/models/property.model';
import { addProperty, updatePropertyList } from './app.actions';

export interface AppState {
  propertyList: Property[];
}

export const initialState: AppState = {
  propertyList: propertyList,
};

export const appReducer = createReducer(
  initialState,
  on(addProperty, (state, property) => ({
    ...state,
    propertyList: [...state.propertyList, property],
  })),
  on(updatePropertyList, (state, props) => ({
    ...state,
    propertyList: props.properties,
  }))
  // on(setSignedInUser, (state, props) => ({
  //   ...state,
  //   signedInUser: props.signedInUser,
  // })),
  // on(addUser, (state, user) => ({
  //   ...state,
  //   usersData: [...state.usersData, user],
  // })),
  // on(updateUsersList, (state, props) => ({ ...state, usersData: props.users }))
);
