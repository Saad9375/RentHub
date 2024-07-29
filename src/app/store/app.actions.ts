import { createAction, props } from '@ngrx/store';
import { Property } from '../shared/models/property.model';

export const addProperty = createAction('Add Property', props<Property>());

export const updatePropertyList = createAction(
  'Update Property List',
  props<{ properties: Property[] }>()
);

// export const setSignedInUser = createAction(
//   'Set Signed in User',
//   props<{ signedInUser: UserInfo | null }>()
// );

// export const addUser = createAction(
//   'Add a user after successful signup',
//   props<UserInfo>()
// );

// export const updateUsersList = createAction(
//   'Update Users List',
//   props<{ users: UserInfo[] }>()
// );
