import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { HomeComponent } from '../../home/home.component';
import { UserInfo } from '../models/user-info.model';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  let signedInUser!: UserInfo;
  if (isPlatformBrowser(platformId)) {
    signedInUser = JSON.parse(sessionStorage.getItem('signedInUser') as string);
    if (!signedInUser) {
      router.navigate(['/login']);
    }
  }
  return !!signedInUser;
};