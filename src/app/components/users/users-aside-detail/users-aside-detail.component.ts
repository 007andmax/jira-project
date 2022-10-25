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
    private usersStateService: UsersStateService,
    private usersService: UsersService,
    private tagsService: TagsService,
    public cd: ChangeDetectorRef,
    private leftPanelService: LeftPanelService,
    private ticketsStateService: TicketsStateService,
    private draftEmailStateService: DraftEmailStateService,
    private companySubscriptionState: CompanySubscriptionStateService,
    private usersRealTimeService: UsersRealTimeService,
    private permissionsService: PermissionsService,
    private companiesStateService: CompaniesStateService,) { }


  ngOnInit() {
    let openDetailAside = this.usersStateService.openDetailAside.subscribe(data => {
      this.usersStateService.setUserForEdit(data);
      //   this.companySubscriptionState.onEditMode(this.user.subscription);
      this.user.onEdit(data);
      this.tab = 'tickets';
      this.cd.detectChanges();
      if (this.ticketsDetail) {
        this.ticketsDetail.setDefaultScoll();
        this.ticketsDetail.onScroll();
      }
      this.validate.addPhoneNumbers(this.user.phoneNumbers);
      this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);
      this.open = true;
    })
    this.sub.add(openDetailAside);
    this.leftPanelService.getColors().subscribe((data: any) => {
      let listColors = data.map(item => {
        return new StatusColor(item.borderColor, item.colorText);
      })
      this.ticketsStateService.onColorStatus(listColors);
    })
    let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
      if (!this.open) return;
      if (newChange.action === 'SUBSCRIPTION_SAVED') {
        if (this.user.id === newChange.data.userId) {
          this.user.setDefaultSubscriptions(new UserDefaultSubscription(newChange.data.defaultSubscriptions));
          this.user.setCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.usersStateService.getuserForEdit().changeDefaultSubscriptions(new UserDefaultSubscription(newChange.data.defaultSubscriptions));
          this.usersStateService.getuserForEdit().changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
        }
        this.cd.detectChanges();
      }
    });
    this.sub.add(stompClient);
    let getChangeCompanies = this.usersStateService.getChangeUsers().subscribe((data: UserChange) => {
      if (!this.open) return;
      if ((data.action === 'USER_SAVED' || data.action === 'USER_ARCHIVED') && data.data.accountType !== "TECH") {
        if (this.user.id === data.data.id) {
          this.user.onEdit(data.data);
          this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);
          this.usersStateService.setUserForEdit(new User(data.data));
        }
      }
      if (data.action === 'USERS_DEARCHIVED' && data.data.accountType !== "TECH") {
        data.data.forEach(user => {
          if (this.user.id === user.id) {
            this.user.onEdit(user);
            this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);
            this.usersStateService.setUserForEdit(new User(data.data));
          }
        })
      }
      this.cd.detectChanges();
    })
    this.sub.add(getChangeCompanies);
    this.onInitSubscribe();
  }
  getLogoUrl() {
    if (this.user && this.user.avatar && this.user.avatar && this.user.avatar.base64 && !this.user.avatar.cropped) return this.user.avatar.base64;
    if (this.user && this.user.avatar && this.user.avatar.cropped && this.user.avatar.cropped.id) return `/file/${this.user.avatar.cropped.id}`;
    if (this.user && this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) return `/file/${this.user.avatar.origin.id}`;
    return '/company/default/logo.jpg';
  }
  private onInitSubscribe() {
    setTimeout(() => {

      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
        if (newChange.action === 'SUBSCRIPTION_SAVED') {

          if (this.user.id === newChange.data.userId) {
            this.user.changeDefaultSubscriptions(new UserDefaultSubscription(newChange.data.defaultSubscriptions));
            this.user.changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
            this.usersStateService.getuserForEdit().changeDefaultSubscriptions(new UserDefaultSubscription(newChange.data.defaultSubscriptions));
            this.usersStateService.getuserForEdit().changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));

          }

          this.cd.detectChanges();
        }
      });
      this.sub.add(stompClient);

    }, 3000);
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
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0 && this.selectedCompany) this.onCheckValidPrimaryEmail();
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);
  }
  onUpdatePhoneNumber() {
    if (this.validate.isValidate(this.user)) this.updateUser();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.selectedCompany.id, this.user.id).subscribe((data: any) => {

      this.validate.setExistPrimaryContactEmail(data.value);
      if (this.validate.isValidate(this.user)) this.updateUser();

      this.cd.detectChanges();
    })
  }
  onSelectCompany(data) {
    this.selectedCompany = data;
    this.user.serCompanyId(data.id);
    this.updateUser();
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
  onChangeDefaultSubscriptions(data) {

    this.usersService.setSubscriptions(data.id, {
      ...new UserDefaultSubscriptionAdd(data.ticketSubscription.enabled,
        data.ticketManagerSubscription.enabled,
        data.invoiceSubscription.enabled)
      , customSubscriptionIds: this.user.customSubscriptions.map(item => item.id)
    }).subscribe(res => {
    })
  }
  onChangeCustomSubscriptions(data) {

    this.usersService.setSubscriptions(this.user.defaultSubscriptions.id, {
      ...new UserDefaultSubscriptionAdd(this.user.defaultSubscriptions.ticketSubscription.enabled,
        this.user.defaultSubscriptions.ticketManagerSubscription.enabled,
        this.user.defaultSubscriptions.invoiceSubscription.enabled)
      , customSubscriptionIds: data.map(item => item.id)
    }).subscribe(res => {
    })
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
