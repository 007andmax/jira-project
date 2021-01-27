import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { User } from '../../components/users/class/user';
import { retry } from 'rxjs/operators';
import { UserPipe } from '../../pipe/user.pipe';
import { UserProfile } from '../../components/users/class/user-profile';
import { UsersRealTimeService } from './users-real-time.service';
import { UserChange } from '../../components/users/class/user-change';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  allUsers: Array<User> = [];
  currentUser: CurrentUser;
  userForEdit: User = null;
  onGetUsers: EventEmitter<any> = new EventEmitter();
  onGetCurrentUser: EventEmitter<any> = new EventEmitter();
  onShowArchived: EventEmitter<any> = new EventEmitter();
  onFilter: EventEmitter<any> = new EventEmitter();
  openAside: EventEmitter<any> = new EventEmitter();
  openEditAside: EventEmitter<any> = new EventEmitter();
  userForArchive: UserProfile = null;
  userForDeArchive: User = null;
  onChangeUsers: EventEmitter<UserChange> = new EventEmitter();

  constructor(private userService: UsersService, private usersRealTimeService: UsersRealTimeService) {

  }
  public onInit() {

    this.userService.getAllusers().subscribe((data) => {
      /*   let users = data.map((item) => {
           return new User(item);
         })*/

      this.setAllUsers(data);
      this.onInitGetUsers(data);
    })
    this.userService.getCurrentUser().subscribe((data: any) => {
      this.currentUser = new CurrentUser(data);
      this.onInitCurrentUser(data);
    })
    this.usersRealTimeService.changeUsersArray.subscribe(newChange => {
      if (newChange.action === 'USER_SAVED' || newChange.action === 'USER_ARCHIVED') {
        const Index = this.allUsers.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allUsers[Index] = new User(newChange.data);
        if (Index === -1) this.allUsers.unshift(new User(newChange.data));
      }
      if (newChange.action === 'USERS_DEARCHIVED') {
        newChange.data.forEach(data => {
          const Index = this.allUsers.findIndex((item) => item.id === data.id);
          if (Index > -1) this.allUsers[Index] = new User(data);
        });
      }
      this.onChangeUsers.emit(new UserChange(newChange.action, newChange.data, this.allUsers));
    })

    this.usersRealTimeService.changeSubmittedTicket.subscribe(newChange => {
      if (newChange.action === 'USER_SUBMITTED_TICKET') {
        const Index = this.allUsers.findIndex((item) => item.id === newChange.data.id);
        var prevValue = this.allUsers[Index].userStatistic.ticketsSubmitted || 0;
        prevValue++;
        if (Index > -1) this.allUsers[Index].userStatistic.ticketsSubmitted = prevValue;
      }
      this.onChangeUsers.emit(new UserChange(newChange.action, newChange.data, this.allUsers));
    });
  }
  public getChangeUsers() {
    return this.onChangeUsers;
  }
  public setUserForEdit(data) {
    this.userForEdit = data;
  }
  public getuserForEdit() {
    return this.userForEdit;
  }
  public onOpenAsige() {
    this.openAside.emit(null);
  }
  public getOpenAside() {
    return this.openAside;
  }
  public onOpenEditAsige() {
    this.openEditAside.emit(null);
  }
  public getOpenEditAside() {
    return this.openEditAside;
  }

  public setUserForDeArchive(data) {
    this.userForDeArchive = data;
  }
  public setUserForArchive(data) {
    this.userForArchive = data;
  }
  public getUserForArchive() {
    return this.userForArchive;
  }
  public getUserForDeArchive() {
    return this.userForDeArchive;
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
