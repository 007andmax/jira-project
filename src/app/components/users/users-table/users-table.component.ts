import { Component, OnInit, Input, ElementRef, ChangeDetectorRef, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { User } from '../class/user';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { UsersService } from 'src/app/services/users/users.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { UsersStateService } from 'src/app/states/users/users-state.service';

import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER, DEARCHIVE_USER } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from '../../shared/alert/alert.component';
import { UsersTableService } from './services/users-table.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';
import { TYPE_LIST_ALL_USERS, TYPE_LIST_COMPANY_USERS, TYPE_LIST_MARKETING_USERS } from 'src/app/const/users';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { CrmCompanyJobType } from '../../setting/crm-settings/crm-company-job-type/class/crm-company-job-type';
import { UserDefaultSubscriptionAdd } from '../class/user-default-subscription-add';
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

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  providers: [UsersTableService]
})
export class UsersTableComponent implements OnInit, OnDestroy {
  @Input() selected: boolean = false;
  @Input() user: User;
  @Input() type: string;
  @Input() showArchivedUsers: boolean;
  @Output() onSelectUser = new EventEmitter<any>();
  @Input() jobTitleList: Array<CrmCompanyJobTitle> = [];
  @Input() listCustomSubscription: Array<UserCustomSubscription> = [];
  @Input() companyId: string;
  industries: Array<CrmCompanyIndustry> = [];
  @ViewChild('customSubscription') customSubscription: UserTableCustomSubscriptionComponent;
  companies: Array<Company> = [];
  currentUser: CurrentUser = new CurrentUser();
  sub: Subscription = new Subscription();
  TYPE_LIST_ALL_USERS = TYPE_LIST_ALL_USERS;
  TYPE_LIST_MARKETING_USERS = TYPE_LIST_MARKETING_USERS;
  TYPE_LIST_COMPANY_USERS = TYPE_LIST_COMPANY_USERS;
  constructor(private companiesStateService: CompaniesStateService,
    private usersService: UsersService,
    private usersStateService: UsersStateService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private draftEmailStateService: DraftEmailStateService,
    private usersTableService: UsersTableService,
    public cd: ChangeDetectorRef,
    private crmStateService: CrmStateService,
    private permissionsService: PermissionsService,
    private techUsersService: TechUsersService,
    public customerPortalStateService: CustomerPortalStateService,
    private elRef: ElementRef) { }


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
    })
  }
  sendInvite(userEmail) {
    this.techUsersService
      .verifyUserEmail(userEmail)
      .subscribe();
  }
  getCompaniesNames() {
    return this.user.customerCompaniesInfo.map(item => (this.companiesStateService.getCompanies().find(company => company.id == item.companyId) ? this.companiesStateService.getCompanies().find(company => company.id == item.companyId).name : ''));
  }
  getUserIndustry() {
    let find = this.industries.find(item => item.id === this.user.userIndustryId);
    return (find) ? find.name : '';
  }
  getJobTitle() {
    let find = this.jobTitleList.find(item => item.id === this.user.jobTitleId);
    return (find) ? find.name : '';
  }
  getNameForAvatar() {
    if (!this.user.avatar) return `${(this.user.firstName) ? this.user.firstName[0].toUpperCase() : ''}${(this.user.lastName) ? this.user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getUserName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  showDetailUser() {
    this.usersStateService.showDetailUser(this.user);
  }
  getUserCompanyName() {
    if (this.user.company.isDefault) return '';
    let index = this.companies.findIndex(item => item.id === this.user.company.id);
    return (index > -1) ? this.companies[index].name : '';
  }
  getUserAvatarUrl() {
    if (!(this.user && this.user.avatar)) return '';

    if (this.user.id) {
      return `url(${'/users/' + (this.user.id || 'default') + '/image' + (this.user.avatar ? '.jpg?t=' + this.user.avatar.updatedAt :
        '')}) 0% 0% / contain no-repeat`
    } else if (this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) {
      return `url(/file/${(this.user.avatar.origin.id)}.jpg) 0% 0% / contain no-repeat`;
    } else {
      return 'url(/users/default/image.jpg) 0% 0% / contain no-repeat';
    }
  };
  isPrimaryContact() {
    return this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId).isPrimaryContact;
  }
  resetPrimaryContact() {
    this.usersService.resetPrimaryContact(this.user.id, this.companyId).subscribe(data => {

    })
  }
  getDefaultSubscriptions() {
    return this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId).defaultSubscriptions;
  }
  edit() {
    this.usersStateService.setUserForEdit(new User(JSON.parse(JSON.stringify(this.user))));
    this.usersStateService.onOpenEditAsige();
  }
  ngOnInit() {
    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
      this.cd.detectChanges();
    })
    this.sub.add(onGetIndustry);


    if (this.companiesStateService.getCompanies().length > 0) this.companies = this.companiesStateService.getCompanies();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.companies = data;

    })
    this.currentUser = this.usersStateService.getCurrentUser();

    //this.sub.add(getOnCompanies);
  }
  delete() {
    if (this.user.customerCompaniesInfo.find(item => item.isPrimaryContact)) {
      const modalRef = this.modalService.open(UsersCheckUseComponent, { windowClass: 'xs-modal user-modal', container: (this.companyId) ? "company-user" : "app-users", backdrop: 'static', keyboard: false });
      modalRef.componentInstance.user = this.user;
      return;
    }
    if (this.usersTableService.getUsersCount(this.usersStateService.getAllUsers(), this.user.customerCompaniesInfo, this.showArchivedUsers) === 1) {
      const modalRef = this.modalService.open(AlertComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
      modalRef.componentInstance.message = `You cannot archive all users. At least one must remain.`;
      return;
    }
    this.confirmStateService.setConfirmAction(ARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });

    modalRef.componentInstance.message = `Do you want to archive ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForArchive(this.user);
  }
  showUserDetails() {

    this.elRef.nativeElement.querySelector('.new-users-content__list--item').classList.toggle('show-details');
  }
  restore() {
    this.confirmStateService.setConfirmAction(DEARCHIVE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });

    modalRef.componentInstance.message = `Do you want to restore ${this.user.firstName + ' ' + this.user.lastName}`;
    this.usersStateService.setUserForDeArchive(this.user);
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
  }
  getPermissionCustomerUser(permission) {
    return this.currentUser.customerCompaniesInfo.find(item => item.clientCompany.id === this.customerPortalStateService.getUsersFilters().company).customerUserRole.getPermission(permission);
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
