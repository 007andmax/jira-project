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
import { UserFilters } from 'src/app/components/users/class/user-filters';
import { TicketGlobalFilter } from 'src/app/components/tickets/tickets/class/ticket-global-filter';
import { UserGlobalFilter } from 'src/app/components/users/class/user-global-filters';

@Injectable({
  providedIn: 'root'
})
export class UsersStateService {
  modeUserFilterSubscription: string = MODE_USERS_LIST;
  allUsers: Array<User> = [];
  currentUser: CurrentUser;
  userForEdit: User = null;
  activePage: string = "";
  onGetUsers: EventEmitter<any> = new EventEmitter();
  onGetCurrentUser: EventEmitter<any> = new EventEmitter();
  onFilter: EventEmitter<any> = new EventEmitter();
  onLeftPanelMarketingFilter: EventEmitter<any> = new EventEmitter();
  openAside: EventEmitter<any> = new EventEmitter();
  openEditAside: EventEmitter<any> = new EventEmitter();
  onClearGlobalFilter: EventEmitter<any> = new EventEmitter();
  openMessageAside: EventEmitter<any> = new EventEmitter();
  onSelectAll: EventEmitter<any> = new EventEmitter();
  openDetailAside: EventEmitter<any> = new EventEmitter();
  closeDetailAside: EventEmitter<any> = new EventEmitter();
  onChangeUserPermissions: EventEmitter<any> = new EventEmitter();
  onInitGlobalFilter: EventEmitter<any> = new EventEmitter();
  onToggleFilter: EventEmitter<any> = new EventEmitter();
  onGetGlobalFilters: EventEmitter<any> = new EventEmitter();
  onSelectCustomerCompanyInfo: EventEmitter<any> = new EventEmitter();
  onSelectCustomerCompaniesInfo: EventEmitter<any> = new EventEmitter();
  onShowAddCustomerCompaniesInfo: EventEmitter<any> = new EventEmitter();
  isShowAddCustomerCompaniesInfo: boolean = false;
  userForArchive: User = null;
  usersForArchive: Array<User> = [];
  userForDeArchive: User = null;
  onChangeUsers: EventEmitter<UserChange> = new EventEmitter();
  filter: UserFilters = new UserFilters();
  showArchivedCompanies: boolean = false;
  isGetAllUsers: boolean = false;
  userRoleForRemove: UserRole;
  globalFilters: Array<UserGlobalFilter> = [];
  globalFilterForRemove: UserGlobalFilter = null;
  onEditUser: EventEmitter<any> = new EventEmitter();
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
    this.usersRealTimeService.changePermissionsUsers.subscribe(newChange => {
      if (newChange.action == "PERMISSIONS_UPDATE") this.onChangeUserPermissions.emit(newChange.data);
    });
    this.usersRealTimeService.changeUsersFilters.subscribe(newChange => {
      if (newChange.action === 'USER_FILTER_SAVED') {
        this.globalFilters.unshift(new UserGlobalFilter(newChange.data))
        this.onGetGlobalFilters.emit(this.globalFilters);
      }
      if (newChange.action === 'USER_FILTER_EDITED') {
        let index = this.globalFilters.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.globalFilters[index] = new UserGlobalFilter(newChange.data);
        this.onGetGlobalFilters.emit(this.globalFilters);
      }
      if (newChange.action === 'USER_FILTER_REMOVED') {
        let index = this.globalFilters.findIndex(item => item.id === newChange.data);
        this.globalFilters.splice(index, 1);
        this.onGetGlobalFilters.emit(this.globalFilters);
      }

    })
  }
  public showAddCustomerCompaniesInfo() {
    this.isShowAddCustomerCompaniesInfo = true;
    this.onShowAddCustomerCompaniesInfo.emit(null)
  }
  public setIsShowAddCustomerCompaniesInfo(data) {
    this.isShowAddCustomerCompaniesInfo = data;
  }
  public setSelectedCustomerCompanyInfo(data) {
    this.onSelectCustomerCompanyInfo.emit(data)
  }
  public setSelectedCustomerCompaniesInfo(data) {
    this.onSelectCustomerCompaniesInfo.emit(data)
  }
  public fastEditUser(data) {
    let index = this.allUsers.findIndex(item => item.id == data.id);
    if (index > -1) this.allUsers[index].onUpdate(data);
    this.onEditUser.emit(data);
  }
  public clearGlobalFilter() {
    this.onClearGlobalFilter.emit(null);
  }
  public getUserAvatarUrl(user) {
    if (!(user && user.avatar)) return '';
    if (user.id) {
      return `url(/users/${user.id}/image${(user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / contain no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / contain no-repeat`;
    }
  };
  getNameForAvatar(createdUser) {
    if (!createdUser) return '';
    if (!createdUser.avatar) return `${(createdUser.firstName) ? createdUser.firstName[0].toUpperCase() : ''}${(createdUser.lastName) ? createdUser.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  public onChangeGlobalFilter(data) {
    this.onInitGlobalFilter.emit(data);
  }
  getFirstNameForAvatar(createdUser) {
    if (!createdUser) return '';
    if (!createdUser.avatar) return `${(createdUser.firstName) ? createdUser.firstName[0].toUpperCase() : ''}`;
    return '';
  }
  public getGlobalFilterForRemove() {
    return this.globalFilterForRemove;
  }
  public setGlobalFilterForRemove(data) {
    this.globalFilterForRemove = data;
  }
  public setGlobalFilters(data) {
    this.globalFilters = data;
    this.onGetGlobalFilters.emit(this.globalFilters);
  }
  public initSelectAllusers(data) {
    this.onSelectAll.emit(data);
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
  public changeToggleFilter(data) {
    this.onToggleFilter.emit(data);
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
  public clearFilterWithoutChange() {
    this.filter = new UserFilters();
  }
  public clearFilter() {
    this.filter = new UserFilters();
    this.onFilter.emit(this.filter);
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
