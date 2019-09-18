import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { UsersStateService } from '../../states/users/users-state.service';

/**
 * Users service to work with api
 */
@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl;
 
  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,
   
  ) {}

  /**
   * Get all users
   */
  public getAllusers() {
    return this.http.get(this.apiUrl + 'users');
  }

  /**
   * Get current user
   */
  public getCurrentUser() {
    return this.http.get(this.apiUrl + 'users/current');
  }
  /* public getCurrentUser() {
    return this.http.get(this.apiUrl + 'users/current').subscribe((res) => {
      this.currentUser = res;
  //    this.userState.onInitCurrentUser(res);
    });
  }*/



  /**
   * Get user info
   */
  public getCurrentUserInfo() {
    return this.http.get(this.apiUrl + 'users/current');
  }

}
