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

  constructor(private store: Store, private router: Router) {}

  logout() {
    let logoutConfirmation = confirm(
      'Are you sure you want to Logout !!'
    ).valueOf();
    if (logoutConfirmation) {
      // this.store.dispatch(setSignedInUser({ signedInUser: null }));
      sessionStorage.removeItem('signedInUser');
      this.router.navigate(['/login']);
    }
  }
}
