import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInfo } from '../../models/user-info.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<UserInfo[]>('http://localhost:3000/users');
  }

  signup(user: UserInfo) {
    return this.http.post('http://localhost:3000/users', user);
  }
}
