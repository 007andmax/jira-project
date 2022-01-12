import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { CROPP_AVATAR_USER } from 'src/app/const/image-cropp';
import { UserProfile } from '../class/user-profile';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersAsideService } from './services/users-aside.service';
import { UserValidate } from '../class/user-validate';
import { UsersService } from 'src/app/services/users/users.service';
import { SelectClientCompanyStateService } from '../../shared/select-client-company/services/select-client-company-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn.directive';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { Subscription } from 'rxjs';
import { CrmCompanyJobType } from '../../setting/crm-settings/crm-company-job-type/class/crm-company-job-type';
import { Input } from 'hammerjs';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { CrmCompanyIndustry } from '../../setting/crm-settings/crm-company-industry/class/crm-company-industry';

@Component({
  selector: 'app-users-aside',
  templateUrl: './users-aside.component.html',
  styleUrls: ['./users-aside.component.scss'],
  providers: [UsersAsideService]
})
export class UsersAsideComponent implements OnInit, OnDestroy {

  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  public opened = false;
  user: UserProfile = new UserProfile();
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  companies = [];
  MODE_HIDE_ACTIVE = MODE_HIDE_ACTIVE;
  validate: UserValidate = new UserValidate();
  userTypes: Array<CrmCompanyJobType> = [];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  industries: Array<CrmCompanyIndustry> = [];
  @ViewChild('jobTypeDp') jobTypeDp: DropDownComponent;
  @ViewChild('jobTitleDp') jobTitleDp: DropDownComponent;
  sub: Subscription = new Subscription();
  constructor(private imageCropperStateService: ImageCropperStateService,
    private usersStateService: UsersStateService,
    private usersAsideService: UsersAsideService,
    private usersService: UsersService,
    private companiesStateService: CompaniesStateService,
    private companiesState: SelectClientCompanyStateService,
    private companySubscriptionState: CompanySubscriptionStateService,
    public cd: ChangeDetectorRef,
    private crmStateService: CrmStateService,
    private modalService: NgbModal,) { }


  ngOnInit() {
    this.industries = this.crmStateService.getIndustryList();
    let onGetIndustry = this.crmStateService.onGetIndustry.subscribe(data => {
      this.industries = data;
    })
    this.sub.add(onGetIndustry);
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    this.onCroppImage();
    this.usersStateService.getOpenAside().subscribe(data => {
      this.getJobTypeList();
      this.opened = true;
    })
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })

  }
  onSelectClientIndustry(item) {
    this.user.setUserIndustryId((item) ? item.id : null);
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
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (!this.opened || !data || this.imageCropperStateService.getAction() !== CROPP_AVATAR_USER) return;


      if (data.edit) {
        //  this.company.editLogo(data);
      } else {
        this.user.setLogo(data);
      }

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
  onChangeDefaultSubscriptions(data) {
    this.user.setDefaultSubscriptions(data);
  }
  onChangeCustomSubscriptions(data) {
    this.user.setCustomSubscriptions(data);
  }
  onCheckEmail() {

    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0 && this.user.companyId) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.user.companyId).subscribe((data: any) => {
      this.validate.setExistPrimaryContactEmail(data.value);
      this.cd.detectChanges();
    })
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);
  }

  onSelectJobTitle(data) {
    this.user.setJobTitleId(data.id);
  }
  onSelectRole(data) {
    this.user.setJobTypeId(data.id);
  }
  onChangeFistname() {
    this.validate.checkValidFirstName(this.user.firstName);
  }
  uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_USER);
    this.imageCropperStateService.uploadFileOnBrower(event);
  }
  public onSelectCompany(selectClient) {
    this.user.serCompanyId((selectClient === null) ? null : selectClient.id);
    if (selectClient !== null) this.validate.setCompanyValid();
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0 && this.user.companyId) this.onCheckValidPrimaryEmail();
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
    this.companiesState.onInitClear();
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
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
