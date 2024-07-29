import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Property } from '../shared/models/property.model';
import { AdvertisementComponent } from '../advertisement/advertisement.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getPropertyList } from '../store/app.selectors';
import { UserInfo } from '../shared/models/user-info.model';
import { NgStyle } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FilterComponent } from '../filter/filter.component';
import { FilterData } from '../shared/models/filter-data.model';
import { AppConstants } from '../shared/const/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, AdvertisementComponent, RouterLink, NgStyle],
  providers: [MatDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  showFavourites = false;
  propertyList: Property[] = [];
  originalPropertyList: Property[] = [];
  subscription!: Subscription;
  signedInUser!: UserInfo;
  users!: UserInfo[];
  displayStyle = 'none';
  isFilterApplied = false;
  Constants = AppConstants;

  /**
   * Creates an instance of HomeComponent.
   * @param {Store} store
   * @param {MatDialog} dialog
   * @param {ActivatedRoute} activatedRoute
   *
   * @memberOf HomeComponent
   */
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * @description this function clears the applied filters
   * @memberOf HomeComponent
   */
  clearFilter() {
    this.isFilterApplied = false;
    this.propertyList = this.originalPropertyList;
  }

  /**
   * @description opens Filter Dialog and filter data as per the applied filters
   * @memberOf HomeComponent
   */
  openFilterDialog() {
    let dialogRef = this.dialog.open(FilterComponent, {
      width: '500px',
      height: '420px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result?: FilterData) => {
      if (result?.action === 'Apply') {
        this.propertyList = this.originalPropertyList;
        this.isFilterApplied = true;
        this.filterPropertyList(result);
      } else if (result?.action === 'Clear') {
        this.isFilterApplied = false;
        this.propertyList = this.originalPropertyList;
      }
    });
  }

  /**
   * @description Unsubscribe all the subscriptions when component is destroyed
   * @memberOf HomeComponent
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * initializes data once the component is loaded
   * @memberOf HomeComponent
   */
  ngOnInit() {
    this.isFilterApplied = false;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.showFavourites = params['showFavourites'];
    });
    this.getPageData();
  }

  /**
   * @description toggles the status of the property to favourite/Non Favourite
   * @param {number} id
   * @memberOf HomeComponent
   */
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
    this.filterFavourites();
  }

  /**
   * @description store user's data after changing the favourites status
   * @private
   * @memberOf HomeComponent
   */
  private storeUsersData() {
    sessionStorage.setItem(
      AppConstants.SIGNED_IN_USER,
      JSON.stringify(this.signedInUser)
    );
    let index = this.users.findIndex(
      (user: UserInfo) => user.email === this.signedInUser.email
    );
    if (index >= 0 && index !== -1) {
      this.users[index] = this.signedInUser;
      sessionStorage.setItem(
        AppConstants.USERS_LIST,
        JSON.stringify(this.users)
      );
    }
  }

  /**
   * @description get all the data required to load this page
   * @private
   * @memberOf HomeComponent
   */
  private getPageData() {
    this.signedInUser = JSON.parse(
      sessionStorage.getItem(AppConstants.SIGNED_IN_USER) as string
    );
    this.users = JSON.parse(
      sessionStorage.getItem(AppConstants.USERS_LIST) as string
    );
    this.subscription = this.store
      .pipe(select(getPropertyList))
      .subscribe((propertyList: Property[]) => {
        this.originalPropertyList = _.cloneDeep(propertyList);
        this.propertyList = _.cloneDeep(propertyList);
        if (this.signedInUser.role === AppConstants.LANDLORD) {
          this.propertyList = this.propertyList.filter(
            (property: Property) =>
              property.userEmail === this.signedInUser.email
          );
          this.originalPropertyList = _.cloneDeep(this.propertyList);
        }
        this.filterFavourites();
      });
  }

  /**
   * @description filter all the favourite properties wrt the user once favourites
   * page is opened
   * @private
   * @memberOf HomeComponent
   */
  private filterFavourites() {
    if (this.showFavourites && this.signedInUser) {
      this.propertyList = this.propertyList.filter((property: Property) =>
        this.signedInUser.favourites.includes(property.id)
      );
    }
  }

  /**
   * @description logic to filter propertyList based on the applied filters
   *
   * @private
   * @param {FilterData} [result]
   *
   * @memberOf HomeComponent
   */
  private filterPropertyList(result?: FilterData) {
    if (result?.area) {
      this.propertyList = this.propertyList.filter(
        (property: Property) =>
          property.address.toUpperCase().includes(result.area.toUpperCase()) ||
          property.city.toUpperCase().includes(result.area.toUpperCase()) ||
          property.state.toUpperCase().includes(result.area.toUpperCase())
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
        (property: Property) => property.rentAmount >= result.rentStartingRange
      );
    } else if (!result?.rentStartingRange && result?.rentEndingRange) {
      this.propertyList = this.propertyList.filter(
        (property: Property) => property.rentAmount <= result.rentEndingRange
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
  }
}
