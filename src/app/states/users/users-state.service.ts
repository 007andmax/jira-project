import { Injectable, EventEmitter } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { User } from '../../components/users/class/user';
import { UsersRealTimeService } from './users-real-time.service';
import { UserChange } from '../../components/users/class/user-change';
import { UserFilter } from '../../components/users/class/user-filter';
import { AppService } from '../app/app.service';
import { MODE_USERS_LIST } from 'src/app/const/users';
import { UserJobTitle } from 'src/app/components/users/class/user-job-title';
import { UserRole } from 'src/app/components/users/class/user-role';
import { CustomerPortalStateService } from '../customer-portal/customer-portal-state.service';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  modeUserFilterSubscription: string = MODE_USERS_LIST;
  allUsers: Array<User> = [];
  currentUser: CurrentUser;
  userForEdit: User = null;
  onGetUsers: EventEmitter<any> = new EventEmitter();
  onGetCurrentUser: EventEmitter<any> = new EventEmitter();
  onFilter: EventEmitter<any> = new EventEmitter();
  onLeftPanelMarketingFilter: EventEmitter<any> = new EventEmitter();
  openAside: EventEmitter<any> = new EventEmitter();
  openEditAside: EventEmitter<any> = new EventEmitter();
  openMessageAside: EventEmitter<any> = new EventEmitter();
  openDetailAside: EventEmitter<any> = new EventEmitter();
  closeDetailAside: EventEmitter<any> = new EventEmitter();
  onChangeUserPermissions: EventEmitter<any> = new EventEmitter();
  userForArchive: User = null;
  usersForArchive: Array<User> = [];
  userForDeArchive: User = null;
  onChangeUsers: EventEmitter<UserChange> = new EventEmitter();
  filter: UserFilter = new UserFilter();
  showArchivedCompanies: boolean = false;
  isGetAllUsers: boolean = false;
  userRoleForRemove: UserRole;
  constructor(private userService: UsersService,
    private appService: AppService,
    private customerPortalStateService: CustomerPortalStateService,
    private usersRealTimeService: UsersRealTimeService) {
  }

  public onInit() {
    this.onInitGetCurrentUser();
    this.usersRealTimeService.changeUsersArray.subscribe(newChange => {
      if (newChange.action === 'USER_SAVED' || newChange.action === 'USER_ARCHIVED') {
        const Index = this.allUsers.findIndex((item) => item.id === newChange.data.id);
        if (Index > -1) this.allUsers[Index].onUpdate(newChange.data);
        if (Index === -1) this.allUsers.unshift(new User(newChange.data));
        if (newChange.data.id === this.currentUser.id) {
          this.currentUser = new CurrentUser(newChange.data);
          this.onInitCurrentUser(this.currentUser);
        }
      }
      if (newChange.action === 'USERS_DEARCHIVED') {
        newChange.data.forEach(data => {
          const Index = this.allUsers.findIndex((item) => item.id === data.id);
          if (Index > -1) this.allUsers[Index].onUpdate(data);
        });
      }
      if (newChange.action === 'USER_ONLINE') {
        if (this.getCurrentUser().id === newChange.data.id) {
          this.appService.showSessionScreen('Someone just logged into your account. This session has been signed out');
        }
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
    this.usersRealTimeService.changePermissionsUsers.subscribe(newChange => {
      if (newChange.action == "PERMISSIONS_UPDATE") this.onChangeUserPermissions.emit(newChange.data);
    });
  }
  public setUserRoleForRemove(data) {
    this.userRoleForRemove = data;
  }
  public getUserRoleForRemove() {
    return this.userRoleForRemove;
  }

  public initGetAllUsers() {
    this.isGetAllUsers = true;
    this.userService.getAllusers().subscribe((data) => {
      this.setAllUsers(data);
      this.onInitGetUsers(data);
    })
  }
  public setModeUserFilterSubscription(data) {
    this.modeUserFilterSubscription = data;
  }
  public getModeUserFilterSubscription() {
    return this.modeUserFilterSubscription;
  }
  public onInitGetCurrentUser() {
    this.userService.getCurrentUser().subscribe((data: any) => {
      this.currentUser = new CurrentUser(data);
      if (data.accountType == "TECH") localStorage.removeItem("company_info_id");
      if (data.accountType == "CLIENT" && !this.customerPortalStateService.isCustomerPortal) {
        this.customerPortalStateService.setCustomerPortal(true);
        //this.customerPortalStateService.setFilters(this.currentUser);
      }
      this.onInitCurrentUser(this.currentUser);
      if (this.currentUser.role !== "SUPER_ADMIN" && !this.isGetAllUsers) this.initGetAllUsers();
    })
  }
  showMessageAside(data) {
    this.openMessageAside.emit(data);
  }
  public setShowArchivedCompanies(data) {
    this.showArchivedCompanies = data;
  }
  public getShowArchivedCompanies() {
    return this.showArchivedCompanies;
  }
  public hideDetailUser() {
    this.closeDetailAside.emit(null);
  }
  public showDetailUser(data) {
    this.openDetailAside.emit(data);
  }
  public getFilter() {
    return this.filter;
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
  public setUsersForArchive(data) {
    this.usersForArchive = data;
  }
  public getUsersForArchive() {
    return this.usersForArchive;
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
  public clearFilter() {
    this.filter = new UserFilter();
  }
  public onInitLeftPanelMarketingFilter(data) {
    this.onLeftPanelMarketingFilter.emit(data);
  }
  public onInitFilter(data) {
    this.filter = data;
    this.onFilter.emit(data);
  }
  public getOnFilter() {
    return this.onFilter;
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
    this.currentUser.permissions = permissions;

  }
}
