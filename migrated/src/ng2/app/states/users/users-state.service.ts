import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  allUsers = [];
  currentUser: any;
  onGetUsers: EventEmitter<any> = new EventEmitter();
  onGetCurrentUser: EventEmitter<any> = new EventEmitter();
  constructor(private userService: UsersService, ) {

  }
  public onInit() {

    this.userService.getAllusers().subscribe((data) => {
      this.setAllUsers(data);
      this.onInitGetUsers(data);
    })
    this.userService.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
      this.onInitCurrentUser(data);
    })
  }
  public getCurrentUser() {
    return this.currentUser;
  }
  public onInitCurrentUser(data) {
    this.onGetCurrentUser.emit(data);

  }
  public setAllUsers(data) {
    this.allUsers = data;
  }
  public onInitGetUsers(data) {
    this.onGetUsers.emit(data);
  }

  public getOnGetCurrentuser() {
    return this.onGetCurrentUser;
  }
  public getOnUsers() {
    return this.onGetUsers;
  }
  public getAllUsers() {
    return this.allUsers;
  }

    /**
   * Change user permissionsss
   * @permissions - permissions to change
   */
  public changeUserPermissions(permissions) {
    return this.currentUser.permissions = permissions;
  }
}
