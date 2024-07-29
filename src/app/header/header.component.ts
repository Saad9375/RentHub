import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppConstants } from '../shared/const/app.constants';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showSideButtons: string = 'none';
  @Input() title = AppConstants.RENT_HUB;
  Constants = AppConstants;

  /**
   * Creates an instance of HeaderComponent.
   * @param {Store} store
   * @param {Router} router
   *
   * @memberOf HeaderComponent
   */
  constructor(private location: Location, private router: Router) {}

  goBack() {
    this.location.back();
  }
  /**
   * @description this function is used to signout the user
   * @memberOf HeaderComponent
   */
  logout() {
    let logoutConfirmation = confirm(
      'Are you sure you want to Logout !!'
    ).valueOf();
    if (logoutConfirmation) {
      sessionStorage.removeItem(AppConstants.SIGNED_IN_USER);
      this.router.navigate(['/login']);
    }
  }
}
