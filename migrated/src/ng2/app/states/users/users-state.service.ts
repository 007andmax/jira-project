import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { User } from '../../components/users/class/user';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  allUsers = [];
  currentUser: CurrentUser;
  onGetUsers: EventEmitter<any> = new EventEmitter();
  onGetCurrentUser: EventEmitter<any> = new EventEmitter();
  onShowArchived: EventEmitter<any> = new EventEmitter();
  onFilter: EventEmitter<any> = new EventEmitter();
  onCount: EventEmitter<any> = new EventEmitter();
  openAside: EventEmitter<any> = new EventEmitter();
  userForArchive: User = null;


  constructor(private userService: UsersService, ) {

  }
  public onInit() {

    this.userService.getAllusers().subscribe((data) => {
      this.setAllUsers(data);
      this.onInitGetUsers(data);
    })
    this.userService.getCurrentUser().subscribe((data: any) => {
      this.currentUser = new CurrentUser(data);
      this.onInitCurrentUser(data);
    })
  }
  public onOpenAsige() {
    this.openAside.emit(null);
  }
  public getOpenAside() {
    return this.openAside;
  }

  public setUserForArchive(data) {
    this.userForArchive = data;
  }
  public getUserForArchive() {
    return this.userForArchive;
  }
  public setCount(data) {
    this.onCount.emit(data);
  }
  public getOnCount() {
    return this.onCount;
  }
  public onInitFilter(data) {
    this.onFilter.emit(data);
  }
  public getOnFilter() {
    return this.onFilter;
  }
  public getOnShowArchived() {
    return this.onShowArchived;
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
  public setOnShowArchived(data) {
    this.onShowArchived.emit(data);
  }
  /**
 * Change user permissionsss
 * @permissions - permissions to change
 */
  public changeUserPermissions(permissions) {
    return this.currentUser.permissions = permissions;
  }
}
