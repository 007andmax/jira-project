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

    return this.http.post(this.apiUrl + 'users/filter', {}).pipe(
      map((data: any) => data.map((item) => new User(item))));
  }

  public getArchiveUsers() {
    return this.http.post(this.apiUrl + 'users/filter', { isArchived: true, "accountType": "CLIENT" }).pipe(
      map((data: any) => data.map((item) => new User(item))));
  }

  public changeUserRole(userId, jobTypeId) {
    return this.http.put(this.apiUrl + '/users/jobType', {
      "userId": userId,
      "jobTypeId": jobTypeId
    });

  }

  /**
   * Get current user
   */
  public getCurrentUser() {
    return this.http.get(this.apiUrl + 'users/current');
  }

  public getMessagesUser(id, page) {
    return this.http.get(this.apiUrl + `email/${id}/user?size=20&page=${page}`);
  }
  public getPermissions() {
    return this.http.get(this.apiUrl + `customerUser/permissions`);
  }
  public changePermission(id, data) {
    return this.http.put(this.apiUrl + `customerUser/updateRole/${id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The role has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addUserToCompany(id, data) {
    return this.http.put(this.apiUrl + `company/${id}/users`, data).pipe(
      tap(data => {
        this.toastrService.success("Users have been successfully added");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public addRole(name) {
    return this.http.post(this.apiUrl + `customerUser/createRole`, { name }).pipe(
      tap(data => {
        this.toastrService.success("The new role has been successfully created");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public removeRole(id) {
    return this.http.delete(this.apiUrl + `customerUser/deleteRole/${id}`).pipe(
      tap(data => {
        this.toastrService.success("The role has been successfully deleted");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public resetPrimaryContact(userId, companyId) {
    return this.http.get(this.apiUrl + `/company/resetPrimaryContact?userId=${userId}&companyId=${companyId}`);
  }

  public getUserRoles() {
    return this.http.get(this.apiUrl + 'customerUser/getRoleNames');
  }
  public checkValidPrimaryEmail(email, companyId, idUser = null) {
    return this.http.get(this.apiUrl + 'users/isEmailUnique?email=' + email + '&id=' + idUser + '&isTechUser=false&companyId=' + companyId);
  }
  public setDefaultPage(startPage) {
    return this.http.put(this.apiUrl + `settings/userProfile/misc`, { startPage: startPage }).pipe(
      tap(data => {
        this.toastrService.success("The default page has been successfully set");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public setSubscriptions(data) {
    return this.http.put(this.apiUrl + `subscription/defaultSubscriptions`, data);
  }
  public setCustomSubscriptions(id, subscriptions) {
    return this.http.put(this.apiUrl + `subscription/modify/customSubscription/${id}`, subscriptions);
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
  removeAvatar(userId: string) {
    return this.http.delete(
      `${this.apiUrl}users/${userId}/avatar`,
      {}
    );
  }
  public updateUser(data) {

    return this.http.put(this.apiUrl + `users/${data.id}`, data).pipe(
      tap(data => {
        this.toastrService.success("The user has been successfully updated");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public onArchiveUsers(archivedUserId) {
    return this.http.post(this.apiUrl + `users/archive`, {
      "archivedUserId": archivedUserId,

    }).pipe(
      tap(data => {
        this.toastrService.success("The user has been successfully archived");
        this.appStateService.changeDetectorRef();
        return data;
      }));
  }
  public onDeArchiveUsers(archivedUserId) {
    return this.http.post(this.apiUrl + `users/dearchive`, { "archivedUserId": archivedUserId });
  }

}
