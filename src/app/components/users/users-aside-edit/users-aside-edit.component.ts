import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { UserProfile } from '../class/user-profile';
import { UserValidate } from '../class/user-validate';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UsersAsideService } from '../users-aside/services/users-aside.service';
import { UsersService } from 'src/app/services/users/users.service';
import { SelectClientCompanyStateService } from '../../shared/select-client-company/services/select-client-company-state.service';
import { CROPP_AVATAR_USER } from 'src/app/const/image-cropp';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { CompanyEditLogo } from '../../companies/class/company-edit-logo';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';
import { Company } from 'src/app/interfaces/company/company';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { CompanyTagsStateService } from '../../companies/company-tags/states/company-tags-state.service';
import { CompanyTagsComponent } from '../../companies/company-tags/company-tags.component';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { Subscription } from 'rxjs';
import { CrmCompanyJobType } from '../../setting/crm-settings/crm-company-job-type/class/crm-company-job-type';
import { CrmCompanyJobTitle } from '../../setting/crm-settings/crm-company-job-title/class/crm-company-job-title';
import { MODE_EDIT_SUBSCRIPTION, MODE_HIDE_ACTIVE } from 'src/app/const/users';
import { CrmCompanyIndustry } from '../../setting/crm-settings/crm-company-industry/class/crm-company-industry';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'users-aside-edit',
  templateUrl: './users-aside-edit.component.html',
  styleUrls: ['./users-aside-edit.component.scss'],
  providers: [UsersAsideService, TicketsListService]
})
export class UsersAsideEditComponent implements OnInit, OnDestroy {
  public opened = false;
  user: UserProfile = new UserProfile();
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  selectedCompany: Company;
  companies = [];
  validate: UserValidate = new UserValidate();
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  selectedUserType: CrmCompanyJobType;
  selectedUserTitle: CrmCompanyJobTitle;
  selectedUserIndustry: CrmCompanyIndustry;
  userTypes: Array<CrmCompanyJobType> = [];
  sub: Subscription = new Subscription();
  MODE_EDIT_SUBSCRIPTION = MODE_EDIT_SUBSCRIPTION;
  industries: Array<CrmCompanyIndustry> = [];
  idUploadFile: string;
  @ViewChild('companyTags') companyTags: CompanyTagsComponent;
  @ViewChild('jobTitleDp') jobTitleDp: DropDownComponent;
  @ViewChild('jobTypeDp') jobTypeDp: DropDownComponent;
  @ViewChild('jobIndustryDp') jobIndustryDp: DropDownComponent;

