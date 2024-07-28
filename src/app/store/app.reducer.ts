import { createReducer, on } from '@ngrx/store';
import { propertyList, users } from '../shared/data/initial-data';
import { UserInfo } from '../shared/models/user-info.model';
import { Property } from '../shared/models/property.model';
import {
  addProperty,
  addUser,
  setSignedInUser,
  updatePropertyList,
  updateUsersList,
} from './app.actions';

export interface AppState {
  usersData: UserInfo[];
  signedInUser: UserInfo | null;
  propertyList: Property[];
  images: any;
}

export const initialState: AppState = {
  usersData: users,
  signedInUser: null,
  propertyList: propertyList,
  images: [],
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
  })),
  on(setSignedInUser, (state, props) => ({
    ...state,
    signedInUser: props.signedInUser,
  })),
  on(addUser, (state, user) => ({
    ...state,
    usersData: [...state.usersData, user],
  })),
  on(updateUsersList, (state, props) => ({ ...state, usersData: props.users }))
);
