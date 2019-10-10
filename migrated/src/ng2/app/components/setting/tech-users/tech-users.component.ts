import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subject, Observable, Observer } from "rxjs";

import { DataTableDirective } from "angular-datatables";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ToastrService } from "ngx-toastr";

import { TechUsersService } from "src/ng2/app/services/setting/tech-users.service";
import { SettingService } from "src/ng2/app/services/setting/setting.service";

declare var $;

@Component({
  selector: "app-tech-users",
  templateUrl: "./tech-users.component.html",
  styleUrls: ["./tech-users.component.scss"]
})
export class TechUsersComponent implements AfterViewInit, OnInit, OnDestroy {
  selectedIdx = -1;
  submitted = false;
  loading = false;
  create = false;
  edit = false;
  currentCompanyId = null;
  isEmailIdUnique = false;

  techUsers: [];

  techUserIdList: [];
  techRoles: any;
  selectedTechUser: any;
  techUseremailNotificationList: any;
  dtOptions = {};
  dtTrigger = new Subject();
  techUserForm: FormGroup;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  imageBase64 = "";
  imageChangedEvent: any;
  croppedImage: any;
  isCroppedImg = false;
  fileAvatar: any;

  constructor(
    private techUsersService: TechUsersService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private settingService: SettingService
  ) {
    const currentComapnyId = localStorage.getItem("currentComapnyId");
    if (currentComapnyId) {
      this.currentCompanyId = currentComapnyId;
    } else {
      this.currentCompany();
    }
  }

  ngOnInit() {
    this.techUsers = [];

    this.dtOptions = {
      pagingType: "full_numbers",

      searching: false,
      lengthChange: false
    };
    const emailPattern = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';

    this.techUserForm = this.formBuilder.group({
      firstName: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      ],
      lastName: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      ],
      primaryEmail: ["", Validators.compose( [Validators.required,Validators.pattern(emailPattern)])],
      techRole: [""],
      newDevice: [""],
      ticketCreated: [""],
      myTicketUpdated: [""],
      ticketCloseNotifications: [""],
      id: [""]
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
    this.techUsersService.getRoleNames().subscribe(
      roles => {
        if (roles) {
          this.techRoles = roles;
        }
      },
      error => {}
    );
  }