  constructor(private imageCropperStateService: ImageCropperStateService,
    public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService,
    private usersAsideService: UsersAsideService,
    private usersService: UsersService,
    private companiesState: SelectClientCompanyStateService,
    private companiesStateService: CompaniesStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private tagsState: CompanyTagsStateService,
    private companySubscriptionState: CompanySubscriptionStateService,
    private crmStateService: CrmStateService,
    private companiesService: CompaniesService,
    public cd: ChangeDetectorRef) { }

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
    this.usersStateService.getOpenEditAside().subscribe(data => {
      this.opened = true;
      this.getJobTypeList();
      this.user.onEdit(this.usersStateService.getuserForEdit());
      this.companyTags.setSelectedTag(this.user.tags);
      this.selectedUserType = this.userTypes.find(item => item.id == this.user.jobTypeId);
      this.selectedUserTitle = this.jobTitleList.find(item => item.id == this.user.jobTitleId);
      this.selectedUserIndustry = this.industries.find(item => item.id == this.user.userIndustryId);
      this.validate.addPhoneNumbers(this.user.phoneNumbers);
      this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);
    })
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
  }
  onSelectClientIndustry(item) {
    this.selectedUserIndustry = item;
    this.user.setUserIndustryId((item) ? item.id : null);
  }
  public onChangeTags(tags) {
    this.user.setTags(tags);
  }
  getJobTypeList() {
    if (this.crmStateService.getJobTypeList().length === 0) {
      this.crmStateService.onInitGetJobTypeList();
    } else {
      this.userTypes = this.crmStateService.getJobTypeList();
    }
    let onGetJobType = this.crmStateService.onGetJobType.subscribe(data => {
      this.userTypes = data;
      if (!this.selectedUserType && this.opened) this.selectedUserType = this.userTypes.find(item => item.id == this.user.jobTypeId);
      if (this.jobTypeDp) this.jobTypeDp.reset(this.userTypes);
    })
    this.sub.add(onGetJobType);
  }
  removeLogo() {
    this.usersService.removeAvatar(this.user.id).subscribe(data => {
      this.user.editLogo(null);
    })
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (this.imageCropperStateService.getAction() !== CROPP_AVATAR_USER) return;
      if (this.opened && !data) {
        this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {

        });
      }
      if (!this.opened || !data) return;
      if (this.user.avatar) this.usersService.removeAvatar(this.user.id).subscribe(res => {
        this.editUserAvatar(data);
      })
      if (!this.user.avatar) this.editUserAvatar(data);


    })
    this.usersAsideService.addSubscription(getConfirm);
  }
  editUserAvatar(data) {
    this.usersService.changeAvatar(this.usersStateService.getuserForEdit().id, new CompanyEditLogo(data.croppedImage.base64, data.croppedImage.height,
      this.usersStateService.getuserForEdit().id, (data.edit) ? this.user.avatar.origin.id : data.id, data.croppedImage.width, data.croppedImage.imagePosition.x1, data.croppedImage.imagePosition.y1)).subscribe(res => {
        this.user.editLogo(res);
      })
  }
  onChangeDefaultSubscriptions(data) {
    this.user.setDefaultSubscriptions(data);
  }
  onChangeCustomSubscriptions(data) {
    this.user.setCustomSubscriptions(data);
  }
  onChangeJobDescription(event) {
    this.user.jobDescription = event.target.value;
  }
  getLogoUrl() {
    if (this.user && this.user.avatar && this.user.avatar && this.user.avatar.base64 && !this.user.avatar.cropped) return this.user.avatar.base64;
    if (this.user && this.user.avatar && this.user.avatar.cropped && this.user.avatar.cropped.id) return `/file/${this.user.avatar.cropped.id}`;
    if (this.user && this.user.avatar && this.user.avatar.origin && this.user.avatar.origin.id) return `/file/${this.user.avatar.origin.id}`;
    return '/company/default/logo.jpg';
  }
  getUserType() {
    if (this.user.role === 'USER') return 'Standar User';
    if (this.user.role === 'ADMIN') return 'Manager';
    return '';
  }
  addPhoneNumber() {
    this.user.addPhoneNumber();
    this.validate.addPhoneNumber();
  }
  onCheckEmail() {
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0) this.validate.checkValidPrimaryEmail(this.user.primaryEmail);
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0 && this.user.companyId) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.user.primaryEmail, this.user.companyId, this.usersStateService.getuserForEdit().id).subscribe((data: any) => {

      this.validate.setExistPrimaryContactEmail(data.value);
      this.cd.detectChanges();
    })
  }
  onCheckPhoneNumber(i) {
    this.validate.checkValidPhoneNumber(i, this.user.phoneNumbers[i].number);

  }
  onSelectJobTitle(data) {
    this.selectedUserTitle = data;
    this.user.setJobTitleId(data.id);
  }
  onSelectRole(data) {
    this.selectedUserType = data;
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
  public onSelectCompany(selectClient) {
    this.selectedCompany = selectClient;
    this.user.serCompanyId((selectClient === null) ? null : selectClient.id);
    if (selectClient !== null) this.validate.setCompanyValid();
    if (this.user.primaryEmail && this.user.primaryEmail.length > 0 && this.user.companyId) this.onCheckValidPrimaryEmail();

  }

  onSave() {
    if (!this.validate.isValidate(this.user)) return;
    this.usersService.updateUser(this.user.getUserForUpdate(this.usersStateService.getuserForEdit())).subscribe(data => {
      this.close();
    })

  }
  public onChangeAvatar() {
    this.imageCropperStateService.setAction(CROPP_AVATAR_USER);

    this.downloadCompanyLogo().then(data => {
      //   const modalRef = this.modalService.open(ImageCropperComponent);

      //  modalRef.componentInstance.imageBase64 = data;
      //  modalRef.componentInstance.id = this.user.avatar.origin.id;
      this.modalImageCropperStateService.onInitOpen(new ImageCroper(data, this.user.avatar.origin.id, true));
      this.cd.detectChanges();

    })
  }
  downloadCompanyLogo() {
    return new Promise((resolve, reject) => {
      if (this.user.avatar && this.user.avatar && this.user.avatar.base64 && !this.user.avatar.cropped) {
        resolve(this.user.avatar.base64);
      } else {
        var req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.open('GET', `/file/${this.user.avatar.origin.id}.jpg`, true); /* Третий аргумент true означает асинхронность */
        req.onload = (oEvent) => {

          var blob = new Blob([req.response], { type: "image/jpg" });

          this.changeFile(blob).then((base64: string): any => {

            resolve(base64);

          });

        };
        req.send(null);
      }
    });
  };
  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  removePhoneNumber(i) {
    this.user.phoneNumbers.splice(i);
    this.validate.removePhoneNumber(i);
  }
  close() {
    this.opened = false;
    this.user = new UserProfile();
    this.validate = new UserValidate();
    this.companiesState.onInitClear();
    this.selectedUserTitle = null;
    this.selectedUserType = null;
    this.selectedUserIndustry = null;
    this.jobTitleDp.clearWithOutChanges();
    this.jobTypeDp.clearWithOutChanges();
    this.jobIndustryDp.clearWithOutChanges();
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
