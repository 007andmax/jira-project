import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserProfile } from '../class/user-profile';
import { UserValidate } from '../class/user-validate';
import { ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { UsersAsideService } from '../users-aside/services/users-aside.service';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { SelectClientCompanyStateService } from '../../shared/select-client-company/services/select-client-company-state.service';
import { CROPP_AVATAR_USER } from 'src/ng2/app/const/image-cropp';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { ModalImageCropperStateService } from 'src/ng2/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from 'src/ng2/app/services/modal/modal-image-cropper/class/image-croper';
import { CompanyEditLogo } from '../../companies/class/company-edit-logo';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { CompanySubscriptionStateService } from '../../companies/company-subscription/class/company-subscription-state.service';

@Component({
  selector: 'users-aside-edit',
  templateUrl: './users-aside-edit.component.html',
  styleUrls: ['./users-aside-edit.component.css'],
  providers: [UsersAsideService]
})
export class UsersAsideEditComponent implements OnInit {

  @ViewChild('role') role: any;
  public opened = false;
  user: UserProfile = new UserProfile();
  allTitles: Array<string> = [];
  validate: UserValidate = new UserValidate();
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  constructor(private imageCropperStateService: ImageCropperStateService, private usersStateService: UsersStateService,
    private usersAsideService: UsersAsideService,
    private usersService: UsersService,
    private companiesState: SelectClientCompanyStateService,
    private companiesStateService: CompaniesStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private companiesService: CompaniesService,
    private companySubscriptionState: CompanySubscriptionStateService,
    private modalService: NgbModal,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.usersStateService.getAllUsers().length > 0) this.getUsersTitle(this.usersStateService.getAllUsers());
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getUsersTitle(data);
    })
    this.usersAsideService.addSubscription(getOnUsers);
    this.onCroppImage();
    this.usersStateService.getOpenEditAside().subscribe(data => {
      this.role.clearClient()

      this.opened = true;
      this.user.onEdit(this.usersStateService.getuserForEdit());
      this.validate.addPhoneNumbers(this.user.phoneNumbers);
      let company = this.companiesStateService.getCompanies().find(item => item.id === this.user.companyId);

      this.companiesState.setCompanyFromtEdit(company);
      this.companySubscriptionState.onEditMode(this.user.subscription);


    })

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
    /* let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
       if (!this.opened || !data || this.imageCropperStateService.getAction() !== CROPP_AVATAR_USER) return;
 
 
       if (data.edit) {
         //  this.company.editLogo(data);
       } else {
         this.user.setLogo(data);
       }
 
     })
     this.usersAsideService.addSubscription(getConfirm);*/
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
    this.user.setRole(data);
  }
  onChangeFistname() {
    this.validate.checkValidFirstName(this.user.firstName);
  }
  uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_USER);
    this.imageCropperStateService.uploadFileOnBrower(event);
  }
  public onSelectCompany(selectClient) {

    this.user.serCompanyId((selectClient === 'null') ? null : selectClient.item.id);
    if (selectClient !== 'null') this.validate.setCompanyValid();
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
}
