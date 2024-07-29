import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showSideButtons: string = 'none';
  @Input() title = 'Rent Hub';

  /**
   * Creates an instance of HeaderComponent.
   * @param {Store} store
   * @param {Router} router
   *
   * @memberOf HeaderComponent
   */
  constructor(private store: Store, private router: Router) {}

  /**
   * @description this function is used to signout the user
   * @memberOf HeaderComponent
   */
  logout() {
    let logoutConfirmation = confirm(
      'Are you sure you want to Logout !!'
    ).valueOf();
    if (logoutConfirmation) {
      sessionStorage.removeItem('signedInUser');
      this.router.navigate(['/login']);
    }
  }
}
