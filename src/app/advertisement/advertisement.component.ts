import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Property } from '../shared/models/property.model';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserInfo } from '../shared/models/user-info.model';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [NgStyle, RouterLink],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.scss',
})
export class AdvertisementComponent implements OnChanges {
  @Input() property!: Property;
  @Input() signedInUser!: UserInfo;
  @Input() users!: UserInfo[];
  @Output() favouriteToggleEvent = new EventEmitter();
  imageUrls: string[] = [];
  constructor() {}

  /**
   * @description this will be executed whenever any input value will change and will reflect the data on UI
   * @memberOf AdvertisementComponent
   */
  ngOnChanges() {
    this.imageUrls = this.property?.images?.map(
      (image: string) => 'assets/' + image
    );
    if (this.property?.imageFiles?.length) {
      this.property?.imageFiles.forEach((imageFile: File) => {
        let reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event: any) => {
          this.imageUrls?.push(event.target.result.toString());
        };
      });
    }
  }

  /**
   * @description getter of isFavourite property
   * @readonly
   * @type {boolean}
   * @memberOf AdvertisementComponent
   */
  get isFavourite(): boolean {
    let isFavourite = false;
    if (this.property) {
      isFavourite = !!this.signedInUser?.favourites?.includes(this.property.id);
    }
    return isFavourite;
  }

  /**
   * @description will be triggered when user tries to change the favourite status
   * @memberOf AdvertisementComponent
   */
  toggleFavourite() {
    this.favouriteToggleEvent.emit(this.property.id);
  }
}
