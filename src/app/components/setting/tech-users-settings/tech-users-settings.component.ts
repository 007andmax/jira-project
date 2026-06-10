
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, Observer, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TechUsersService } from 'src/app/services/setting/tech-users.service';
import { SettingService } from 'src/app/services/setting/setting.service';
import { map } from 'rxjs/operators';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { DELETE_TECH_USER, RESTORE_USER } from 'src/app/const/confirm';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import * as moment from "moment";
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { TechUsersFilter } from './class/tech-users-filter';
import { User } from '../../users/class/user';
import { PermissionManageComponent } from './permission-manage/permission-manage.component';
import { TechUsersReassignComponent } from './tech-users-reassign/tech-users-reassign.component';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { UsersService } from 'src/app/services/users/users.service';
import { fadeInAnimation } from 'src/app/animations';
import { DropDownComponent } from '../../shared/drop-down/drop-down.component';
import { DynamicTooltipComponent } from '../../shared/dynamic-tooltip/dynamic-tooltip.component';
import { PreloaderTicketComponent } from '../../shared/preloader-ticket/preloader-ticket.component';
declare var $;

@Component({
  standalone: true,
  imports: [DropDownComponent, NgbTooltipModule, PermissionManageComponent, DisabledBtnDirective, DynamicTooltipComponent, PreloaderTicketComponent, CommonModule],
  selector: 'app-tech-users-settings',
  templateUrl: './tech-users-settings.component.html',
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
  host: { '[@fadeInAnimation]': '' },
  styleUrls: ['./tech-users-settings.component.scss'],

})
export class TechUsersSettingsComponent implements AfterViewInit, OnInit, OnDestroy {
  selectedIdx = -1;
  submitted = false;
  loading = true;
  create = false;
  edit = false;
  currentCompanyId = null;
  isEmailIdUnique = true;
  userlist: User[] = [];
  techUsers: User[] = [];
  techUserIdList: any[] = [];
  techRoles: any;
  selectedTechUser: any;
  techUserForm: UntypedFormGroup;
  imageBase64 = '';
  imageChangedEvent: any;
  croppedImage: any;
  isCroppedImg = false;
  cropAvatar: any;
  fileAvatar: any = null; // return result when first time image upload
  userId: any;
  IdList: any;
  idUploadFile: string;
  activeTab: string = "activeUsers";
  filter: TechUsersFilter = new TechUsersFilter();
  authenticationTypes = [new TitleListType("Password only", "DISABLED"),
  new TitleListType("Basic two-factor authentication", "BASIC"),
  new TitleListType("Secure two-factor authentication - by email", "SECURE"),
  new TitleListType("Secure two-factor authentication - Google authenticator", "GOOGLE_SECURE")];
  authenticationTypesType = new TitleListType("Password only", "DISABLED");
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  @ViewChild('editBtn', { static: false }) editBtn: DisabledBtnDirective;
  @ViewChild('userPermissions', { static: false }) userPermissions: PermissionManageComponent;
  sub: Subscription = new Subscription();
  constructor(
    private techUsersService: TechUsersService,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private settingService: SettingService,
    private settingStateService: SettingStateService,
    public cd: ChangeDetectorRef,
    private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private imageCropperStateService: ImageCropperStateService,
    private permissionsService: PermissionsService,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private usersRealTimeService: UsersRealTimeService,
    private usersService: UsersService
  ) {

    if (this.companiesStateService.getCurrentCompany()) this.currentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.currentCompany(res);
    })

  }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.techUsers = [];

    const emailPattern =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

    this.techUserForm = this.formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(15)]
      ],
      lastName: ['', [Validators.required, Validators.maxLength(15)]],
      primaryEmail: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(emailPattern)
        ])
      ],
      techRole: ['', [Validators.required]],
      newDevice: [''],
      userEmailNotificationId: [''],
      ticketCreated: [''],
      myTicketUpdated: [''],
      ticketCloseNotifications: [''],
      id: [''],
      twoFactorAuthType: [''],
      userEmailNotifications: {
        newDevice: [false],
        ticketCreated: [false],
        myTicketUpdated: [false],
        ticketCloseNotifications: [false],
      }
    });
    let changeUsersArray = this.usersRealTimeService.changeUsersArray.subscribe(newChange => {
      if (newChange.data.accountType !== "TECH") return;
      if ((newChange.action === 'USER_SAVED' || newChange.action === 'USER_ARCHIVED')) {
        const Index = this.techUsers.findIndex((item) => item.id === newChange.data.id);
        if (Index === -1) this.techUsers.unshift(new User(newChange.data));
        if (Index > -1) this.techUsers[Index].onUpdate(newChange.data);
        if (newChange.action === 'USER_SAVED' && !newChange.data.deletedAt) {
          const indexArchived = this.userlist.findIndex(item => item.id == newChange.data.id);
          if (indexArchived > -1 && this.userlist[indexArchived].deletedAt) this.userlist.splice(indexArchived, 1);
        }

        /*  const indexArchived = this.userlist.findIndex(item => item.id == newChange.data.id);
          if (indexArchived > -1) this.userlist.splice(indexArchived, 1);*/

      }
      if (newChange.action === 'USER_ARCHIVED') {
        const index = this.techUsers.findIndex((item) => item.id === newChange.data.id);
        if (index > -1) this.techUsers.splice(index, 1);
      }
      if (newChange.action === 'USERS_DEARCHIVED') {
        newChange.data.forEach(data => {
          const Index = this.techUsers.findIndex((item) => item.id === data.id);
          if (Index > -1) this.techUsers[Index].onUpdate(data);
        });
      }
      this.cd.detectChanges();
    })
    this.sub.add(changeUsersArray);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === RESTORE_USER) {
          this.restoreUser();
        }
        if (this.confirmStateService.getConfirmAction() === DELETE_TECH_USER) {
          if (this.techUserForm) this.techUserForm.reset();
          this.submitted = false;
          this.selectedTechUser = null;
          this.edit = false;
        }
      }
    })
    this.sub.add(getConfirm);
    this.getUsers(false);
    this.getRoleNames();
    this.settingStateService.setComponentName('TechUsersSettingsComponent');
    this.onCroppImage();
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (data) this.croppedImage = data.croppedImage;
      if (this.create) {
        if (!data) this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {
        });
        if (this.cropAvatar && data) this.companiesService.removeAttachment(this.cropAvatar.origin.id).subscribe(res => {
          this.cropIt();
        });
        if (!this.cropAvatar && data) this.cropIt();
      }
      if (this.edit) {
        if (!data) this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {
        });
        if (data && this.selectedTechUser.avatar) this.usersService.removeAvatar(this.selectedTechUser.id).subscribe(res => {
          this.selectedTechUser.avatar = null;
          this.cropIt();
        });
        if (data && !this.selectedTechUser.avatar) this.cropIt();
      }


    })
    this.sub.add(getConfirm);
  }
  ngAfterViewInit(): void { }

  // convenience getter for easy access to form fields
  get f() {
    return this.techUserForm.controls;
  }

  setTab(data) {
    if (data['nextId'] === "activeUsers") this.getUsers(false);
    if (data['nextId'] === "archivedUsers") this.getUsers(true);
    this.activeTab = data['nextId'];
  }
  /**
   * get role names
   */
  getRoleNames() {
    this.techUsersService
      .getRoleNames()
      .pipe(
        map(roles => {
          if (roles) {
            this.techRoles = roles;
          }
        })
      )
      .subscribe();
  }
  onChangeRole(data) {
    this.techUserForm.patchValue({
      techRole: data
    });
    this.techUserForm.controls["techRole"].setErrors(null);
  }
  getLastLoginAt(date) {
    return moment(date).format("HH:mm A, DD MMM");
  }
  restoreConfirm(id) {
    this.userId = id;
    this.confirmStateService.setConfirmAction(RESTORE_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.header = `Restore User`;
    modalRef.componentInstance.message = `Are you sure you want to restore user?`;
    this.cd.detectChanges();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  restoreUser() {
    this.techUsersService.restoreUser(this.userId)
      .subscribe(
        response => {
          this.confirmStateService.initRequest(false);
          //  this.getUsers();
        }, err => {
          this.confirmStateService.initRequest(false);
        });
  }
  onAuthTypeChange(data) {
    this.authenticationTypesType = this.authenticationTypes.find(item => item.type == data);
    this.techUserForm.patchValue({
      twoFactorAuthType: data
    });
  }

  /**
   * get tech users from usres.
   */
  getUsers(isArchived) {
    this.loading = true;
    this.techUsersService
      .getUsers(isArchived)
      .pipe(
        map((users: any) => {
          this.userlist = users;
          this.userlist.sort((a, b) => ((a.firstName + a.lastName).toLowerCase() > (b.firstName + b.lastName).toLowerCase()) ?
            1 : (((b.firstName + b.lastName).toLowerCase() > (a.firstName + a.lastName).toLowerCase()) ? -1 : 0));
          return this.userlist;
        })
      )
      .subscribe(
        (techUsers: any) => {
          this.loading = false;
          let users = this.userlist.filter(user => user.accountType.toLowerCase() === 'tech');
          this.IdList = users.map(({ id }) => id);
          if (techUsers) {
            this.techUsers = techUsers.map(item => new User(item));
            this.techUserIdList = techUsers.map(({ id }) => id);
            var IdList1 = [];
            if (this.techUserIdList) {
              IdList1 = this.IdList.concat(this.techUserIdList);
            }
          }
        },
        error => {
          this.loading = false;
        }
      );
  }

  getSecureText(twoFactorAuthType) {
    if (twoFactorAuthType == "DISABLED") return "Password only";
    if (twoFactorAuthType == "BASIC") return "Basic";
    if (twoFactorAuthType == "SECURE") return "Secure by email";
    if (twoFactorAuthType == "GOOGLE_SECURE") return "Secure by Google Authenticator";
    return '';
  }



  /**
   * opened model, when click on dropdown emil notification
   * @param index
   */

  emailNotificationDropDown(index: number) {
    if (!this.getPermissions('EDIT_USERS')) return;
    if (this.selectedIdx !== index) {
      this.selectedIdx = index;
    } else {
      this.selectedIdx = -1;
    }
  }

  /**
   * change password request based on tech user id
   * @param id
   */
  changePasswordRequest(id: string) {
    this.techUsersService
      .changePasswordRequest(id)
      .pipe(
        map(res => {
          this.toastr.success('Change Password Request Sent Successfully.');
        })
      )
      .subscribe();
  }

  /**
   * resend wel come email for varification user
   * @param userEmail
   */
  resendWelcomeEmail(userEmail: string) {
    this.techUsersService
      .verifyUserEmail(userEmail)
      .subscribe();
  }

  /**
   * opened creat tech user Model
   */
  creatTechUsr() {
    this.authenticationTypesType = new TitleListType("Password only", "DISABLED");
    this.fileAvatar = null;
    this.selectedTechUser = null;
    this.create = !this.create;
    this.submitted = false;
    this.techUserForm.reset();
    if (this.create) {
      this.techUserForm.patchValue({
        userEmailNotifications: {
          newDevice: false,
          ticketCreated: false,
          myTicketUpdated: false,
          ticketCloseNotifications: false,
        }
      });
    }
  }

  /**
   * edit tech user model
   * @param techUser
   */

  editTechUser(techUser) {
    if (techUser === null) {
      return;
    }
    this.edit = true;
    this.selectedTechUser = techUser;
    if (techUser) {
      this.authenticationTypesType = this.authenticationTypes.find(item => item.type == techUser.twoFactorAuthType);
      this.techUserForm.patchValue({
        firstName: techUser.firstName,
        lastName: techUser.lastName,
        primaryEmail: techUser.primaryEmail,
        techRole: techUser.techRole,
        newDevice: techUser.userEmailNotifications == undefined ? [''] : techUser.userEmailNotifications.newDevice,
        ticketCreated: techUser.userEmailNotifications == undefined ? [''] : techUser.userEmailNotifications.ticketCreated,
        myTicketUpdated: techUser.userEmailNotifications == undefined ? [''] : techUser.userEmailNotifications.myTicketUpdated,
        ticketCloseNotifications: techUser.userEmailNotifications == undefined ? [''] : techUser.userEmailNotifications.ticketCloseNotifications,
        userEmailNotificationId: techUser.userEmailNotifications == undefined ? [''] : techUser.userEmailNotifications.id,
        id: techUser.id,
        twoFactorAuthType: techUser.twoFactorAuthType,
      });
    }
  }

  removeUserConfirm(techuser: any) {
    this.userId = techuser;

    this.confirmStateService.setConfirmAction(DELETE_TECH_USER);
    const modalRef = this.modalService.open(TechUsersReassignComponent, { windowClass: 'xs-modal user-modal', container: "app-tech-users-settings", backdrop: 'static', keyboard: false });
    modalRef.componentInstance.techUser = techuser;


  /*  this.confirmStateService.setConfirmAction(DELETE_TECH_USER);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to delete?`;
  */  this.cd.detectChanges();
  }

  public onFilter(field, list) {
    this.filter.onFilter(field, list)

  }


  /**
   * current comapny
   */
  currentCompany(currentCompany) {
    localStorage.setItem('currentComapnyId', currentCompany.id);
    this.currentCompanyId = currentCompany.id;
  }

  /**
   * selected file on upload
   * @param event
   */

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageChangedEvent = event;
      const fromData = new FormData();
      fromData.append('file', event.target.files[0]);
      this.settingService.fileAvatar(fromData).subscribe(
        (result: any) => {
          if (result) {
            this.fileAvatar = result;
            this.idUploadFile = result.id;
            this.modalImageCropperStateService.onInitOpen(new ImageCroper(result.base64, result.id));
            event.target.value = null;
          }
        },
        error => {
          this.isCroppedImg = false;
          event.target.value = null;
        }
      );
    }
  }

  onInputClick(event: any) {
    event.target.value = '';
  }

  cropIt() {
    this.isCroppedImg = false;
    let cropImage = {};

    if (this.fileAvatar !== null && this.fileAvatar !== undefined) {
      this.fileAvatar.base64 = undefined;
      cropImage = {
        h: this.croppedImage.height,
        origin: this.fileAvatar,
        w: this.croppedImage.width,
        x: 178, // this.croppedImage.cropperPosition.x1,
        y: 44, // this.croppedImage.cropperPosition.y1,
        base64: this.croppedImage.base64
      };
    } else {
      cropImage = {
        id: this.currentCompanyId,
        origin: this.selectedTechUser.avatar.origin,
        cropped: this.selectedTechUser.avatar.cropped,
        x: this.croppedImage.cropperPosition.x1,
        y: this.croppedImage.cropperPosition.y1,
        w: this.croppedImage.width,
        h: this.croppedImage.height,
        updatedAt: this.selectedTechUser.avatar.updatedAt,
        base64: this.croppedImage.base64
      };
    }

    if (this.create) {
      this.cropAvatar = cropImage;
    } else {
      this.cropAvatar = null;
    }

    if (!this.selectedTechUser) {
      return;
    }

    this.settingService
      .updateAvatar(this.selectedTechUser.id, cropImage)
      .subscribe(
        avatar => {
          if (avatar) {
            this.selectedTechUser
              ? (this.selectedTechUser.avatar = avatar)
              : null;
            this.toastr.success('Image Cropped Successfully');
          }
        },
        error => {
        }
      );
  }

  /**
   * checked email uqunie or not
   * @param email
   */
  isEmailUnique(email: string) {
    if (!this.techUserForm.value.primaryEmail) {
      this.isEmailIdUnique = true;
      this.submitted = false;
      return;
    }

    if (
      this.selectedTechUser !== null &&
      this.techUserForm.value.primaryEmail ===
      this.selectedTechUser.primaryEmail
    ) {
      this.isEmailIdUnique = true;
      return;
    }

    this.techUsersService
      .isEmailUnique(this.techUserForm.value.primaryEmail, null, true)
      .pipe(
        map((unique: any) => {
          this.isEmailIdUnique = unique.value;
        })
      )
      .subscribe();
  }

  /**
   * saved om create new tech users
   */
  onCreateSubmit() {
    this.submitted = true;
    this.isEmailIdUnique = true;
    // stop here if form is invalid
    if (this.techUserForm.invalid) {
      return;
    }

    if (!this.techUserForm.get('primaryEmail').value) {
      this.isEmailIdUnique = false;
      return;
    }

    if (this.isEmailIdUnique) {
      let objTechUser: any = {
        techRole: this.techUserForm.value.techRole
          ? this.techUserForm.value.techRole
          : this.techRoles[0],
        firstName: this.techUserForm.value.firstName,
        lastName: this.techUserForm.value.lastName,
        primaryEmail: this.techUserForm.value.primaryEmail,
        companyId: this.currentCompanyId,
        "userEmailNotifications": {
          "newDevice": (this.techUserForm.value.newDevice != null) ? this.techUserForm.value.newDevice : false,
          "ticketCreated": (this.techUserForm.value.ticketCreated != null) ? this.techUserForm.value.ticketCreated : false,
          "myTicketUpdated": (this.techUserForm.value.myTicketUpdated != null) ? this.techUserForm.value.myTicketUpdated : false,
          "ticketCloseNotifications": (this.techUserForm.value.ticketCloseNotifications != null) ? this.techUserForm.value.ticketCloseNotifications : false
        },
        twoFactorAuthType: this.techUserForm.value.twoFactorAuthType,
      };
      if (this.cropAvatar) objTechUser.avatar = this.cropAvatar;
      this.addBtn.setDisabled(true);
      this.techUsersService.createUser(objTechUser).subscribe(
        (savedTechUsre: any) => {
          this.addBtn.setDisabled(false);
          this.toastr.success('Saved Successfully');
          this.create = false;
        },
        error => {
          this.addBtn.setDisabled(false);
          this.create = false;
          const er = error.error.validationResults;
          this.toastr.error(er.techRole || 'Bad Request');
        }
      );
    } else {
    }
  }
  deleteAttachment() {
    this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {
      this.croppedImage = null;
    });
  }
  /**
   * delete avatar
   */
  deleteAvatar() {
    let id = '';
    if (!this.selectedTechUser || !this.selectedTechUser.avatar) {
      id = this.fileAvatar ? this.fileAvatar.id : '';
    } else {
      id = this.selectedTechUser.id;
    }

    if (!id) {
      return;
    }

    this.usersService.removeAvatar(id).subscribe(
      res => {
        this.toastr.success('Avatar Deleted Successfully');

        const profileUser = {
          basic: {
            avatar: null,
            firstName: this.techUserForm.value.firstName,
            lastName: this.techUserForm.value.lastName,
            primaryEmail: this.techUserForm.value.primaryEmail
          }
        };
        this.selectedTechUser.avatar = null;
      },
      error => {
        this.toastr.error(error);
      }
    );
  }

  closeModel() {
    this.fileAvatar = null;
    this.isCroppedImg = false;
  }

  /**
   * open image and reposition it
   */
  rePositionAvatar() {
    if (this.selectedTechUser && this.selectedTechUser.avatar) {
      const imageUrl = `/file/${this.selectedTechUser.avatar.origin.id}.jpg`;
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.isCroppedImg = true;
        this.croppedImage = this.selectedTechUser.avatar.cropped;
        this.croppedImage.base64 = base64data;
        this.imageBase64 = base64data;
      });
    } else if (this.create && this.cropAvatar) {
      const imageUrl = `/file/${this.cropAvatar.origin.id}.jpg`;
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.isCroppedImg = true;
        this.croppedImage.base64 = base64data;
        this.imageBase64 = base64data;
      });
    }
  }

  /**
   * get based64 image from url
   * @param url
   */
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  /**
   * get based64 image
   * @param img
   */
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }

  /**
   * edit tech user
   */
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.techUserForm.invalid) {
      return;
    }
    let dataFotUpdate =
    {

      "phoneNumbers": this.selectedTechUser.phoneNumbers,
      "id": this.selectedTechUser.id,
      "avatar": this.selectedTechUser.avatar,
      // "jobTitleId": this.selectedTechUser.jobTitleId,
      "firstName": this.techUserForm.value.firstName,
      "lastName": this.techUserForm.value.lastName,
      "jobDescription": this.selectedTechUser.jobDescription,
      "priority": this.selectedTechUser.priority,
      "primaryEmail": this.techUserForm.value.primaryEmail,
      "secondaryEmail": this.selectedTechUser.secondaryEmail,
      "status": this.selectedTechUser.status,
      "techRole": this.techUserForm.value.techRole,
      "userEnabled": this.selectedTechUser.userEnabled,
      //  "jobTypeId": this.selectedTechUser.jobTypeId,
      // "defaultSubscriptions": this.selectedTechUser.defaultSubscriptions,
      //"customSubscriptions": this.selectedTechUser.customSubscriptions,
      "twoFactorAuthType": this.techUserForm.value.twoFactorAuthType,
      "companyId": this.selectedTechUser.company
        ? this.selectedTechUser.company.id
        : null,
      "userEmailNotifications": {
        "newDevice": this.techUserForm.value.newDevice,
        "ticketCreated": this.techUserForm.value.ticketCreated,
        "myTicketUpdated": this.techUserForm.value.myTicketUpdated,
        "ticketCloseNotifications": this.techUserForm.value
          .ticketCloseNotifications,
        "id": this.techUserForm.value.userEmailNotificationId
      }
    }
    /* this.selectedTechUser.firstName = this.techUserForm.value.firstName;
     this.selectedTechUser.lastName = this.techUserForm.value.lastName;
     this.selectedTechUser.primaryEmail = this.techUserForm.value.primaryEmail;
     this.selectedTechUser.techRole = this.techUserForm.value.techRole;
     this.selectedTechUser.twoFactorAuthType = this.techUserForm.value.twoFactorAuthType;
     this.selectedTechUser.defaultSubscriptions = null;
     this.selectedTechUser.initials = [
       this.techUserForm.value.firstName,
       this.techUserForm.value.lastName
     ]
       .map(function (s) {
         return s.charAt(0).toUpperCase();
       })
       .join('');*/

    /* this.selectedTechUser.companyId = this.selectedTechUser.company
       ? this.selectedTechUser.company.id
       : null;*/

    this.editBtn.setDisabled(true);
    this.techUsersService
      .updateTechUsers(this.selectedTechUser.id, dataFotUpdate)
      .subscribe(
        res => {
          this.editBtn.setDisabled(false);
          this.toastr.success('Updated Successfully');
          this.techUserForm.reset();
          this.submitted = false;
          this.selectedTechUser = null;
          this.edit = false;
        },
        error => {
          this.editBtn.setDisabled(false);
          this.edit = false;
          const er = error.error.validationResults;
          this.toastr.error(er.techRole || 'Bad Request');
        }
      );
  }

  ngOnDestroy(): void {
    $('body').removeClass('page-settings');
    this.sub.unsubscribe();
  }

  onBackMenu() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('backMenu'); // remove the class
    body.classList.add('backMenu');
  }

  displayFrstLstChar(techUser: any) {
    if (techUser) {
      return [techUser.firstName, techUser.lastName]
        .map(function (s) {
          return s.charAt(0).toUpperCase();
        })
        .join('');
    }
  }
}
