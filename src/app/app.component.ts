import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { updateUsersList } from './store/app.actions';
import { fetchUsers } from './store/app.selectors';
import { UserInfo } from './shared/models/user-info.model';
import { isPlatformBrowser } from '@angular/common';

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
      let sessionUsers = sessionStorage.getItem('usersList');
      if (sessionUsers) {
        this.store.dispatch(
          updateUsersList({ users: JSON.parse(sessionUsers) })
        );
      } else {
        this.store
          .pipe(select(fetchUsers))
          .subscribe((users: UserInfo[]) => {
            sessionStorage.setItem('usersList', JSON.stringify(users));
          })
          .unsubscribe();
      }
    }
  }
}
