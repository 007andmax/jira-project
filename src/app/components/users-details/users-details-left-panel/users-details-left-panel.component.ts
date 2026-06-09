
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';
import { UsersService } from 'src/app/services/users/users.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PhoneNumber } from 'src/class/phone-number';
import { UserCustomerCompaniesInfo } from '../../users/class/user-customer-companies-info';
import { TechUsersService } from 'src/app/services/setting/tech-users.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersCheckUseComponent } from '../../users/users-check-use/users-check-use.component';
import { UsersTableService } from '../../users/users-table/services/users-table.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ARCHIVE_USER } from 'src/app/const/confirm';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { CurrentUser } from 'src/class/current-user/current-user';
import { Subscription } from 'rxjs';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { CompanyTagsComponent } from '../../companies/company-tags/company-tags.component';
import { DynamicTooltipComponent } from '../../shared/dynamic-tooltip/dynamic-tooltip.component';
import { MatErrorComponent } from '../../shared/mat-error/mat-error.component';
import { UserCustomSubscriptionComponent } from '../../users/users-aside/user-custom-subscription/user-custom-subscription.component';
import { NgxMaskModule } from 'ngx-mask';

@Component({
  standalone: true,
  imports: [CompanyTagsComponent, NgxMaskModule.forRoot(), NgbDropdownModule, DynamicTooltipComponent, MatErrorComponent, UserCustomSubscriptionComponent, CommonModule],
  selector: 'app-users-details-left-panel',
  templateUrl: './users-details-left-panel.component.html',
  styleUrls: ['./users-details-left-panel.component.scss'],
  providers: [TicketsListService, UsersTableService]
})
export class UsersDetailsLeftPanelComponent implements OnInit, OnDestroy {
  companyId: string;
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  isChange: boolean = false;
  seelectedCustomerCompaniesInfo: UserCustomerCompaniesInfo;
  currentUser: CurrentUser = new CurrentUser();
  @Input() user: UserProfile = new UserProfile();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDraftEmail = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService,
    public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,
    private usersService: UsersService,
    private draftEmailStateService: DraftEmailStateService,
    private confirmStateService: ConfirmStateService,
    private tagsService: TagsService,
    public formBuilder: UntypedFormBuilder,
    private techUsersService: TechUsersService,
    private usersTableService: UsersTableService,
    private leftPanelStateService: LeftPanelStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.currentUser = this.usersStateService.getCurrentUser();
    this.modelForm = this.formBuilder.group({
      phones: this.formBuilder.array([]),
      primaryEmail: ["",
        [Validators.required, this.checkEmail()]
      ],

    })
    this.updateForm();
    this.modelForm.valueChanges.subscribe(res => {
      this.isChange = true;
    })
    this.usersStateService.onSelectCustomerCompanyInfo.subscribe(data => {
      this.seelectedCustomerCompaniesInfo = data;
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === ARCHIVE_USER) {
          this.onArchiveUser(this.user.id);
        }
      }
    })
    this.sub.add(getConfirm);
  }
  private onArchiveUser(id) {
    this.usersService.onArchiveUsers(id).subscribe(data => {
      this.confirmStateService.initRequest(false);
      this.leftPanelStateService.goToState('new-users');
    }, err => {
      this.confirmStateService.initRequest(false);
    })
  }
  updateForm() {
    while (this.phones.length) {
      this.phones.removeAt(0);
    }
    this.user.phoneNumbers.forEach(item => {
      const itemGroup = this.formBuilder.group({
        name: [item.typeNumber, Validators.required], // Define the fields inside the FormGroup
        value: [item.number, this.checkPhone()]
      });
      this.phones.push(itemGroup);
    });
    this.modelForm.controls["primaryEmail"].setValue(this.user.primaryEmail);
    this.cd.detectChanges();
  }
  changePhoneNumber(item, event) {
    item.controls["value"].setValue(event.target.value);
  }
  checkEmail(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const primaryContactEmail = (control.value && control.value.match(this.reEmail));
      return !primaryContactEmail ? { primaryContactEmail: { value: control.value } } : null;
    };
  }
  checkPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length > 0 && control.value.length < 14 ? { validPhoneNumber: { value: control.value } } : null;
    };
  }
  // Getter to access the FormArray
  get phones(): UntypedFormArray {
    return this.modelForm.get('phones') as UntypedFormArray;
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
  updateUser() {
    this.submitted = true;
    if (this.modelForm.invalid || !this.isChange) {
      return;
    }
    this.user.phoneNumbers = this.modelForm.value.phones.map(item => new PhoneNumber(item.name, item.value));
    this.user.primaryEmail = this.modelForm.value.primaryEmail;

    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {
      this.usersStateService.fastEditUser(data);
      this.submitted = false;
      this.isChange = false;
    }, err => {
      this.submitted = false;
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
  onChangeContact() {

  }
  onCheckEmail() {
    this.submitted = true;
    if (!this.f2.primaryEmail.errors) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.companiesStateService.getCurrentCompany().id, this.user.id).subscribe((data: any) => {
      if (data.value) this.modelForm.controls["primaryEmail"].setErrors(null)
      if (!data.value) this.modelForm.controls["primaryEmail"].setErrors({ existPrimaryContactEmail: true })
      this.updateUser();
      this.cd.detectChanges();
    })
  }
  sendInvite(userEmail) {
    this.techUsersService
      .verifyUserEmail(userEmail)
      .subscribe();
  }
  delete() {
    if (this.user.customerCompaniesInfo.find(item => item.isPrimaryContact)) {
      const modalRef = this.modalService.open(UsersCheckUseComponent, { windowClass: 'xs-modal user-modal', container: "app-users-details", backdrop: 'static', keyboard: false });
      modalRef.componentInstance.user = this.user;
      this.cd.markForCheck();
      return;
    }
    if (this.usersTableService.getUsersCount(this.usersStateService.getAllUsers(), this.user.customerCompaniesInfo, this.user.isArchive()) === 1) {
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
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
    this.isChange = true;
  }

  edit() {
    this.onEdit.emit(null);
  }
  getCompany() {
    return this.seelectedCustomerCompaniesInfo ? this.companiesStateService.getCompanies().find(item => item.id == this.seelectedCustomerCompaniesInfo.companyId) : null;
  }
  getContactCompany() {
    if (this.getCompany()) {
      let primaryContact,
        primaryAddress,
        primaryPhone;
      if (this.getCompany().companyInfo) {
        if (this.getCompany().companyInfo.contacts) {
          for (let contact of this.getCompany().companyInfo.contacts) {
            if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
          }
        }
        if (this.getCompany().companyInfo.addresses) {
          for (let address of this.getCompany().companyInfo.addresses) {
            if (address.isPrimary) primaryAddress = address;
          }
        }
        if (primaryAddress && primaryAddress.phoneNumbers.length) {
          primaryPhone = primaryAddress.phoneNumbers;
          primaryPhone.forEach(element => {
            if (element.number[0] === "1") element.number = `+${element.number}`;
          });

        }
      }
      return {
        primaryAddress: this.getCompany().companyInfo.addresses,
        primaryContact: primaryContact,
        primaryPhone: primaryPhone
      }
    }
    return null
  }
  parseAddress(item) {
    return `${item.suiteNumber ? item.suiteNumber + ', ' : ''}${item.address == null ? "No information yet" : item.address} ${item.address ? item.postalCode : ''}`;
  }
  addCompany() {
    this.usersStateService.showAddCustomerCompaniesInfo();
  }
  get f2() {
    return this.modelForm.controls;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
