import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

import { TechUsersService } from 'src/ng2/app/services/setting/tech-users.service';
import { SettingService } from 'src/ng2/app/services/setting/setting.service';
import { map } from 'rxjs/operators';

declare var $;

@Component({
  selector: 'app-tech-users',
  templateUrl: './tech-users.component.html',
  styleUrls: ['./tech-users.component.scss']
})
export class TechUsersComponent implements AfterViewInit, OnInit, OnDestroy {
  selectedIdx = -1;
  submitted = false;
  loading = false;
  create = false;
  edit = false;
  currentCompanyId = null;
  isEmailIdUnique = true;
  isArchived: boolean;
  userlist: any[];
  techUsers: [];
  techUserIdList: [];
  techRoles: any;
  selectedTechUser: any;
  techUseremailNotificationList: any;
  archivedtechUseremailNotificationList: any;
  techUserForm: FormGroup;

  imageBase64 = '';
  imageChangedEvent: any;
  croppedImage: any;
  isCroppedImg = false;
  cropAvatar: any;
  fileAvatar: any = null; // return result when first time image upload
  popup: boolean;
  deletepopup: boolean;
  userId: any;
  constructor(
    private techUsersService: TechUsersService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private settingService: SettingService
  ) {
    const currentComapnyId = localStorage.getItem('currentComapnyId');
    if (currentComapnyId) {
      this.currentCompanyId = currentComapnyId;
    } else {
      this.currentCompany();
    }
  }

