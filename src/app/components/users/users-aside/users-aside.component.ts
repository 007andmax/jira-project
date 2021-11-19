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
  allTitles: Array<string> = [];
  companies = [];
  validate: UserValidate = new UserValidate();
  selectedUserType: CrmCompanyJobType;
  userTypes: Array<CrmCompanyJobType> = [];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
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

    this.allTitles = this.crmStateService.getJobTitleList().map(item => item.name);
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.allTitles = data.map(item => item.name);
    })
    this.sub.add(onGetJobTitle);
    this.onCroppImage();
    this.usersStateService.getOpenAside().subscribe(data => {
      this.getJobTypeList();
      this.opened = true;
      this.companySubscriptionState.onEditMode(this.user.subscription);
    })
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })

  }
  getJobTypeList() {
    if (this.crmStateService.getJobTypeList().length === 0) {
      this.crmStateService.onInitGetJobTypeList();
    } else {
      this.userTypes = this.crmStateService.getJobTypeList();
    }
    let onGetJobType = this.crmStateService.onGetJobType.subscribe(data => {
      this.userTypes = data;
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
  onChangeSubscriptions(data) {

    data.forEach(item => this.user.subscription[item.field] = item.selected);
    //  this.user.setSubscriptions(data);
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

  onSelectDesignation(data) {

    this.user.setDesignation(data);
  }
  onSelectRole(data) {
    this.selectedUserType = data;
    this.user.setRole(data.name);
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
