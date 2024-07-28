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

  ngOnChanges() {
    console.log('Property List-', this.property);
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
      console.log('New Images-', this.property);
    }
  }

  get isFavourite(): boolean {
    let isFavourite = false;
    if (this.property) {
      isFavourite = !!this.signedInUser?.favourites?.includes(this.property.id);
    }
    return isFavourite;
  }

  toggleFavourite() {
    this.favouriteToggleEvent.emit(this.property.id);
  }
}
