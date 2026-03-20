import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, Output, EventEmitter, ViewChild, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { User } from '../class/user';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { UsersService } from 'src/app/services/users/users.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER, DEARCHIVE_USER } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from '../../shared/alert/alert.component';
import { UsersTableService } from './services/users-table.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';
import { TYPE_LIST_ALL_USERS, TYPE_LIST_COMPANY_USERS, TYPE_LIST_MARKETING_USERS } from 'src/app/const/users';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { UserDefaultSubscription } from '../class/user-default-subscription';
import { UserCustomSubscription } from '../class/user-custom-subscription';
import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription/user-table-custom-subscription.component';
import { CrmCompanyIndustry } from '../../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { Subscription } from 'rxjs';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UserCustomerCompaniesDefaultSubscribtionAdd } from '../class/user-customer-companies-default-subscribtion-add';
import { TechUsersService } from 'src/app/services/setting/tech-users.service';
import { UsersCheckUseComponent } from '../users-check-use/users-check-use.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UserProfile } from '../class/user-profile';
import { Router } from '@angular/router';
import { UserCustomerCompaniesInfo } from '../class/user-customer-companies-info';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { AppStateService } from 'src/app/states/app/app-state.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  providers: [UsersTableService, TicketsListService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableComponent implements OnInit, OnDestroy {
  @Input() selected: boolean = false;
  @Input() user: User;
  @Input() type: string;
  @Input() toggleFilter: boolean = false;
  @Input() showArchivedUsers: boolean;
  @Output() onSelectUser = new EventEmitter<any>();
  @Input() jobTitleList: Array<CrmCompanyJobTitle> = [];
  @Input() listCustomSubscription: Array<UserCustomSubscription> = [];
  @Input() companyId: string;
  @ViewChild('customSubscription', { static: false }) customSubscription: UserTableCustomSubscriptionComponent;
  companies: Array<Company> = [];
  currentUser: CurrentUser = new CurrentUser();
  defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription(null);
  sub: Subscription = new Subscription();
  TYPE_LIST_ALL_USERS = TYPE_LIST_ALL_USERS;
  TYPE_LIST_MARKETING_USERS = TYPE_LIST_MARKETING_USERS;
  TYPE_LIST_COMPANY_USERS = TYPE_LIST_COMPANY_USERS;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  private closeTimer: any;
  private openTimer: any;
  constructor(private companiesStateService: CompaniesStateService,
    private usersService: UsersService,
    public usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private draftEmailStateService: DraftEmailStateService,
    private usersTableService: UsersTableService,
    public cd: ChangeDetectorRef,
    private crmStateService: CrmStateService,
    private permissionsService: PermissionsService,
    private techUsersService: TechUsersService,
    public customerPortalStateService: CustomerPortalStateService,
    private router: Router,
    public ticketsListService: TicketsListService,
    private appStateService: AppStateService,
    private usersRealTimeService: UsersRealTimeService) { }


  onChangeDefaultSubscriptions(subscriptions) {
    this.usersService.setSubscriptions({
      ...new UserCustomerCompaniesDefaultSubscribtionAdd(subscriptions.ticketSubscription.enabled,
        subscriptions.ticketManagerSubscription.enabled,
        subscriptions.invoiceSubscription.enabled,
        this.user.id,
        this.companyId)
    }).subscribe(data => {

    })
  }
  onChangeCustomSubscriptions(data) {
    this.usersService.setCustomSubscriptions(this.user.id, {
      customSubscriptionIds: data.map(item => item.id)
    }).subscribe(data => {
      this.customSubscription.toggleIsUpdate(false);
      this.cd.markForCheck();
    })
  }
  sendInvite(userEmail) {
    this.techUsersService
      .verifyUserEmail(userEmail)
      .subscribe();
  }
  getCompaniesNames() {
    return this.user.customerCompaniesInfo.map(item => (this.companiesStateService.getCompanies().find(company => company.id == item.companyId) ? this.companiesStateService.getCompanies().find(company => company.id == item.companyId).name : '')).
      sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
        1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));
  }

  getJobTitle() {
    let find = this.jobTitleList.find(item => item.id === this.user.jobTitleId);
    return (find) ? find.name : '';
  }
  getUserName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  getJobTitleCompany() {
    return this.user.customerCompaniesInfo.find(item => item.companyId == this.companyId).jobTitleDto;
  }
  showDetailUser() {
    if (this.type == TYPE_LIST_COMPANY_USERS) {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/company/${this.companyId}/user/`, this.user.id]);
    } else {
      this.router.navigate(
        [`${this.companiesStateService.getCurrentCompany().techDomain}/users/`, this.user.id]);
    }
  }
  getCompany(customerCompaniesInfo: UserCustomerCompaniesInfo) {
    return this.companiesStateService.getCompanies().find(item => item.id == customerCompaniesInfo.companyId);
  }
  getStyleAvatarCompany(company, color = null) {
    if (!this.checkLogo(company)) {
      return (color) ? color : '#16a4fa';
    }
    if (this.checkLogo(company)) {
      return `url(${this.companiesStateService.getCompanyLogoUrl(company)}) center / cover no-repeat`
    } else {
      return (color) ? color : '#16a4fa';
    }
  };
  checkLogo(company) {
    return (company && company.logo && company.logo.cropped && company.logo.cropped.id || company && company.logo && company.logo.origin && company.logo.origin.id)
  }
  isPrimaryContact() {
    if (!this.customerPortalStateService.isCustomerPortal && this.companyId) return this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId).isPrimaryContact;
    return false
  }
  resetPrimaryContact() {
    this.usersService.resetPrimaryContact(this.user.id, this.companyId).subscribe(data => {

    })
  }
  getCustomerCompaniesInfo() {
    return this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId);
  }
  changeDisplay(event) {
    let index = this.user.customerCompaniesInfo.findIndex(item => item.companyId === this.companyId);
    this.user.customerCompaniesInfo[index].eligibleForTicket = event.target.checked;
    this.usersService.updateeligibleForTicket(this.user.id, this.companyId, event.target.checked).subscribe(data => {
      this.usersStateService.fastUpdateUser(this.user);
    })
  }
  edit() {
    this.usersStateService.setUserForEdit(new User(JSON.parse(JSON.stringify(this.user))));
    this.usersStateService.onOpenEditAsige();
    this.cd.markForCheck();
  }
  getStyleNetAvatar(i) {
    return `${18 * i}px`;
  }
  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;
    })
    this.sub.add(getOnCompanies);
    this.currentUser = this.usersStateService.getCurrentUser();
    this.cd.markForCheck();
    //this.sub.add(getOnCompanies);
    let onSelectAll = this.usersStateService.onSelectAll.subscribe(data => {
      this.user.selected = data;
      this.cd.markForCheck();
    })
    this.sub.add(onSelectAll);
    this.defaultSubscriptions = (this.companyId) ? this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId).defaultSubscriptions : new UserDefaultSubscription(null);
    let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
      if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
        if (this.user.id == newChange.data.userId && this.companyId == newChange.data.companyId) {
          this.defaultSubscriptions = new UserDefaultSubscription(newChange.data.defaultSubscriptions);
        }
        this.cd.detectChanges();
      }
      this.cd.detectChanges();
    });
    this.sub.add(stompClient);
    let onFastEdit = this.usersStateService.onFastEdit.subscribe(res => {
      this.cd.detectChanges();
    })
    this.sub.add(onFastEdit);
  }
  delete() {
    if (this.user.customerCompaniesInfo.find(item => item.isPrimaryContact)) {
      const modalRef = this.modalService.open(UsersCheckUseComponent, { windowClass: 'xs-modal user-modal', container: (this.companyId) ? "company-user" : (this.type == TYPE_LIST_MARKETING_USERS) ? "marketing" : "app-users", backdrop: 'static', keyboard: false });
      modalRef.componentInstance.user = this.user;
      this.cd.markForCheck();
      return;
    }
    if (this.usersTableService.getUsersCount(this.usersStateService.getAllUsers(), this.user.customerCompaniesInfo, this.showArchivedUsers) === 1) {
      const modalRef = this.modalService.open(AlertComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `You cannot archive all users. At least one must remain.`;
      this.cd.markForCheck();
      return;
    }
    this.confirmStateService.setConfirmAction(ARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Archive User`;
    modalRef.componentInstance.message = `Are you sure you want to archive ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForArchive(this.user);
    this.cd.markForCheck();
  }
  restore() {
    this.confirmStateService.setConfirmAction(DEARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Restore User`;
    modalRef.componentInstance.message = `Are you sure you want to restore ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForDeArchive(this.user);
    this.cd.markForCheck();
  }
  selectUser(event) {
    if (event.target.checked) {
      this.draftEmailStateService.addSelectedUser(this.user);
    } else {
      let list = this.draftEmailStateService.getSelectedUsers();
      let index = list.findIndex(item => item.id === this.user.id);
      if (index > -1) this.draftEmailStateService.removeSelectedUser(index);
    }
    this.onSelectUser.emit(this.user);
    this.cd.detectChanges();
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.user);
    this.draftEmailStateService.toggleAsideForAdd();
    this.cd.markForCheck();
  }
  public trackById(index, item) {
    return item.id;
  }
  public trackByIndex(index, item) {
    return index;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  openPopover(popover: NgbPopover): void {
    if (!this.user) return;
    clearTimeout(this.closeTimer);

    if (!popover.isOpen()) {
      this.openTimer = setTimeout(() => {
        popover.open();
        this.appStateService.changeDetectorRef();
        // Wait until popover is added to <body>
        setTimeout(() => {
          const popoverEl = document.querySelector('.requested-by-popover');

          if (!popoverEl) {
            return;
          }

          popoverEl.addEventListener('mouseenter', this.onPopoverMouseEnter);
          popoverEl.addEventListener('mouseleave', () => {
            if (!this.usersStateService.isOpenDropDownRequestedBy) popover.close();
          });
        });
      }, 500);
    }
  }

  startCloseTimer(popover: NgbPopover): void {
    if (!this.user || this.usersStateService.isOpenDropDownRequestedBy) return;
    clearTimeout(this.closeTimer);
    clearTimeout(this.openTimer);
    this.closeTimer = setTimeout(() => {
      const popoverEl = document.querySelector('.requested-by-popover:hover');

      // close only if mouse is not over popover body
      if (!popoverEl) {
        popover.close();
      }
    }, 150);
  }

  onPopoverMouseEnter = (): void => {
    clearTimeout(this.closeTimer);
  };
  ngOnDestroy(): void {
    clearTimeout(this.closeTimer);
    this.sub.unsubscribe();
  }
}
