import {
  Component,
  OnInit,
  TemplateRef,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { SettingService } from 'src/ng2/app/services/setting/setting.service';
import { UsersService } from 'src/ng2/app/services/users/users.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Observer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';

// import { ToastrService } from 'ngx-toastr';

declare var google: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = false;
  submitted = false;
  uniqueEmail = true;
  isAddPhone = false;
  isCroppedImg = false;
  croppedImage: any = '';
  imageChangedEvent: any;
  imageOrigin: any;
  imageAvatar: any;
  userProfile: any;
  userProfileAddr: any;
  modalRef: BsModalRef;
  imageBase64 = '';
  imageSrc = '';
  public suffix = '';
  public currentUser: any;
  public profileForm: FormGroup;

  // addres google map
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private settingService: SettingService,
    private userService: UsersService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.getCurrentUser();
    this.getUserProfile();
  }

  ngOnInit() {
    this.imageSrc = '';
    this.getCurrentUser();
    this.getUserProfile();

    /**
     * init form validation and declaration
     */
    const emailPattern =
      '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,63}';
    this.profileForm = this.formBuilder.group({
      userName: [
        this.currentUser.firstName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      ],
      firstName: [
        this.currentUser.firstName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      ],
      lastName: [
        this.currentUser.lastName,
        [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      ],
      // firstName: [this.currentUser.firstName],
      primaryEmail: [
        this.currentUser.primaryEmail,
        [Validators.required, Validators.pattern(emailPattern)]
      ],
      secondaryEmail: [this.currentUser.secondaryEmail],
      designation: [
        this.currentUser.designation,
        [Validators.minLength(3), Validators.maxLength(15)]
      ],
      primaryPhone: [''],
      primaryPhoneType: ['MOBILE'],
      primaryId: [],
      secondaryPhone: [''],
      secondaryPhoneType: [],
      secondaryId: [],
      suiteNumber: [],
      mailingAddress: [],
      postalCode: [],
      aboutMe: [''],
      image: ['']
    });

    this.getAddressAutocomplete();
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.profileForm.controls;
  }

  /**
   * auto complete address
   */
  getAddressAutocomplete() {
    // load address Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address']
        }
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place = (google.maps.places.PlaceResult = autocomplete.getPlace());

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.profileForm.patchValue({
            postalCode: ''
          });

          for (let i = 0, len = place.address_components.length; i < len; i++) {
            if (
              place.address_components[i].types.indexOf('postal_code') !== -1
            ) {
              this.profileForm.patchValue({
                postalCode: place.address_components[i].short_name
              });
            }
          }

          this.zoom = 12;
        });
      });
    });
  }

  /**
   * getCurrentUser
   */
  private getCurrentUser() {
    this.currentUser = this.userService.currentUser;
    if (this.currentUser && this.currentUser.avatar) {
      this.imageSrc = `/users/${this.currentUser.id}/image.jpg?t=${this.currentUser.avatar.updatedAt}`;
      this.imageAvatar = this.currentUser.avatar;
    } else {
      this.imageAvatar = null;
    }
  }

  /**
   * get user profile details
   */
  private getUserProfile() {
    this.loading = true;$(".loading").css("display", "block");
    this.settingService
      .getUserProfile()
      .pipe(
        map((userProfile: any) => {
          if (userProfile) {
            this.userProfile = userProfile;
            this.userProfileAddr = userProfile.address;

            this.profileForm.patchValue({
              suiteNumber: this.userProfileAddr
                ? this.userProfileAddr.suiteNumber
                : '',
              mailingAddress: this.userProfileAddr
                ? this.userProfileAddr.address
                : '',
              postalCode: this.userProfileAddr
                ? this.userProfileAddr.postalCode
                : '',
              aboutMe:
                userProfile.signature && userProfile.signature.content
                  ? userProfile.signature.content
                  : ''
            });

            this.userProfileAddr.phoneNumbers.forEach(phone => {
              if (phone && phone.priority === 0) {
                this.profileForm.patchValue({
                  primaryId: phone.id,
                  primaryPhone: phone.number,
                  primaryPhoneType: phone.typeNumber
                    ? phone.typeNumber.toUpperCase()
                    : ''
                });
              }

              if (phone && phone.priority === 1) {
                this.isAddPhone = true;
                this.profileForm.patchValue({
                  secondaryId: phone.id,
                  secondaryPhone: phone.number,
                  secondaryPhoneType: phone.typeNumber
                    ? phone.typeNumber.toUpperCase()
                    : ''
                });
              }
            });
          }
        })
      )
      .subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }

  /**
   * check user email is unique
   */
  isEmailUnique() {
    if (!this.profileForm.get('primaryEmail').value) {
      this.uniqueEmail = true;
      return;
    }

    this.settingService
      .isEmailUnique(
        this.profileForm.get('primaryEmail').value,
        this.currentUser.id,
        false
      )
      .subscribe(
        (res: any) => {
          this.uniqueEmail = res.value;
        },
        error => {
          console.log(error);
        }
      );
  }

  phonehandle(event) {
    const valid = this.f.primaryPhone.valid;
    console.log(event);

    if (valid === true && event.keyCode === 32) {
      this.suffix = ',1234';
    } else if (valid === true && event.keyCode === 8) {
      this.suffix = '';
      const value: string = this.f.primaryPhone.value;
      this.profileForm.patchValue({
        primaryPhone: value.slice(0, 9)
      });
    } else {
      this.suffix = '';
    }
  }

  /**
   * select file
   * @param event
   */
  onSelectFile(event) {
    this.imageChangedEvent = event;
    this.isCroppedImg = true;

    if (event.target.files && event.target.files[0]) {
      const fromData = new FormData();
      fromData.append('file', event.target.files[0]);

      this.settingService.fileAvatar(fromData).subscribe(
        result => {
          if (result) {
            this.imageOrigin = result;
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  /**
   * image cropped
   * @param event
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }

  /**
   * cropped it
   */
  cropIt() {
    this.isCroppedImg = false;
    // let cropImage = { id: '', origin: null, cropped: null, x: '', y: '', w: '', h: '', base64: '', updatedAt: '' };
    let cropImage = {};
    if (this.imageOrigin !== undefined) {
      this.imageOrigin.base64 = undefined;

      cropImage = {
        id: this.currentUser.id,
        origin: this.imageOrigin,
        x: this.croppedImage.cropperPosition.x1,
        y: this.croppedImage.cropperPosition.y1,
        w: this.croppedImage.width,
        h: this.croppedImage.height,
        base64: this.croppedImage.base64
      };
    } else {
      cropImage = {
        id: this.currentUser.id,
        origin: this.imageAvatar ? this.imageAvatar.origin : null,
        cropped: this.imageAvatar ? this.imageAvatar.cropped : null,
        x: this.croppedImage.cropperPosition.x1,
        y: this.croppedImage.cropperPosition.y1,
        w: this.croppedImage.width,
        h: this.croppedImage.height,
        updatedAt: this.imageAvatar ? this.imageAvatar.updatedAt : null,
        base64: this.croppedImage.base64
      };
    }
    this.loading = true;$(".loading").css("display", "block");
    this.settingService
      .updateAvatar(this.currentUser.id, cropImage)
      .pipe(
        map(updateAvatar => {
          this.imageAvatar = updateAvatar;

          if (updateAvatar) {
            const profileUser = {
              basic: {
                avatar: updateAvatar,
                firstName: this.profileForm.value.userName,
                lastName: this.profileForm.value.lastName,
                designation: this.profileForm.value.designation,
                primaryEmail: this.profileForm.value.primaryEmail,
                secondaryEmail: null,
                signature: this.userProfile.signature
              }
            };
            this.settingService.updateProfile(profileUser).subscribe(
              (res: any) => {
                this.loading = false;$(".loading").css("display", "none");
                if (res) {
                  this.imageSrc = `/users/${res.id}/image.jpg?t=${this.imageAvatar.updatedAt}`;
                }
              },
              error => {
                this.loading = false;$(".loading").css("display", "none");
                console.log(error);
              }
            );
          }
        })
      )
      .subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }

  /**
   * add secondary phone
   */
  onAddPhone() {
    this.isAddPhone = !this.isAddPhone;
    if (this.isAddPhone) {
      this.profileForm.patchValue({
        secondaryPhoneType: 'OFFICE'
      });
    } else {
      this.profileForm.patchValue({
        secondaryPhone: '',
        secondaryPhoneType: '',
        secondaryId: ''
      });
    }
  }

  /**
   * re position avatar
   */
  rePositionAvatar() {
    if (this.imageAvatar && this.imageAvatar.origin.base64 === undefined) {
      const imageUrl = `/file/${this.imageAvatar.origin.id}.jpg`;
      this.loading = true;$(".loading").css("display", "block");
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.loading = false;$(".loading").css("display", "none");
        this.isCroppedImg = true;
        this.croppedImage = this.imageAvatar;
        this.croppedImage.base64 = base64data;
        this.imageBase64 = base64data;
        // this is the image as dataUrl
        // this.base64Image = 'data:image/jpg;base64,' + base64data;
      });
    }
  }

  /**
   * delete avatar
   */
  deleteAvatar() {
    this.loading = true;$(".loading").css("display", "block");
    this.settingService
      .deleteAvatar(this.currentUser.id)
      .pipe(
        map(res => {
          this.loading = false;$(".loading").css("display", "none");
          this.toastr.success('Avatar deleted successfully');
          const profileUser = {
            basic: {
              avatar: null,
              firstName: this.profileForm.value.userName,
              lastName: this.profileForm.value.lastName,
              designation: this.profileForm.value.designation,
              primaryEmail: this.profileForm.value.primaryEmail,
              secondaryEmail: null,
              signature: this.userProfile.signature
            }
          };
          this.loading = true;$(".loading").css("display", "block");
          this.settingService.updateProfile(profileUser).subscribe(
            res => {
              this.loading = false;$(".loading").css("display", "none");
              if (res) {
                this.getCurrentUser();
                this.imageSrc = '';
              }
            },
            error => {
              this.loading = false;$(".loading").css("display", "none");
              this.toastr.error('Error ');
            }
          );
        })
      )
      .subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
        },
        error => {
          this.toastr.error(error);
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }

  /**
   * get base64 image from url
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
   * get base64 image
   * @param img
   */
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    let dataURL = canvas.toDataURL('image/png');
    return dataURL;
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  /**
   * submit Form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    if (this.userProfile && this.userProfile.signature) {
      this.userProfile.signature.content = this.profileForm.value.aboutMe;
    }

    if (this.userProfile && this.userProfile.address) {
      (this.userProfile.address.suiteNumber = this.profileForm.value.suiteNumber),
        (this.userProfile.address.address = this.searchElementRef.nativeElement
          .value
          ? this.searchElementRef.nativeElement.value
          : this.profileForm.value.mailingAddress),
        (this.userProfile.address.aboutMe = this.profileForm.value.aboutMe),
        (this.userProfile.address.postalCode = this.profileForm.value.postalCode);

      const phoneNumbers = [];

      if (this.profileForm.value.primaryPhone) {
        const phone = { number: '', typeNumber: '', priority: 0, id: '' };
        phone.number = this.profileForm.value.primaryPhone + this.suffix;
        phone.typeNumber = this.profileForm.value.primaryPhoneType;
        phone.id = this.profileForm.value.primaryId;
        (phone.priority = 0), phoneNumbers.push(phone);
      }

      if (this.profileForm.value.secondaryPhone) {
        const phone = { number: '', typeNumber: '', priority: 0, id: '' };
        phone.number = this.profileForm.value.secondaryPhone;
        phone.typeNumber = this.profileForm.value.secondaryPhoneType;
        phone.id = this.profileForm.value.secondaryId || '';
        phoneNumbers.push(phone);
      }
      this.userProfile.address.phoneNumbers = phoneNumbers;
    }

    const profileUser = {
      basic: {
        avatar: this.currentUser.avatar,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        designation: this.profileForm.value.designation,
        primaryEmail: this.profileForm.value.primaryEmail,
        signature: this.userProfile.signature,
        secondaryEmail: this.profileForm.value.secondaryEmail
      },
      contact: {
        ...this.userProfile.address,
        ...this.userProfile.timeZone
      }
    };

    this.loading = true;$(".loading").css("display", "block");
    this.settingService
      .updateProfile(profileUser)
      .pipe(
        map(res => {
          if (res) {
            this.toastr.success('Profile Updated Successfully');
          }
        })
      )
      .subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
        },
        error => {
          this.toastr.error('Bad Request');
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }
}
