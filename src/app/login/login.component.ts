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
import { users as usersList } from '../shared/data/initial-data';
import { AppConstants } from '../shared/const/app.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, RouterLink, ReactiveFormsModule, NgStyle],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  isSubmit = false;
  loginForm!: FormGroup;
  Constants = AppConstants;

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  /**
   * @description called when the component is loaded to initialize the data and form
   * @memberOf LoginComponent
   */
  ngOnInit() {
    this.isSubmit = false;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * @description logic to signin the user
   * @memberOf LoginComponent
   */
  login() {
    this.isSubmit = true;
    if (this.loginForm.valid) {
      let users = JSON.parse(
        sessionStorage.getItem(AppConstants.USERS_LIST) as string
      );
      if (!users) {
        sessionStorage.setItem(
          AppConstants.USERS_LIST,
          JSON.stringify(usersList)
        );
        users = usersList;
      }
      let user = users.find(
        (user: UserInfo) =>
          user.email === this.loginForm.value.email &&
          user.password === this.loginForm.value.password
      );
      if (user) {
        sessionStorage.setItem(
          AppConstants.SIGNED_IN_USER,
          JSON.stringify(user)
        );
        this.router.navigate(['/home']);
      } else {
        alert('Not a valid user !!');
      }
    }
  }
}
