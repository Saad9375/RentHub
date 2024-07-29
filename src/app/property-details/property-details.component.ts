import { Component, OnInit } from '@angular/core';
import { Property } from '../shared/models/property.model';
import _ from 'lodash';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserInfo } from '../shared/models/user-info.model';
import { NgClass, NgStyle } from '@angular/common';
import { PropertyService } from '../shared/services/property/property.service';
import { AmenityKeys, listOfAmenities } from '../shared/const/amenities';
import { select, Store } from '@ngrx/store';
import { getPropertyList } from '../store/app.selectors';
import { updatePropertyList } from '../store/app.actions';

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

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.route.params.subscribe((param) => {
      this.id = +param['id'];
    });
    this.user = JSON.parse(sessionStorage.getItem('signedInUser') as string);
    this.users = JSON.parse(sessionStorage.getItem('usersList') as string);

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

  get isFavourite(): boolean {
    let isFavourite = false;
    if (this.property) {
      isFavourite = !!this.user?.favourites?.includes(this.property.id);
    }
    return isFavourite;
  }

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

  private storeUsersData() {
    sessionStorage.setItem('signedInUser', JSON.stringify(this.user));
    let index = this.users.findIndex(
      (user: UserInfo) => user.email === this.user.email
    );
    if (index >= 0 && index !== -1) {
      this.users[index] = this.user;
      sessionStorage.setItem('usersList', JSON.stringify(this.users));
    }
  }
}
