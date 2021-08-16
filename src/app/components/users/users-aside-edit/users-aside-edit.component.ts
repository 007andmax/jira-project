import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'users-aside-edit',
  templateUrl: './users-aside-edit.component.html',
  styleUrls: ['./users-aside-edit.component.scss'],
  providers: [UsersAsideService]
})
export class UsersAsideEditComponent implements OnInit {
  public opened = false;
  user: UserProfile = new UserProfile();
  allTitles: Array<string> = [];
  selectedCompany: Company;
  companies = [];
  validate: UserValidate = new UserValidate();
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  selectedUserType = new TitleListType('Standar User', 'USER');
  userTypes: Array<TitleListType> = [new TitleListType('Standar User', 'USER'),
  new TitleListType('Manager', 'ADMIN')];
  @ViewChild('companyTags') companyTags: CompanyTagsComponent;
  constructor(private imageCropperStateService: ImageCropperStateService, private usersStateService: UsersStateService,
    private usersAsideService: UsersAsideService,
    private usersService: UsersService,
    private companiesState: SelectClientCompanyStateService,
    private companiesStateService: CompaniesStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private tagsState: CompanyTagsStateService,
    private companySubscriptionState: CompanySubscriptionStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersTitle(data);
    })
    this.usersAsideService.addSubscription(getOnUsers);
    this.onCroppImage();
    this.usersStateService.getOpenEditAside().subscribe(data => {
      this.opened = true;
      this.user.onEdit(this.usersStateService.getuserForEdit());
      this.companyTags.setSelectedTag(this.user.tags);
      this.selectedUserType = this.userTypes.find(item => item.type === this.user.role);
      this.validate.addPhoneNumbers(this.user.phoneNumbers);
      this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);
      this.companySubscriptionState.onEditMode(this.user.subscription);
    })
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
  }
  public onChangeTags(tags) {
    this.user.setTags(tags);
  }
  getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (!this.opened || !data || this.imageCropperStateService.getAction() !== CROPP_AVATAR_USER) return;
      this.usersService.changeAvatar(this.usersStateService.getuserForEdit().id, new CompanyEditLogo(data.croppedImage.base64, data.croppedImage.height,
        this.usersStateService.getuserForEdit().id, (data.edit) ? this.user.avatar.origin.id : data.id, data.croppedImage.width, data.croppedImage.imagePosition.x1, data.croppedImage.imagePosition.y1)).subscribe(res => {
          this.user.editLogo(res);
        })
    })
    this.usersAsideService.addSubscription(getConfirm);
  }

  getUsersTitle(allUsers) {
    this.allTitles = allUsers
      .map((user) => {
        return user.designation;
      })
      .reduce((acc, title) => {
        let index = acc.findIndex((el) => {
          return (el || '').toLowerCase() === (title || '').toLowerCase();
        })

        if (index === -1 && title) {
          acc.push(title);
        }

        return acc;
      }, []).sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ?
        1 : ((b.toLowerCase() > a.toLowerCase()) ? -1 : 0));

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
  onChangeSubscriptions(data) {

    data.forEach(item => this.user.subscription[item.field] = item.selected);
    // this.user.setSubscriptions(data);
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
  onSelectDesignation(data) {
    this.user.setDesignation(data);
  }
  onSelectRole(data) {
    this.selectedUserType = data;
    this.user.setRole(data.type);
  }
  onChangeFistname() {
    this.validate.checkValidFirstName(this.user.firstName);
  }
  uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_USER);
    this.imageCropperStateService.uploadFileOnBrower(event);
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
}
