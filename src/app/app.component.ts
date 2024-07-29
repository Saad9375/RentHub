import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { users } from './shared/data/initial-data';
import { AppConstants } from './shared/const/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'assignment-basics';
  platformId: any;

  /**
   * Creates an instance of AppComponent.
   *
   * @memberOf AppComponent
   */
  constructor() {
    this.platformId = inject(PLATFORM_ID);
  }

  /**
   * @description set usersList in sessionStorage
   * @memberOf AppComponent
   */
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(AppConstants.USERS_LIST, JSON.stringify(users));
    }
  }
}
