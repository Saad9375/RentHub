import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { UserInfo } from '../models/user-info.model';
import { users } from '../data/initial-data';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  let signedInUser!: UserInfo;
  if (isPlatformBrowser(platformId)) {
    let usersList = JSON.parse(sessionStorage.getItem('usersList') as string);
    if (!usersList) {
      sessionStorage.setItem('usersList', JSON.stringify(users));
    }
    signedInUser = JSON.parse(sessionStorage.getItem('signedInUser') as string);
    if (!signedInUser) {
      router.navigate(['/login']);
    }
  }
  return !!signedInUser;
};
