import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { UsersStateService } from '../../states/users/users-state.service';
import { tap, map } from 'rxjs/operators';
import { User } from '../../components/users/class/user';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';

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
    private toastrService: ToastrService,
    private appStateService: AppStateService

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
  public resetPrimaryContact(userId) {
    return this.http.get(this.apiUrl + '/company/resetPrimaryContact?userId=' + userId);
  }
  public checkValidPrimaryEmail(email, companyId, idUser = null) {
    return this.http.get(this.apiUrl + 'users/isEmailUnique?email=' + email + '&id=' + idUser + '&isTechUser=false&companyId=' + companyId);
  }

  public setSubscriptions(data) {
    return this.http.put(this.apiUrl + `subscription/${data.id}`, data);
  }

  public addUser(data) {

    return this.http.post(this.apiUrl + `users`, data).pipe(
      tap(data => {
        this.toastrService.success("The new user has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public changeAvatar(id, data) {

    return this.http.post(this.apiUrl + `users/${id}/avatar`, data);
  }
  public updateUser(data) {

    return this.http.put(this.apiUrl + `users/${data.id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The user has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public onArchiveUsers(ids) {
    return this.http.post(this.apiUrl + `users/archive`, { ids: ids }).pipe(
      tap(data => {
        this.toastrService.success("The user has been successfully archived");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public onDeArchiveUsers(ids) {
    return this.http.post(this.apiUrl + `users/dearchive`, { ids: ids });
  }

}
