import { PropertyDetailsComponent } from './property-details.component';

export const routes = [
  {
    path: ':id',
    component: PropertyDetailsComponent,
  },
  { path: '', component: PropertyDetailsComponent },
];
