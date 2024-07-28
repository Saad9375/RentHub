import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'new-property',
    loadComponent: () =>
      import('./new-property/new-property.component').then(
        (m) => m.NewPropertyComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'favourites',
    loadComponent: () =>
      import('./favourites/favourites.component').then(
        (m) => m.FavouritesComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'property-details',
    loadChildren: () =>
      import('./property-details/property-details-routes').then(
        (m) => m.routes
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
