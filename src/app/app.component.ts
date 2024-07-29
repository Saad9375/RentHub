import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { users } from './shared/data/initial-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'assignment-basics';

  constructor(private store: Store) {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      sessionStorage.setItem('usersList', JSON.stringify(users));
      // if (sessionUsers) {
      //   this.store.dispatch(
      //     updateUsersList({ users: JSON.parse(sessionUsers) })
      //   );
      // } else {
      //   this.store
      //     .pipe(select(fetchUsers))
      //     .subscribe((users: UserInfo[]) => {
      //       sessionStorage.setItem('usersList', JSON.stringify(users));
      //     })
      //     .unsubscribe();
      // }
    }
  }
}
