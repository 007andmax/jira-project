import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { CROPP_AVATAR_USER } from 'src/app/const/image-cropp';
import { UserProfile } from '../class/user-profile';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersAsideService } from './services/users-aside.service';
import { UserValidate } from '../class/user-validate';
import { UsersService } from 'src/app/services/users/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { Subscription } from 'rxjs';
import { CrmCompanyJobType } from '../../setting/crm-settings/crm-company-job-type/class/crm-company-job-type';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MODE_EDIT_SUBSCRIPTION, MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { CrmCompanyIndustry } from '../../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { UserRole } from '../class/user-role';
import { CustomerRoleStateService } from 'src/app/states/customer-role/customer-role-state.service';

@Component({
  selector: 'app-users-aside',
  templateUrl: './users-aside.component.html',
  styleUrls: ['./users-aside.component.scss'],
  providers: [UsersAsideService]
})
export class UsersAsideComponent implements OnInit, OnDestroy {

  @ViewChild('userRolesDP', { static: false }) userRolesDP: DropDownComponent;
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  @ViewChild('jobTypeDp', { static: false }) jobTypeDp: DropDownComponent;
  @ViewChild('jobTitleDp', { static: false }) jobTitleDp: DropDownComponent;
  public opened = false;
  user: UserProfile = new UserProfile();
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  MODE_HIDE_ACTIVE = MODE_HIDE_ACTIVE;
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  validate: UserValidate = new UserValidate();
  userTypes: Array<CrmCompanyJobType> = [];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  idUploadFile: string;
  userRoles: Array<UserRole> = [];
  sub: Subscription = new Subscription();
  constructor(private imageCropperStateService: ImageCropperStateService,
    private usersStateService: UsersStateService,
    private usersAsideService: UsersAsideService,
    private usersService: UsersService,
    private companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
    private companiesService: CompaniesService,
    private crmStateService: CrmStateService,
    public customerRoleStateService: CustomerRoleStateService,
  ) { }


  ngOnInit() {
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    this.onCroppImage();
    this.userRoles = this.customerRoleStateService.getUserRoles();
    let getOpenAside = this.usersStateService.getOpenAside().subscribe(data => {
      if (!this.customerRoleStateService.isGetUserRole) this.customerRoleStateService.onInitGetUsersRoles();
      this.getJobTypeList();
      this.opened = true;
      this.addCompnay();
      this.user.setCompanyId(this.companiesStateService.getCurrentCompany().id);
      if (this.opened && this.companiesStateService.getCompanyRoutingId()) this.onSelectCompany(this.companiesStateService.getCompanies().find(item => item.id === this.companiesStateService.getCompanyRoutingId()), 0);
    })
    this.sub.add(getOpenAside);
    let onGetUserRole = this.customerRoleStateService.onGetUserRole.subscribe(data => {
      this.userRoles = this.customerRoleStateService.getUserRoles();
      if (this.userRolesDP) this.userRolesDP.reset(this.userRoles);
    })
    this.sub.add(onGetUserRole);

  }
  getJobTypeList() {
    if (this.crmStateService.getJobTypeList().length === 0) {
      this.crmStateService.onInitGetJobTypeList();
    } else {
      this.userTypes = this.crmStateService.getJobTypeList();
    }
    let onGetJobType = this.crmStateService.onGetJobType.subscribe(data => {
      this.userTypes = data;
      if (this.jobTypeDp) this.jobTypeDp.reset(this.userTypes);
    })
    this.sub.add(onGetJobType);
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (!this.opened || this.imageCropperStateService.getAction() !== CROPP_AVATAR_USER) return;
      if (data && this.user.avatar) this.companiesService.removeAttachment(this.user.avatar.origin.id).subscribe(res => {

      });
      if (data) this.user.setLogo(data);
      if (!data) this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {
      });
    })
    this.usersAsideService.addSubscription(getConfirm);
  }
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
  }
  addPhoneNumber() {
    this.user.addPhoneNumber();
    this.validate.addPhoneNumber();
  }
  public onChangeTags(tags) {
    this.user.setTags(tags);
  }
  onChangeDefaultSubscriptions(data, i) {
    this.user.customerCompaniesInfo[i].changeDefaultSubscriptions(data);
  }
  onChangeCustomSubscriptions(data) {
    this.user.setCustomSubscriptions(data);
  }
  onCheckEmail() {
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) {
      this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
      this.cd.detectChanges();
      if (this.validate.getPrimaryContactEmail()) this.onCheckValidPrimaryEmail();
    }
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.companiesStateService.getCurrentCompany().id).subscribe((data: any) => {
      this.validate.setExistPrimaryContactEmail(data.value);
      this.cd.detectChanges();
    })
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);
  }
  addCompnay() {
    this.user.addCustomerCompaniesInfo();
    this.validate.addCompany();
  }
  onSelectUserRole(data, index) {
    this.user.customerCompaniesInfo[index].setUserRole(data);
  }
  removeCompnay(i) {
    this.validate.removeCompany(i);
    this.user.customerCompaniesInfo.splice(i, 1);
  }
  onSelectJobTitle(data, index) {
    this.user.customerCompaniesInfo[index].setJobTitleDto(data);
    // this.user.setJobTitleId(data.id);
  }
  onSelectRole(data) {
    this.user.setJobTypeId(data.id);
  }
  onChangeFistname() {
    this.validate.checkValidFirstName(this.user.firstName);
  }
  uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_USER);
    this.imageCropperStateService.uploadFileOnBrower(event).then((data: any) => {
      this.idUploadFile = data.id;
    })
  }
  public onSelectCompany(selectClient, index) {
    if (selectClient) {
      this.user.customerCompaniesInfo[index].companyId = selectClient.id;
      this.validate.setCompanyValid(index);
    }
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.onCheckValidPrimaryEmail();
    this.cd.detectChanges();
  }
  removeLogo() {
    this.companiesService.removeAttachment(this.user.avatar.origin.id).subscribe(data => {
      this.user.editLogo(null);
    })
  }
  onAdd() {
    if (!this.validate.isValidate(this.user)) return;
    this.addBtn.setDisabled(true);
    this.usersService.addUser(this.user.getUserForAdd()).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.close();

    }, err => {
      this.addBtn.setDisabled(false);
    })

  }
  close() {
    this.opened = false;
    this.user = new UserProfile();
    this.validate = new UserValidate();
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  removePhoneNumber(i) {
    this.user.phoneNumbers.splice(i);
    this.validate.removePhoneNumber(i);
  }
  public trackById(index, item) {
    return item.id;
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackByID(index, item) {
    return item.companyId;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
