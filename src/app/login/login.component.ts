import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { UserInfo } from '../shared/models/user-info.model';
import { NgStyle } from '@angular/common';
import { select, Store } from '@ngrx/store';

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
  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.isSubmit = false;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log('LoginForm-', this.loginForm);
    this.isSubmit = true;
    if (this.loginForm.valid) {
      let users = JSON.parse(sessionStorage.getItem('usersList') as string);
      let user = users?.find(
        (user: UserInfo) =>
          user.email === this.loginForm.value.email &&
          user.password === this.loginForm.value.password
      );
      if (user) {
        sessionStorage.setItem('signedInUser', JSON.stringify(user));
        this.router.navigate(['/home']);
      } else {
        alert('Not a valid user !!');
      }
    }
  }
}
