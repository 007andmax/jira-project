import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { USERS } from 'src/app/const/emails';
import { MODE_EDIT_SUBSCRIPTION } from 'src/app/const/users';
import { LeftPanelService } from 'src/app/services/left-panel/left-panel.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { UsersService } from 'src/app/services/users/users.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { PhoneNumber } from 'src/class/phone-number';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';
import { StatusColor } from '../../tickets/class/status-color';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { User } from '../class/user';
import { UserChange } from '../class/user-change';
import { UserCustomSubscription } from '../class/user-custom-subscription';
import { UserDefaultSubscription } from '../class/user-default-subscription';
import { UserDefaultSubscriptionAdd } from '../class/user-default-subscription-add';
import { UserProfile } from '../class/user-profile';
import { UserValidate } from '../class/user-validate';
import { UsersAsideDetailTicketsComponent } from './users-aside-detail-tickets/users-aside-detail-tickets.component';
import { UserCustomerCompaniesDefaultSubscribtionAdd } from '../class/user-customer-companies-default-subscribtion-add';
import { UserRole } from '../class/user-role';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';
import { UserCustomerCompaniesInfo } from '../class/user-customer-companies-info';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

@Component({
  selector: 'users-aside-detail',
  templateUrl: './users-aside-detail.component.html',
  styleUrls: ['./users-aside-detail.component.scss'],
  providers: [TicketsListService]
})
export class UsersAsideDetailComponent implements OnInit, OnDestroy {
  user: UserProfile = new UserProfile();
  open: boolean = false;
  toggleEditJobDescription = false;
  showFullJobDescription: boolean = false;
  validate: UserValidate = new UserValidate();
  tab: string = 'tickets';
  selectedCompany = null;
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  @ViewChild('ticketsDetail') ticketsDetail: UsersAsideDetailTicketsComponent;
  sub: Subscription = new Subscription();
  constructor(public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,
    private usersService: UsersService,
    private tagsService: TagsService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private ticketsStateService: TicketsStateService,
    private draftEmailStateService: DraftEmailStateService,
    private companySubscriptionState: CompanySubscriptionStateService,
    private usersRealTimeService: UsersRealTimeService,
    private permissionsService: PermissionsService,
    public customerRoleStateService: CustomerRoleStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService,) { }


  ngOnInit() {
    let openDetailAside = this.usersStateService.openDetailAside.subscribe(data => {
      if (!this.customerRoleStateService.isGetUserRole) this.customerRoleStateService.onInitGetUsersRoles();
      this.getColors();
      this.usersStateService.setUserForEdit(data);
      //   this.companySubscriptionState.onEditMode(this.user.subscription);
      this.user.onEdit(data);
      if (this.customerPortalStateService.checkShowTabTicketsAsideUserDetail(this.usersStateService.getCurrentUser(), this.user)) {
        this.tab = 'tickets';
      } else {
        this.tab = 'messages';
      }
      this.cd.detectChanges();
      if (this.ticketsDetail) {
        this.ticketsDetail.setDefaultScoll();
        this.ticketsDetail.onScroll();
      }
      this.validate.addPhoneNumbers(this.user.phoneNumbers);
      this.open = true;
    })
    this.sub.add(openDetailAside);
    let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
      if (!this.open) return;
      if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED' && this.user.id === newChange.data.userId) {
        let index = this.user.customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
        if (index > -1) {
          this.user.customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          this.usersStateService.getuserForEdit().customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
        }
        this.cd.detectChanges();
      }
      if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED' && this.user.id === newChange.data.userId) {
        this.user.setCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
        this.usersStateService.getuserForEdit().changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
        this.cd.detectChanges();
      }
    });
    this.sub.add(stompClient);
    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {
      if (!this.open) return;
      if ((data.action === 'USER_SAVED' || data.action === 'USER_ARCHIVED') && data.data.accountType !== "TECH") {
        if (this.user.id === data.data.id) {
          this.user.onEdit(new User(data.data));
          this.usersStateService.setUserForEdit(new User(data.data));
        }
      }
      if (data.action === 'USERS_DEARCHIVED' && data.data.accountType !== "TECH") {
        data.data.forEach(user => {
          if (this.user.id === user.id) {
            this.user.onEdit(user);
            this.usersStateService.setUserForEdit(new User(data.data));
          }
        })
      }
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
  }
  getColors() {
    if (this.ticketsStateService.getListStatusColor().length === 0) {
      this.leftPanelService.getColors().subscribe((data: any) => {
        let statusColors = data.map(item => {
          return new StatusColor(item.borderColor, item.textColor);
        })
        this.ticketsStateService.onColorStatus(statusColors);
      })
    }
  }
  getLogoUrl() {
    if (this.user && this.user.avatar && this.user.avatar && this.user.avatar.base64 && !this.user.avatar.cropped) return this.user.avatar.base64;
    if (this.user && this.user.avatar && this.user.avatar.cropped && this.user.avatar.cropped.id) return `/file/${this.user.avatar.cropped.id}`;
    if (this.user && this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) return `/file/${this.user.avatar.origin.id}`;
    return '/company/default/logo.jpg';
  }
  editUser() {
    this.usersStateService.setUserForEdit(new User(JSON.parse(JSON.stringify(this.usersStateService.getuserForEdit()))));
    this.usersStateService.onOpenEditAsige();
  }
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
  }
  onCheckEmail() {
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.onCheckValidPrimaryEmail();
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);
  }
  onUpdatePhoneNumber() {
    if (this.validate.isValidate(this.user)) this.updateUser();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.user.customerCompaniesInfo[0].companyId, this.user.id).subscribe((data: any) => {

      this.validate.setExistPrimaryContactEmail(data.value);
      if (this.validate.isValidate(this.user)) this.updateUser();

      this.cd.detectChanges();
    })
  }
  getJobDescription(val) {
    let value = val;
    if (val && val.length >= 120 && !this.showFullJobDescription) return value.substring(0, 120);
    return val;
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.user);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  onChangeTags(data) {
    let ids = data.map(item => {
      return { id: item.id }
    });
    this.tagsService.setTagsUser(this.user.id, ids).subscribe(data => {

    })
  }
  setTab(data) {
    this.tab = data;
  }
  close() {
    this.open = false;
    this.showFullJobDescription = false;
    this.usersStateService.hideDetailUser();
    this.validate = new UserValidate();
  }

  updateUser() {
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {

    })
  }

  onChangeCustomSubscriptions(data) {
    this.usersService.setCustomSubscriptions(this.user.id, {
      customSubscriptionIds: data.map(item => item.id)
    }).subscribe(res => {
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public trackByIndex(index, item) {
    return index;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
