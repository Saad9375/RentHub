import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Property } from '../shared/models/property.model';
import { AdvertisementComponent } from '../advertisement/advertisement.component';
import { RouterLink } from '@angular/router';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getPropertyList } from '../store/app.selectors';
import { UserInfo } from '../shared/models/user-info.model';
import { NgStyle } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterComponent } from '../filter/filter.component';
import { FilterData } from '../shared/models/filter-data.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, AdvertisementComponent, RouterLink, NgStyle],
  providers: [MatDialogModule],
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
  displayStyle = 'none';
  isFilterApplied = false;

  constructor(private store: Store, private dialog: MatDialog) {}

  clearFilter() {
    this.isFilterApplied = false;
    this.propertyList = this.originalPropertyList;
  }
  openPopup() {
    let dialogRef = this.dialog.open(FilterComponent, {
      width: '500px',
      height: '420px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result?: FilterData) => {
      console.log('Result-', result);
      if (result?.action === 'Apply') {
        this.propertyList = this.originalPropertyList;
        this.isFilterApplied = true;
        if (result?.area) {
          this.propertyList = this.propertyList.filter(
            (property: Property) =>
              property.address.includes(result.area) ||
              property.city.includes(result.area) ||
              property.state.includes(result.area)
          );
        }
        if (result?.rentStartingRange && result.rentEndingRange) {
          this.propertyList = this.propertyList.filter(
            (property: Property) =>
              property.rentAmount >= result.rentStartingRange &&
              property.rentAmount <= result.rentEndingRange
          );
        } else if (result?.rentStartingRange && !result?.rentEndingRange) {
          this.propertyList = this.propertyList.filter(
            (property: Property) =>
              property.rentAmount >= result.rentStartingRange
          );
        } else if (!result?.rentStartingRange && result?.rentEndingRange) {
          this.propertyList = this.propertyList.filter(
            (property: Property) =>
              property.rentAmount <= result.rentEndingRange
          );
        }
        if (result?.amenities) {
          this.propertyList = this.propertyList.filter((property: Property) => {
            let filter = true;
            for (let amenity of result.amenities) {
              if (!property.amenities?.includes(amenity)) {
                filter = false;
                break;
              }
            }
            return filter;
          });
        }
      } else if (result?.action === 'Clear') {
        this.isFilterApplied = false;
        this.propertyList = this.originalPropertyList;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.isFilterApplied = false;
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
          this.originalPropertyList = _.cloneDeep(this.propertyList);
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
