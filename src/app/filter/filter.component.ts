import { Component, OnInit } from '@angular/core';
import { listOfAmenities } from '../shared/const/amenities';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  listOfAmenities = listOfAmenities;
  filterForm!: FormGroup;

  /**
   * Creates an instance of FilterComponent.
   * @param {FormBuilder} formBuilder
   * @param {MatDialogRef<FilterComponent>} dialogRef
   *
   * @memberOf FilterComponent
   */
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FilterComponent>
  ) {}

  /**
   * getter of Form Array - amenities
   * @readonly
   * @type {FormArray<FormControl>}
   * @memberOf FilterComponent
   */
  get amenities(): FormArray<FormControl> {
    return this.filterForm.get('amenities') as FormArray;
  }

  /**
   * @description will initialize the form when component is loaded
   * @memberOf FilterComponent
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * @description will clear all the filters and closes the dialog
   * @memberOf FilterComponent
   */
  clearFilter() {
    this.filterForm.reset();
    this.dialogRef.close({
      ...this.filterForm.value,
      amenities: [],
      action: 'Clear',
    });
  }

  /**
   * @description this function will close the dialog
   * @memberOf FilterComponent
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * @description will be triggered when user submits the form and will pass all the filters
   *  to the parent component
   * @memberOf FilterComponent
   */
  applyFilters() {
    let amenities: string[] = [];
    this.amenities.value.forEach((amenity: boolean, index: number) => {
      if (amenity) {
        amenities.push(listOfAmenities[index]);
      }
    });
    this.dialogRef.close({
      ...this.filterForm.value,
      amenities: amenities,
      action: 'Apply',
    });
  }

  /**
   * @description will create a form for the filters
   * @private
   *
   * @memberOf FilterComponent
   */
  private createForm() {
    this.filterForm = this.formBuilder.group({
      area: [''],
      rentStartingRange: [''],
      rentEndingRange: [''],
    });
    let initialAmenities = [];
    for (let index = 0; index < this.listOfAmenities.length; index++) {
      initialAmenities.push(new FormControl(false));
    }
    this.filterForm.addControl('amenities', new FormArray(initialAmenities));
  }
}
