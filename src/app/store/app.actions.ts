import { createAction, props } from '@ngrx/store';
import { Property } from '../shared/models/property.model';

export const addProperty = createAction('Add Property', props<Property>());

export const updatePropertyList = createAction(
  'Update Property List',
  props<{ properties: Property[] }>()
);
