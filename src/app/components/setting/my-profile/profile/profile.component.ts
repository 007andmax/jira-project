import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  NgZone,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { SettingService } from 'src/app/services/setting/setting.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable, Observer, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CrmCompanyJobTitle } from '../../crm-settings/crm-company-job-title/class/crm-company-job-title';
import { CrmStateService } from 'src/app/states/crm/crm-state.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

declare var google: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
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
  imageBase64 = '';
  imageSrc = '';
  public currentUser: any;
  public profileForm: FormGroup;
  idUploadFile: string;
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  selectedJobTitle: CrmCompanyJobTitle;
  jobTitleList: Array<CrmCompanyJobTitle> = [];
  @ViewChild('search')
  public searchElementRef: ElementRef;
  sub: Subscription = new Subscription();
  phoneTypes = [new TitleListType("Mobile", "MOBILE"),
  new TitleListType("Office", "OFFICE"),
  new TitleListType("Fax", "FAX")];
  secondaryPhoneType;
  primaryPhoneType;
  constructor(
    private formBuilder: FormBuilder,
    private settingService: SettingService,
    private userService: UsersService,
    private toastr: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private usersStateService: UsersStateService,
    private crmStateService: CrmStateService,
    private imageCropperStateService: ImageCropperStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private customerPortalStateService: CustomerPortalStateService,
    private companiesService: CompaniesService,
  ) {
  }


  ngOnInit() {
    this.imageSrc = '';
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
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
      jobTitleId: [
        (this.currentUser.jobTitle) ? this.currentUser.jobTitle.id : null
      ],
      primaryPhone: ['', [Validators.minLength(14)]],
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
    if (this.currentUser.jobTitle) this.selectedJobTitle = new CrmCompanyJobTitle(JSON.parse(JSON.stringify(this.currentUser.jobTitle)));
    if (!this.customerPortalStateService.isCustomerPortal) this.getAddressAutocomplete();
    this.jobTitleList = this.crmStateService.getJobTitleList();
    let onGetJobTitle = this.crmStateService.onGetJobTitle.subscribe(data => {
      this.jobTitleList = data;
    })
    this.sub.add(onGetJobTitle);
    this.onCroppImage();
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (data) {
        this.croppedImage = data.croppedImage;
        if (this.imageSrc != '') this.userService
          .removeAvatar(this.currentUser.id)
          .subscribe(res => {
            this.cropIt();
          })
        if (this.imageSrc == '') this.cropIt();
      } else {
        this.companiesService.removeAttachment(this.idUploadFile).subscribe(res => {
        });
      }
    })
    this.sub.add(getConfirm);
  }

  /**
   * convenience getter for easy access to form fields
   */
  get f() {
    return this.profileForm.controls;
  }
  onSelectRole(data) {
    this.profileForm.patchValue({
      jobTitleId: (data) ? data.id : null
    });
    this.selectedJobTitle = data;
  }

  onChangePrimaryPhone(event) {
    if (event.target.value.length >= 16) {
      this.profileForm.controls['primaryPhone'].updateValueAndValidity()
      this.profileForm.controls['primaryPhone'].setErrors(null);
    }
  }

  onChangeSecondaryPhone(event) {
    if (event.target.value.length == 2) {
      this.profileForm.controls['secondaryPhone'].clearValidators();
      this.profileForm.controls['secondaryPhone'].updateValueAndValidity()
      this.profileForm.controls['secondaryPhone'].setErrors(null);
    } else if (event.target.value.length > 2 && event.target.value.length >= 16) {
      this.profileForm.controls['secondaryPhone'].updateValueAndValidity()
      this.profileForm.controls['secondaryPhone'].setErrors(null);
    } else if (event.target.value.length > 2 && event.target.value.length < 16) {
      this.profileForm.controls['secondaryPhone'].setValidators([Validators.minLength(14)]);
      this.profileForm.controls['secondaryPhone'].updateValueAndValidity()
    }
  }
  onChangePrimaryPhoneType(data) {
    this.primaryPhoneType = data;
    this.profileForm.patchValue({
      primaryPhoneType: data.type,
    });
  }

  /**
   * auto complete address
   */
  getAddressAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address']
        }
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = (google.maps.places.PlaceResult = autocomplete.getPlace());
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
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
  private getCurrentUser(data) {
    this.currentUser = data;
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
    this.loading = true;
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
                if (phone.typeNumber) this.primaryPhoneType = this.phoneTypes.find(item => item.type == phone.typeNumber.toUpperCase());
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
                if (phone.typeNumber) this.secondaryPhoneType = this.phoneTypes.find(item => item.type == phone.typeNumber.toUpperCase());
              }
            });
            this.profileForm.controls['primaryPhone'].updateValueAndValidity()
            this.profileForm.controls['primaryPhone'].setErrors(null);
            this.profileForm.controls['secondaryPhone'].clearValidators();
            this.profileForm.controls['secondaryPhone'].updateValueAndValidity()
            this.profileForm.controls['secondaryPhone'].setErrors(null);
          }
        })
      )
      .subscribe(
        res => {
          this.loading = false;
        },
        error => {
          this.loading = false;
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
        }
      );
  }

  /**
   * select file
   * @param event
   */
  onSelectFile(event) {
    this.imageChangedEvent = event;
    if (event.target.files && event.target.files[0]) {
      const size = event.target.files[0].size;
      if (size > 4194304) {
        this.toastr.info('Maximum size of 4MB');
        return;
      }
      const fromData = new FormData();
      fromData.append('file', event.target.files[0]);
      this.settingService.fileAvatar(fromData).subscribe(
        (result: any) => {
          if (result) {
            this.imageOrigin = result;
            this.idUploadFile = result.id;
            this.modalImageCropperStateService.onInitOpen(new ImageCroper(result.base64, result.id));
            event.target.value = null;
          }
        },
        error => {
          event.target.value = null;
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
                jobTitleId: this.profileForm.value.jobTitleId,
                primaryEmail: this.profileForm.value.primaryEmail,
                secondaryEmail: null,
                signature: this.userProfile.signature
              }
            };
            this.settingService.updateProfile(profileUser).subscribe(
              (res: any) => {
                if (res) {
                  this.imageSrc = `/users/${res.id}/image.jpg?t=${this.imageAvatar.updatedAt}`;
                }
              },
              error => {
              }
            );
          }
        })
      )
      .subscribe(
        res => {
        },
        error => {
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

  onChangeSecondaryPhoneType(data) {
    this.secondaryPhoneType = data;
    this.profileForm.patchValue({
      secondaryPhoneType: data.type,
    });
  }


  /**
   * re position avatar
   */
  rePositionAvatar() {
    if (this.imageAvatar && this.imageAvatar.origin.base64 === undefined) {
      const imageUrl = `/file/${this.imageAvatar.origin.id}.jpg`;
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.isCroppedImg = true;
        this.croppedImage = this.imageAvatar;
        this.croppedImage.base64 = base64data;
        this.imageBase64 = base64data;
      });
    }
  }

  /**
   * delete avatar
   */
  deleteAvatar() {
    this.userService
      .removeAvatar(this.currentUser.id)
      .pipe(
        map(res => {
          this.toastr.success('Avatar deleted successfully');
          const profileUser = {
            basic: {
              avatar: null,
              firstName: this.profileForm.value.userName,
              lastName: this.profileForm.value.lastName,
              jobTitleId: this.profileForm.value.jobTitleId,
              primaryEmail: this.profileForm.value.primaryEmail,
              secondaryEmail: null,
              signature: this.userProfile.signature
            }
          };
          this.settingService.updateProfile(profileUser).subscribe(
            res => {
              if (res) {
                this.imageSrc = '';
              }
            },
            error => {
              this.toastr.error('Error ');
            }
          );
        })
      )
      .subscribe(
        res => {
        },
        error => {
          this.toastr.error(error);
        }
      );
  }

  /**
   * get base64 image from url
   * @param url
   */
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
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
  public onSubmit() {
    this.submitted = true;
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
        phone.number = this.profileForm.value.primaryPhone;
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
        jobTitleId: this.profileForm.value.jobTitleId,
        primaryEmail: this.profileForm.value.primaryEmail,
        signature: this.userProfile.signature,
        secondaryEmail: this.profileForm.value.secondaryEmail
      },
      contact: {
        ...this.userProfile.address,
        ...this.userProfile.timeZone
      }
    };
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
        },
        error => {
          this.toastr.error('Bad Request');
        }
      );
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