  /**
   * init
   */
  ngOnInit() {
    this.techUsers = [];

    const emailPattern =
      '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

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
      techRole: [''],
      newDevice: [''],
      ticketCreated: [''],
      myTicketUpdated: [''],
      ticketCloseNotifications: [''],
      id: ['']
    });

    this.getUsers();
    this.getRoleNames();
  }

  ngAfterViewInit(): void {}

  // convenience getter for easy access to form fields
  get f() {
    return this.techUserForm.controls;
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

  restoreConfirm(id) {
    this.userId = id;
    this.popup = true;
  }

  restoreUser() {
    this.loading = true;
    this.techUsersService
      .restoreUser(this.userId)
      .pipe()
      .subscribe(
        response => {
          this.loading = false;
          this.popup = false;
          this.getUsers();
          this.toastr.success('User has been restore successfully.');
        },
        error => {
          this.loading = false;
          this.popup = false;
          this.toastr.error('Something wen to wrong. Please try again later');
          this.getUsers();
        }
      );
  }

  /**
   * get tech users from usres.
   */
  getUsers() {
    this.loading = true;
    this.techUsersService
      .getUsers()
      .pipe(
        map((users: any) => {
          this.userlist = users.filter((u: any) => u.deletedAt !== null);
          return users.filter(
            (user: any) =>
              user.accountType.toLowerCase() === 'tech' &&
              user.deletedAt === null
          );
        })
      )
      .subscribe(
        (techUsers: any) => {
          this.loading = false;
          this.archivedemailNotification(this.userlist);
          if (techUsers) {
            this.techUsers = techUsers;
            this.techUserIdList = techUsers.map(({ id }) => id);
            if (this.techUserIdList) {
              this.emailNotification(this.techUserIdList);
            }
          }
        },
        error => {
          this.loading = false;
        }
      );
  }

  /**
   * tech User email notifications based on tech user id.
   * @param techUserIdList
   */
  emailNotification(techUserIdList) {
    this.techUsersService
      .getUsersEmailNotifications(techUserIdList)
      .pipe(
        map(eNotifications => {
          if (eNotifications) {
            this.techUseremailNotificationList = eNotifications;
          }
        })
      )
      .subscribe();
  }

  archivedemailNotification(techUserIdList) {
    const IdList = techUserIdList.map(({ id }) => id);
    this.techUsersService
      .getUsersEmailNotifications(IdList)
      .pipe(
        map(eNotifications => {
          if (eNotifications) {
            this.archivedtechUseremailNotificationList = eNotifications;
          }
        })
      )
      .subscribe();
  }

  /**
   * opened model, when click on dropdown emil notification
   * @param index
   */

  emailNotificationDropDown(index: number) {
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
      .pipe(
        map(res => {
          this.toastr.success(`Resend Welcome Email Sent Successfully`);
        })
      )
      .subscribe();
  }

  /**
   * opened creat tech user Model
   */
  creatTechUsr() {
    this.fileAvatar = null;
    this.selectedTechUser = null;
    this.create = !this.create;
    this.submitted = false;
    this.techUserForm.reset();
    if (this.create) {
      this.techUserForm.patchValue({
        techRole: this.techRoles[0]
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
      const notification = this.techUseremailNotificationList[techUser.id];
      this.techUserForm.patchValue({
        firstName: techUser.firstName,
        lastName: techUser.lastName,
        primaryEmail: techUser.primaryEmail,
        techRole: techUser.techRole,
        newDevice: notification.newDevice,
        ticketCreated: notification.ticketCreated,
        myTicketUpdated: notification.myTicketUpdated,
        ticketCloseNotifications: notification.ticketCloseNotifications,
        id: techUser.id
      });
    }
  }

  removeUserConfirm(techuser: any) {
    this.userId = techuser;
    this.deletepopup = true;
  }

  /**
   * removed tech user
   * @param techUser
   */
  removeTechUser() {
    const id = this.userId.id;
    if (this.userId) {
      this.loading = true;
      this.techUsersService
        .archiveUser([this.userId.id])
        .pipe(
          map(archiveUser => {
            this.loading = false;
            this.deletepopup = false;
            // deleted techuser.
            // if (this.techUsers.find((x: any) => x.id === this.userId.id)) {
            //   this.techUsers.splice(
            //     this.techUsers.findIndex((x: any) => x.id === this.userId.id),
            //     1
            //   );
            // }
            this.getUsers();
          })
        )
        .subscribe();
    }
  }

  /**
   * current comapny
   */
  currentCompany() {
    this.techUsersService
      .currentComapny()
      .pipe(
        map((currentCompany: any) => {
          if (currentCompany) {
            localStorage.setItem('currentComapnyId', currentCompany.id);
            this.currentCompanyId = currentCompany.id;
          }
        })
      )
      .subscribe();
  }

  /**
   * selected file on upload
   * @param event
   */

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      // const size = event.target.files[0].size;
      // if (size > 200000) {
      //   this.toastr.info("Maximum size of 2MB");
      //   return;
      // }

      this.imageChangedEvent = event;
      const fromData = new FormData();
      fromData.append('file', event.target.files[0]);
      this.loading = true;

      this.settingService.fileAvatar(fromData).subscribe(
        result => {
          this.loading = false;
          if (result) {
            this.isCroppedImg = true;
            this.fileAvatar = result;
          }
        },
        error => {
          this.loading = false;
          this.isCroppedImg = false;
        }
      );
    }
  }

  onInputClick(event: any) {
    event.target.value = '';
  }

  /**
   * image croped event
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }

  cropIt() {
    this.isCroppedImg = false;
    let cropImage = {};

    if (this.fileAvatar !== null && this.fileAvatar !== undefined) {
      this.fileAvatar.base64 = undefined;
      cropImage = {
        h: this.croppedImage.height,
        // id: this.currentCompanyId,
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

    this.loading = true;
    this.settingService
      .updateAvatar(this.selectedTechUser.id, cropImage)
      .subscribe(
        avatar => {
          if (avatar) {
            this.selectedTechUser
              ? (this.selectedTechUser.avatar = avatar)
              : null;
            this.loading = false;
            // this.edit = false;
            // this.getUsers();

            this.toastr.success('Image Cropped Successfully');
          }
        },
        error => {
          this.loading = false;
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
      const objTechUser = {
        avatar: this.cropAvatar || {},
        techRole: this.techUserForm.value.techRole
          ? this.techUserForm.value.techRole
          : this.techRoles[0],
        firstName: this.techUserForm.value.firstName,
        lastName: this.techUserForm.value.lastName,
        primaryEmail: this.techUserForm.value.primaryEmail,
        companyId: this.currentCompanyId,
        subscription: {}
      };
      this.loading = true;
      this.techUsersService.createUser(objTechUser).subscribe(
        (savedTechUsre: any) => {
          this.toastr.success('Saved Successfully');
          this.loading = false;
          this.create = false;
          this.getUsers();
          if (savedTechUsre && savedTechUsre.id) {
            this.saveUsersEmailNotifications(savedTechUsre.id);
          }
        },
        error => {
          this.create = false;
          this.loading = false;
          const er = error.error.validationResults;
          this.toastr.error(er.techRole || 'Bad Request');
        }
      );
    } else {
    }
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

    this.settingService.deleteAvatar(id).subscribe(
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
        // // this.settingService.updateProfile(profileUser).subscribe(
        // //   res => {
        // //     if (res) {
        // //       if (res) {
        // //         this.selectedTechUser.avatar = null;
        // //         // this.toastr.success("Profile updated successfully");
        // //         // this.imageSrc = "/ng2/assets/img/user.jpg";
        // //       }
        // //     }
        // //   },
        // //   error => {
        // //     this.toastr.error(error);
        // //   }
        // // );
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
        // this.croppedImage = this.cropAvatar.avatar.cropped;
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
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
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

    this.selectedTechUser.firstName = this.techUserForm.value.firstName;
    this.selectedTechUser.lastName = this.techUserForm.value.lastName;
    this.selectedTechUser.primaryEmail = this.techUserForm.value.primaryEmail;
    this.selectedTechUser.techRole = this.techUserForm.value.techRole;
    this.selectedTechUser.subscription = {};
    this.selectedTechUser.initials = [
      this.techUserForm.value.firstName,
      this.techUserForm.value.lastName
    ]
      .map(function(s) {
        return s.charAt(0).toUpperCase();
      })
      .join('');

    this.selectedTechUser.companyId = this.selectedTechUser.company
      ? this.selectedTechUser.company.id
      : null;

    this.loading = true;
    this.techUsersService
      .updateTechUsers(this.selectedTechUser.id, this.selectedTechUser)
      .subscribe(
        res => {
          // this.getUsers();
          this.toastr.success('Updated Successfully');
          this.techUserForm.reset();
          if (this.techUserIdList) {
            this.emailNotification(this.techUserIdList);
          }
          this.submitted = false;
          this.selectedTechUser = null;
          this.loading = false;
          this.edit = false;
        },
        error => {
          this.loading = false;
          this.edit = false;
          const er = error.error.validationResults;
          this.toastr.error(er.techRole || 'Bad Request');
        }
      );

    this.saveUsersEmailNotifications(this.selectedTechUser.id);
  }

  /**
   * saved tech user email notification based on id.
   * @param techUserId
   */

  saveUsersEmailNotifications(techUserId: string) {
    if (techUserId) {
      const notificationSetting = {
        newDevice: this.techUserForm.value.newDevice,
        // scheduleChanged: this.techUseremailNotificationList[techUserId]
        //   .scheduleChanged,
        ticketCloseNotifications: this.techUserForm.value
          .ticketCloseNotifications,
        ticketCreated: this.techUserForm.value.ticketCreated,
        myTicketUpdated: this.techUserForm.value.myTicketUpdated
      };
      this.techUsersService
        .saveUsersEmailNotifications(techUserId, notificationSetting)
        .pipe(map(() => {}))
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
  }

  // openModal(template) {
  //   this.modalRef = this.modalService.show(
  //     template,
  //     Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
  //   );
  // }

  // editTag(template2) {
  //   this.modalRef = this.modalService.show(
  //     template2,
  //     Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
  //   );
  // }
  onBackMenu() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('backMenu'); // remove the class
    body.classList.add('backMenu');
  }

  displayFrstLstChar(techUser: any) {
    if (techUser) {
      return [techUser.firstName, techUser.lastName]
        .map(function(s) {
          return s.charAt(0).toUpperCase();
        })
        .join('');
    }
  }
}
