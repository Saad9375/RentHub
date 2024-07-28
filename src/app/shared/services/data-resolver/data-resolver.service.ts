// import { inject, Injectable, PLATFORM_ID } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   Resolve,
//   Router,
//   RouterStateSnapshot,
// } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { UserInfo } from '../../models/user-info.model';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root',
// })
// export class DataResolverService implements Resolve<UserInfo> {
//   platformId = inject(PLATFORM_ID);
//   constructor(private store: Store, private router: Router) {}

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     let signedInUser!: UserInfo;
//     let role: string;
//     if (isPlatformBrowser(this.platformId)) {
//       signedInUser = JSON.parse(
//         sessionStorage.getItem('signedInUser') as string
//       );
//       if (signedInUser) {
//         role = signedInUser.role;
//       }
//     }
//     return role;
//   }
// }
