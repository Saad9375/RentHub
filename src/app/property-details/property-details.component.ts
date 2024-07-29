import { Component, OnInit } from '@angular/core';
import { Property } from '../shared/models/property.model';
import _ from 'lodash';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserInfo } from '../shared/models/user-info.model';
import { NgClass, NgStyle } from '@angular/common';
import { AmenityKeys, listOfAmenities } from '../shared/const/amenities';
import { select, Store } from '@ngrx/store';
import { getPropertyList } from '../store/app.selectors';
import { updatePropertyList } from '../store/app.actions';
import { AppConstants } from '../shared/const/app.constants';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [FormsModule, NgStyle, NgClass, RouterLink],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit {
  listOfAmenities = listOfAmenities;
  amenityKeys = AmenityKeys;
  property?: Property;
  imageUrls: string[] = [];
  propertyList: Property[] = [];
  id!: number;
  comments: Array<{ user: string; comment: string }> = [];
  newComment: string = '';
  user!: UserInfo;
  users!: UserInfo[];
  Constants = AppConstants;

  /**
   * Creates an instance of PropertyDetailsComponent.
   * @param {ActivatedRoute} route
   * @param {Store} store
   *
   * @memberOf PropertyDetailsComponent
   */
  constructor(private route: ActivatedRoute, private store: Store) {}

  /**
   * @description initializes data once the component is loaded
   * @memberOf PropertyDetailsComponent
   */
  ngOnInit() {
    this.getPageData();
  }

  /**
   * @description getter of isFavourite property to determine whether proper is marked favourite
   * or not
   * @readonly
   * @type {boolean}
   * @memberOf PropertyDetailsComponent
   */
  get isFavourite(): boolean {
    let isFavourite = false;
    if (this.property) {
      isFavourite = !!this.user?.favourites?.includes(this.property.id);
    }
    return isFavourite;
  }

  /**
   * @description used to submit a new comment
   * @memberOf PropertyDetailsComponent
   */
  submit() {
    if (this.newComment) {
      this.property?.comments.push({
        user: this.user as UserInfo,
        comment: this.newComment,
      });
    }
    this.newComment = '';
    this.store.dispatch(updatePropertyList({ properties: this.propertyList }));
  }

  /**
   * @description used to toggle the favourite status of the selected property
   * @memberOf PropertyDetailsComponent
   */
  toggleFavourite() {
    if (this.isFavourite) {
      this.user.favourites = this.user.favourites.filter(
        (propertyId: number) => propertyId !== this.property?.id
      );
    } else {
      this.user.favourites.push(this.property?.id as number);
    }
    this.storeUsersData();
  }

  /**
   * @description called to upload modified user's data once the favourites are changed
   * @private
   *
   * @memberOf PropertyDetailsComponent
   */
  private storeUsersData() {
    sessionStorage.setItem(
      AppConstants.SIGNED_IN_USER,
      JSON.stringify(this.user)
    );
    let index = this.users.findIndex(
      (user: UserInfo) => user.email === this.user.email
    );
    if (index >= 0 && index !== -1) {
      this.users[index] = this.user;
      sessionStorage.setItem(
        AppConstants.USERS_LIST,
        JSON.stringify(this.users)
      );
    }
  }

  /**
   * @description used to fetch and display all the relevant data
   * @private
   *
   * @memberOf PropertyDetailsComponent
   */
  private getPageData() {
    this.route.params.subscribe((param) => {
      this.id = +param['id'];
    });
    this.user = JSON.parse(
      sessionStorage.getItem(AppConstants.SIGNED_IN_USER) as string
    );
    this.users = JSON.parse(
      sessionStorage.getItem(AppConstants.USERS_LIST) as string
    );

    this.store
      .pipe(select(getPropertyList))
      .subscribe((propertyList: Property[]) => {
        this.propertyList = _.cloneDeep(propertyList);
        if (this.id) {
          this.property = this.propertyList.find(
            (property: Property) => property.id === this.id
          );
        }
      });

    this.property?.images?.forEach((image: string) => {
      this.imageUrls.push('assets/' + image);
    });

    if (this.property?.imageFiles?.length) {
      this.property?.imageFiles.forEach((imageFile: File) => {
        let reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event: any) => {
          this.imageUrls.push(event.target.result.toString());
        };
      });
    }
  }
}
