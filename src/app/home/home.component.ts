import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Property } from '../shared/models/property.model';
import { AdvertisementComponent } from '../advertisement/advertisement.component';
import { RouterLink } from '@angular/router';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getPropertyList } from '../store/app.selectors';
import { updatePropertyList } from '../store/app.actions';
import { UserInfo } from '../shared/models/user-info.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, AdvertisementComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() showFavourites = false;
  propertyList: Property[] = [];
  originalPropertyList: Property[] = [];
  subscription!: Subscription;
  signedInUser!: UserInfo;
  users!: UserInfo[];
  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.signedInUser = JSON.parse(
      sessionStorage.getItem('signedInUser') as string
    );
    this.users = JSON.parse(sessionStorage.getItem('usersList') as string);
    this.subscription = this.store
      .pipe(select(getPropertyList))
      .subscribe((propertyList: Property[]) => {
        this.originalPropertyList = _.cloneDeep(propertyList);
        this.propertyList = _.cloneDeep(propertyList);
        if (this.signedInUser.role === 'landlord') {
          this.propertyList = this.propertyList.filter(
            (property: Property) =>
              property.userEmail === this.signedInUser.email
          );
        }
        if (this.showFavourites && this.signedInUser) {
          this.propertyList = this.propertyList.filter((property: Property) =>
            this.signedInUser.favourites.includes(property.id)
          );
        }
        console.log('Property List-', propertyList);
      });
  }
  toggleFavourite(id: number) {
    let isIdIncluded = this.signedInUser.favourites.includes(id);
    if (isIdIncluded) {
      this.signedInUser.favourites = this.signedInUser.favourites.filter(
        (propertyId: number) => propertyId !== id
      );
    } else {
      this.signedInUser.favourites.push(id);
    }
    this.storeUsersData();
  }

  private storeUsersData() {
    sessionStorage.setItem('signedInUser', JSON.stringify(this.signedInUser));
    let index = this.users.findIndex(
      (user: UserInfo) => user.email === this.signedInUser.email
    );
    if (index >= 0 && index !== -1) {
      this.users[index] = this.signedInUser;
      sessionStorage.setItem('usersList', JSON.stringify(this.users));
    }
  }
}
