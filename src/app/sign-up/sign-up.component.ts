import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserInfo } from '../shared/models/user-info.model';
import { NgStyle } from '@angular/common';
import { Store } from '@ngrx/store';
import { users } from '../shared/data/initial-data';
import { AppConstants } from '../shared/const/app.constants';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [HeaderComponent, RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  isSubmit = false;
  users: UserInfo[] = [];
  Constants = AppConstants;

  /**
   * Creates an instance of SignUpComponent.
   * @param {FormBuilder} formBuilder
   * @param {Router} router
   *
   * @memberOf SignUpComponent
   */
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  /**
   * @description creates a form and initializes the data
   * @memberOf SignUpComponent
   */
  ngOnInit() {
    this.isSubmit = false;
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      role: [AppConstants.RENTER, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * @description this function is triggered once the user submits the
   * form to signup a new user
   *
   * @memberOf SignUpComponent
   */
  signup() {
    this.isSubmit = true;
    if (this.signupForm.valid) {
      this.users = JSON.parse(
        sessionStorage.getItem(AppConstants.USERS_LIST) as string
      );
      if (!this.users) {
        sessionStorage.setItem(AppConstants.USERS_LIST, JSON.stringify(users));
        this.users = users;
      }
      let userFound: UserInfo | undefined;
      if (this.users?.length) {
        userFound = this.users.find(
          (user: UserInfo) => user.email === this.signupForm.value.email
        );
        if (userFound) {
          alert('User already exists !!');
        } else {
          sessionStorage.setItem(
            AppConstants.USERS_LIST,
            JSON.stringify([...this.users, this.signupForm.value])
          );
          alert(
            `${this.signupForm.value.name} has been successfully registered !! Please login to continue.`
          );
          this.router.navigate(['/login']);
        }
      }
    }
  }
}