  /**
   * get tech users from usres.
   */
  getUsers() {
    this.loading = true;
    this.techUsersService
      .getUsers()
      .map((users: any) => {
        return users.filter(
          (user: any) =>
            user.accountType.toLowerCase() === "tech" && user.deletedAt === null
        );
      })
      .subscribe(
        (techUsers: any) => {
          this.loading = false;
          if (techUsers) {
            this.techUsers = techUsers;
            this.dtTrigger.next();
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
    this.techUsersService.getUsersEmailNotifications(techUserIdList).subscribe(
      eNotifications => {
        if (eNotifications) {
          this.techUseremailNotificationList = eNotifications;
        }
      },
      error => {
        console.log(error);
      }
    );
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
    this.techUsersService.changePasswordRequest(id).subscribe(
      res => {
        console.log(res);
        this.toastr.success("Change password request sent successfully.");
      },
      error => {
        this.toastr.error(`Error occurred , ${error}`);
      }
    );
  }

  /**
   * resend wel come email for varification user
   * @param userEmail
   */
  resendWelcomeEmail(userEmail: string) {
    this.techUsersService.verifyUserEmail(userEmail).subscribe(
      res => {
        this.toastr.success(`Resend Welcome Email sent successfully`);
      },
      error => {
        this.toastr.error(`Error occurred , ${error}`);
      }
    );
  }

  /**
   * opened creat tech user Model
   */
  creatTechUsr() {
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

  removeTechUser(techUser: any) {
    const id = techUser.id;
    if (techUser) {
      if (
        confirm(
          `Do you want to remove ${techUser.firstName} ${techUser.lastName}  ?`
        )
      ) {
        this.loading = true;
        this.techUsersService.archiveUser([techUser.id]).subscribe(
          archiveUser => {
            this.loading = false;
            // deleted techuser.
            if (this.techUsers.find((x: any) => x.id === techUser.id)) {
              this.techUsers.splice(
                this.techUsers.findIndex((x: any) => x.id === techUser.id),
                1
              );
            }

            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              // Destroy the table first
              dtInstance.destroy();
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
          },
          error => {
            this.loading = false;
          }
        );
      }
    }
  }

  /**
   * current comapny
   */
  currentCompany() {
    this.techUsersService.currentComapny().subscribe(
      (currentCompany: any) => {
        if (currentCompany) {
          localStorage.setItem("currentComapnyId", currentCompany.id);
          this.currentCompanyId = currentCompany.id;
        }
      },
      error => {}
    );
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
      fromData.append("file", event.target.files[0]);
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

  /**
   * image croped event
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }

  cropIt() {
    this.isCroppedImg = false;
    let cropImage = {};

    if (this.fileAvatar !== undefined) {
      this.fileAvatar.base64 = undefined;
      cropImage = {
        h: this.croppedImage.height,
        id: this.currentCompanyId,
        origin: this.fileAvatar,
        w: this.croppedImage.width,
        x: this.croppedImage.cropperPosition.x1,
        y: this.croppedImage.cropperPosition.y1,
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

    this.loading = true;
    this.settingService
      .updateAvatar(this.selectedTechUser.id, cropImage)
      .subscribe(
        avatar => {
          if (avatar) {
            const profileUser = {
              basic: {
                avatar: avatar,
                firstName: this.techUserForm.value.firstName,
                lastName: this.techUserForm.value.lastName,
                primaryEmail: this.techUserForm.value.primaryEmail
              }
            };

            // this.selectedTechUser.avatar = avatar;
            this.toastr.success("Image cropped successfully");
            this.settingService.updateProfile(profileUser).subscribe(
              res => {
                if (res) {
                  // this.getCompanyProfile();
                  // this.getCurrentCompany();
                }
              },
              error => {
                this.loading = false;
              }
            );
          }
        },
        error => {
          this.loading = false;
        }
      );
  }

  isEmailUnique(email) {
    if (!email) {
      return;
    }

    this.techUsersService.isEmailUnique(email, null, true).subscribe(
      (unique: any) => {
        this.isEmailIdUnique = unique.value;
      },
      error => {
        this.isEmailIdUnique = false;
      }
    );
  }

  /**
   * saved om create new tech users
   */
  onCreateSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.techUserForm.invalid) {
      return;
    }

    if (!this.techUserForm.get("primaryEmail").value) {
      this.isEmailIdUnique = false;
      return;
    }

    // this.techUsersService
    //   .isEmailUnique(this.techUserForm.value.primaryEmail, null, true)
    //   .subscribe(
    //     (unique: any) => {
    // this.isEmailIdUnique = unique.value;
    if (this.isEmailIdUnique) {
      const objTechUser = {
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
          this.loading = false;
          if (savedTechUsre && savedTechUsre.id) {
            this.saveUsersEmailNotifications(savedTechUsre.id);
          }
        },
        error => {
          this.loading = false;
        }
      );
    } else {
      // this.loading = false;
    }
    // },
    // error => {
    //   this.isEmailIdUnique = false;
    //   this.loading = false;
    // }
    // );
  }

  deleteAvatar() {
    if (!this.selectedTechUser || !this.selectedTechUser.avatar) {
      return;
    }
    this.settingService.deleteAvatar(this.selectedTechUser.id).subscribe(
      res => {
        this.toastr.success("Avatar deleted successfully");

        const profileUser = {
          basic: {
            avatar: null,
            firstName: this.techUserForm.value.firstName,
            lastName: this.techUserForm.value.lastName,
            primaryEmail: this.techUserForm.value.primaryEmail
          }
        };
        this.settingService.updateProfile(profileUser).subscribe(
          res => {
            if (res) {
              if (res) {
                this.selectedTechUser.avatar = null;
                // this.toastr.success("Profile updated successfully");
                // this.imageSrc = "/ng2/assets/img/user.jpg";
              }
            }
          },
          error => {
            this.toastr.error(error);
          }
        );
      },
      error => {
        this.toastr.error(error);
      }
    );
  }

  closeModel() {
    this.isCroppedImg = false;
  }

  rePositionAvatar() {
    if (this.selectedTechUser && this.selectedTechUser.avatar) {
      let imageUrl = `/file/${this.selectedTechUser.avatar.origin.id}.jpg`;
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.isCroppedImg = true;
        this.croppedImage = this.selectedTechUser.avatar.cropped;
        this.croppedImage.base64 = base64data;
        this.imageBase64 = base64data;
      });
    }
  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
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

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    const dataURL = canvas.toDataURL("image/png");
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
      .join("");

    this.selectedTechUser.companyId = this.selectedTechUser.company
      ? this.selectedTechUser.company.id
      : null;

    this.loading = true;
    this.techUsersService
      .updateTechUsers(this.selectedTechUser.id, this.selectedTechUser)
      .subscribe(
        res => {
          // this.getUsers();
          this.techUserForm.reset();
          if (this.techUserIdList) {
            this.emailNotification(this.techUserIdList);
          }
          this.submitted = false;
          this.loading = false;
          this.edit = false;
        },
        error => {
          this.loading = false;
          this.edit = false;
        }
      );

    this.saveUsersEmailNotifications(this.selectedTechUser.id);

    // alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.techUserForm.value));
  }

  /**
   * saved tech user email notification based on id.
   * @param techUserId
   */

  saveUsersEmailNotifications(techUserId: string) {
    if (techUserId) {
      var notificationSetting = {
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
        .subscribe(res => {}, error => {});
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
}
