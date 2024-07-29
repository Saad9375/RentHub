import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserInfo } from '../models/user-info.model';
import { AppConstants } from '../const/app.constants';

export const authGuard: CanActivateFn = (next: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  let signedInUser!: UserInfo;
  if (isPlatformBrowser(platformId)) {
    signedInUser = JSON.parse(
      sessionStorage.getItem(AppConstants.SIGNED_IN_USER) as string
    );
    if (!signedInUser) {
      router.navigate(['/login']);
    }
  }
  return !!signedInUser;
};
