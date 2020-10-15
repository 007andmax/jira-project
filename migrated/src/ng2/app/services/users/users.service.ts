import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { UsersStateService } from '../../states/users/users-state.service';
import { tap, map } from 'rxjs/operators';
import { User } from '../../components/users/class/user';

/**
 * Users service to work with api
 */
@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl;
  public currentUser: any;
  //allUsers = [];

  /**
   * Users api service constructor
   * @param {HttpClient} http Service to work with request
   */
  public constructor(
    private http: HttpClient,

  ) { }

  /**
   * Get all users
   */
  public getAllusers() {

    return this.http.get(this.apiUrl + 'users').pipe(
      map((data: any) => data.map((item) => new User(item))));
  }

  public changeUserRole(userId, roleName) {
    return this.http.put(this.apiUrl + '/users/updateRole/' + userId + '?role=' + roleName.toUpperCase(), {});

  }

  /**
   * Get current user
   */
  public getCurrentUser() {
    return this.http.get(this.apiUrl + 'users/current');
  }

  public checkValidPrimaryEmail(email,companyId) {
    return this.http.get(this.apiUrl + 'users/isEmailUnique?email=' + email + '&id=&isTechUser=false&companyId=' + companyId);
  }

  getUser() {
    return this.http.get(this.apiUrl + 'users/current').subscribe((res) => {
      this.currentUser = res;
    });
  }
  changeUserPermissions(permissions) {
    return this.currentUser.permissions = permissions;
  }

  /**
   * Get user info
   */
  public getCurrentUserInfo() {
    return this.http.get(this.apiUrl + 'users/current');
  }

  public setSubscriptions(data) {
    return this.http.put(this.apiUrl + `subscription/${data.id}`, data);
  }

  public addUser(data) {

    return this.http.post(this.apiUrl + `users`, data);
  }
  public changeAvatar(id, data) {

    return this.http.post(this.apiUrl + `users/${id}/avatar`, data);
  }
  public updateUser(data) {

    return this.http.put(this.apiUrl + `users/${data.id}`, data);
  }
  public onArchiveUsers(ids) {
    return this.http.post(this.apiUrl + `users/archive`, { ids: ids });
  }
  public onDeArchiveUsers(ids) {
    return this.http.post(this.apiUrl + `users/dearchive`, { ids: ids });
  }

}
