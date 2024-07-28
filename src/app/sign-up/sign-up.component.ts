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
import { select, Store } from '@ngrx/store';
import { fetchUsers } from '../store/app.selectors';
import { addUser } from '../store/app.actions';

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
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.isSubmit = false;
    this.signupForm = this.formBuilder.group({
      name: ['', Validators.required],
      role: ['renter', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  signup() {
    this.isSubmit = true;
    if (this.signupForm.valid) {
      this.store.pipe(select(fetchUsers)).subscribe((users: UserInfo[]) => {
        let userFound: UserInfo | undefined;
        this.users = users;
        if (this.users?.length) {
          userFound = this.users.find(
            (user: UserInfo) => user.email === this.signupForm.value.email
          );
          if (userFound) {
            alert('User already exists !!');
          } else {
            this.store.dispatch(addUser(this.signupForm.value));
            sessionStorage.setItem(
              'usersList',
              JSON.stringify([...this.users, this.signupForm.value])
            );
            alert(
              `${this.signupForm.value.name} has been successfully registered !! Please login to continue.`
            );
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }
}
