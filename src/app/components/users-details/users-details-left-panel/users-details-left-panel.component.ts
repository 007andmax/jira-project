import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';
import { UserValidate } from '../../users/class/user-validate';
import { UsersService } from 'src/app/services/users/users.service';
import { TagsService } from 'src/app/services/tags/tags.service';

@Component({
  selector: 'app-users-details-left-panel',
  templateUrl: './users-details-left-panel.component.html',
  styleUrls: ['./users-details-left-panel.component.scss'],
  providers: [TicketsListService]
})
export class UsersDetailsLeftPanelComponent implements OnInit {
  companyId: string;
  validate: UserValidate = new UserValidate();
  @Input() user: UserProfile = new UserProfile();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDraftEmail = new EventEmitter<any>();
  constructor(public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService,
    public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    private usersService: UsersService,
    private draftEmailStateService: DraftEmailStateService,
    private tagsService: TagsService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  isPrimaryContact() {
    if (!this.customerPortalStateService.isCustomerPortal && this.companyId) return this.user.customerCompaniesInfo.find(item => item.companyId === this.companyId).isPrimaryContact;
    if (this.customerPortalStateService.isCustomerPortal && this.user.customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id'))) return this.user.customerCompaniesInfo.find(item => item.companyId === localStorage.getItem('company_info_id')).isPrimaryContact;
    return false
  }
  public showAsideForDraftEmail() {
    this.onDraftEmail.emit(null);
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);
  }
  onUpdatePhoneNumber() {
    if (this.validate.isValidate(this.user)) this.updateUser();
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
  onChangeTags(data) {
    let ids = data.map(item => {
      return { id: item.id }
    });
    this.tagsService.setTagsUser(this.user.id, ids).subscribe(data => {

    })
  }
  onCheckEmail() {
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.companiesStateService.getCurrentCompany().id, this.user.id).subscribe((data: any) => {

      this.validate.setExistPrimaryContactEmail(data.value);
      if (this.validate.isValidate(this.user)) this.updateUser();

      this.cd.detectChanges();
    })
  }
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
  }
  edit() {
    this.onEdit.emit(null);
  }
}
