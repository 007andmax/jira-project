import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';


@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl;
  public currentUser: any;

  constructor(
    private http: HttpClient
  ) {

  }
  getAllusers() {
    return this.http.get(this.apiUrl + 'users');
  }

  getCurrentUser() {
    return this.http.get(this.apiUrl + 'users/current').subscribe((res) => {
      this.currentUser = res;
    });
  }

  changeUserPermissions(permissions) {
    return this.currentUser.permissions = permissions;
  }

  getCurrentUserInfo() {
    return this.http.get(this.apiUrl + 'users/current');
  }

}
