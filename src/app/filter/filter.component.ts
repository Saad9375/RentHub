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

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FilterComponent>
  ) {}

  get amenities(): FormArray<FormControl> {
    return this.filterForm.get('amenities') as FormArray;
  }

  ngOnInit() {
    this.createForm();
  }

  clearFilter() {
    this.filterForm.reset();
    this.dialogRef.close({
      ...this.filterForm.value,
      amenities: [],
      action: 'Clear',
    });
  }

  close() {
    this.dialogRef.close();
  }

  applyFilters() {
    console.log('FilterForm-', this.filterForm);
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
