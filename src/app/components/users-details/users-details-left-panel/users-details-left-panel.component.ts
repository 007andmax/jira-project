import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PhoneNumber } from 'src/class/phone-number';

@Component({
  selector: 'app-users-details-left-panel',
  templateUrl: './users-details-left-panel.component.html',
  styleUrls: ['./users-details-left-panel.component.scss'],
  providers: [TicketsListService]
})
export class UsersDetailsLeftPanelComponent implements OnInit {
  companyId: string;
  modelForm: FormGroup;
  submitted: boolean = false;
  reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
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
    public formBuilder: FormBuilder,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.modelForm = this.formBuilder.group({
      phones: this.formBuilder.array([]),
      primaryEmail: ["",
        [Validators.required, this.checkEmail()]
      ],
    })
    this.user.phoneNumbers.forEach(item => {
      const itemGroup = this.formBuilder.group({
        name: [item.typeNumber, Validators.required], // Define the fields inside the FormGroup
        value: [item.number, this.checkPhone()]
      });
      this.phones.push(itemGroup);
    });
    console.log("this.phones", this.phones);
    this.modelForm.controls["primaryEmail"].setValue(this.user.primaryEmail);
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
  get phones(): FormArray {
    return this.modelForm.get('phones') as FormArray;
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
    console.log("this.modelForm", this.modelForm);
    if (this.modelForm.invalid) {

      return;
    }
    this.user.phoneNumbers = this.modelForm.value.phones.map(item => new PhoneNumber(item.name, item.value));
    this.user.primaryEmail = this.modelForm.value.primaryEmail;

    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {
      this.submitted = false;
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
  onCheckEmail() {
    console.log("this.f2.primaryEmail", this.f2.primaryEmail);
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
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
  }
  edit() {
    this.onEdit.emit(null);
  }
  addCompany() {
    this.usersStateService.showAddCustomerCompaniesInfo();
  }
  get f2() {
    return this.modelForm.controls;
  }
}
