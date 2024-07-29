import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

import { ActivatedRoute, Router } from '@angular/router';
import { NgStyle } from '@angular/common';

import _ from 'lodash';
import { AmenityKeys, listOfAmenities } from '../shared/const/amenities';
import { select, Store } from '@ngrx/store';
import { getPropertyList } from '../store/app.selectors';
import { Property } from '../shared/models/property.model';
import { addProperty, updatePropertyList } from '../store/app.actions';

@Component({
  selector: 'app-new-property',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, NgStyle],
  templateUrl: './new-property.component.html',
  styleUrl: './new-property.component.scss',
})
export class NewPropertyComponent implements OnInit {
  newPropertyForm!: FormGroup;
  listOfAmenities = listOfAmenities;
  amenityKeys = AmenityKeys;
  isSubmit = false;
  urls: any = [];
  images: string[] = [];
  imageFiles: File[] = [];
  maxId!: number;
  isEdit = false;
  id?: number;
  property?: Property;
  properties: Property[] = [];

  /**
   * Creates an instance of NewPropertyComponent.
   * @param {FormBuilder} formBuilder
   * @param {Store} store
   * @param {Router} router
   * @param {ActivatedRoute} activatedRoute
   *
   * @memberOf NewPropertyComponent
   */
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * @description getter OF FormArray - Amenities
   * @readonly
   * @type {FormArray<FormControl>}
   * @memberOf NewPropertyComponent
   */
  get amenities(): FormArray<FormControl> {
    return this.newPropertyForm.get('amenities') as FormArray;
  }

  /**
   * @description initializes the data, creates the form and populates data incase of Edit
   * @memberOf NewPropertyComponent
   */
  ngOnInit() {
    this.initializeData();
    this.createNewForm();
    this.getStoreData();
  }

  /**
   * @description triggers when user uploads image
   * @param {*} event
   *
   * @memberOf NewPropertyComponent
   */
  onSelectFile(event: any) {
    if (event.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.imageFiles.push(event.target.files[0]);
      reader.onload = (event: any) => {
        this.urls.push(event.target.result);
      };
    }
  }

  /**
   * @description used to delete the selected image
   * @param {number} index
   *
   * @memberOf NewPropertyComponent
   */
  deleteImage(index: number) {
    this.urls.splice(index, 1);
    if (index < this.images.length) {
      this.images.splice(index, 1);
    } else {
      this.imageFiles.splice(index - this.images.length, 1);
    }
  }

  /**
   * @description this function is triggered to submit the form
   * @memberOf NewPropertyComponent
   */
  createPost() {
    this.isSubmit = true;
    if (this.newPropertyForm.valid) {
      let amenities: string[] = [];
      this.amenities.value.forEach((amenity: boolean, index: number) => {
        if (amenity) {
          amenities.push(listOfAmenities[index]);
        }
      });
      let signedInUser = JSON.parse(
        sessionStorage.getItem('signedInUser') as string
      );
      let property: Property = {
        id: this.isEdit ? (this.id as number) : this.maxId + 1,
        propertyType: this.newPropertyForm.value.propertyType,
        isSharedProperty: this.newPropertyForm.value.isSharedProperty,
        address: this.newPropertyForm.value.address,
        city: this.newPropertyForm.value.city,
        state: this.newPropertyForm.value.state,
        area: this.newPropertyForm.value.area,
        leaseType: this.newPropertyForm.value.leaseType,
        rentAmount: this.newPropertyForm.value.rentAmount,
        isNegotiable: this.newPropertyForm.value.isNegotiable,
        isFurnished: this.newPropertyForm.value.isFurnished,
        title: this.newPropertyForm.value.title,
        images: [],
        description: this.newPropertyForm.value.description,
        imageFiles: this.imageFiles,
        comments: [],
        amenities: amenities,
        userEmail: signedInUser.email,
      };
      if (this.isEdit) {
        property = {
          ...property,
          id: this.id as number,
          images: this.images,
          comments: this.property?.comments ?? [],
        };
        let index = this.properties.findIndex(
          (property: Property) => property.id === this.id
        );
        if (index >= 0 && index !== -1) {
          this.properties[index] = property;
        }
        this.store.dispatch(
          updatePropertyList({ properties: this.properties })
        );
        this.router.navigateByUrl('/home');
      } else {
        this.store.dispatch(addProperty(property));
        this.router.navigateByUrl('/home');
      }
    }
  }

  /**
   * @description this function is used to create a new form
   * @private
   *
   * @memberOf NewPropertyComponent
   */
  private createNewForm() {
    this.newPropertyForm = this.formBuilder.group({
      propertyType: ['apartment', Validators.required],
      isSharedProperty: [false, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      area: ['', Validators.required],
      leaseType: ['Long Term', Validators.required],
      rentAmount: ['', Validators.required],
      isNegotiable: [false],
      isFurnished: [true, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null],
    });
    let initialAmenities = [];
    for (let index = 0; index < this.listOfAmenities.length; index++) {
      initialAmenities.push(new FormControl(false));
    }
    this.newPropertyForm.addControl(
      'amenities',
      new FormArray(initialAmenities)
    );
  }

  /**
   *
   * @description populate the existing data in the form for Edit case
   * @private
   * @memberOf NewPropertyComponent
   */
  private populateExistingData() {
    if (this.property?.amenities?.length) {
      let amenities = [];
      for (let index = 0; index < this.listOfAmenities.length; index++) {
        if (this.property?.amenities?.includes(listOfAmenities[index])) {
          amenities.push(new FormControl(true));
        } else {
          amenities.push(new FormControl(false));
        }
      }
      this.newPropertyForm.removeControl('amenities');
      this.newPropertyForm.addControl('amenities', new FormArray(amenities));
    }
    this.newPropertyForm.patchValue({
      propertyType: this.property?.propertyType,
      isSharedProperty: this.property?.isSharedProperty,
      address: this.property?.address,
      city: this.property?.city,
      state: this.property?.state,
      area: this.property?.area,
      leaseType: this.property?.leaseType,
      rentAmount: this.property?.rentAmount,
      isNegotiable: this.property?.isNegotiable,
      isFurnished: this.property?.isFurnished,
      title: this.property?.title,
      description: this.property?.description,
      image: null,
    });
    if (this.property?.images.length) {
      this.images = this.property.images;
      this.urls = this.images.map((image: string) => 'assets/' + image);
    }
    if (this.property?.imageFiles?.length) {
      this.imageFiles = this.property.imageFiles;
      this.property?.imageFiles.forEach((imageFile: File) => {
        let reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event: any) => {
          this.urls.push(event.target.result.toString());
        };
      });
    }
  }

  /**
   * @description used to fetch relevant data from the store
   * @private
   *
   * @memberOf NewPropertyComponent
   */
  private getStoreData() {
    this.store
      .pipe(select(getPropertyList))
      .subscribe((propertyList: Property[]) => {
        this.properties = _.cloneDeep(propertyList);
        if (!this.isEdit) {
          let id = this.properties.map((property: Property) => property.id);
          this.maxId = Math.max(...id);
        } else if (this.id) {
          this.property = this.properties.find(
            (property: Property) => property.id === this.id
          );
          if (this.property) {
            this.populateExistingData();
          }
        }
      });
  }

  /**
   * @description initialize default values and fetch query params
   * @private
   *
   * @memberOf NewPropertyComponent
   */
  private initializeData() {
    this.isEdit = false;
    this.urls = [];
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['isEdit']) {
        this.isEdit = true;
      }
      this.id = +params['id'];
    });
  }
}
