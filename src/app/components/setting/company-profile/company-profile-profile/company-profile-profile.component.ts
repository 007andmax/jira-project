import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TimeZone } from 'src/app/components/companies/company-time-zone/class/time-zone';
import { CompanyTimeZoneStateService } from 'src/app/components/companies/company-time-zone/services/company-time-zone-state.service';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { SettingService } from 'src/app/services/setting/setting.service';
import { CompaniesRealTimeService } from 'src/app/states/company/companies-real-time.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';

declare var google: any;
declare var $: any;
@Component({
  selector: 'app-company-profile-profile',
  templateUrl: './company-profile-profile.component.html',
  styleUrls: ['./company-profile-profile.component.scss']
})
export class CompanyProfileProfileComponent implements OnInit, OnDestroy {
  public loading = true;
  cProfileForm: FormGroup;
  submitted = false;
  isCompanyNameUnique = true;
  imageSrc = '';
  phoneTypes = [new TitleListType("Mobile", "MOBILE"),
  new TitleListType("Office", "OFFICE"),
  new TitleListType("Fax", "FAX")];
  primaryPhoneType;
  isAddPhone = false;
  secondaryPhoneType;
  cProfile = {
    address: [],
    logo: {},
    name: '',
    timeSettings: { workingDays: [], outliersSeconds: 0 },
    supportMailBox: ''
  };
  public latitude: number;
  public longitude: number;
  primaryPhone: string = '';
  countryCode = '';
  country = '';
  longCity = '';
  shortCity = '';
  longState = '';
  shortState = '';
  public currentCompany: any;
  croppedImage: any;
  idUploadFile: string;
  isCroppedImg = false;
  fileAvatar: any;
  timezones: Array<TimeZone> = [];
  fromGoogle = false;
  @Output() onGetCurrentCompany: EventEmitter<any> = new EventEmitter();
  @ViewChild('search') searchElementRef: ElementRef;
  secondaryPhone: string = '';
  sub: Subscription = new Subscription();
  constructor(private companyProfileService: CompanyProfileService,
    private toaster: ToastrService,
    private settingService: SettingService,
    private mapsAPILoader: MapsAPILoader,
    private companiesStateService: CompaniesStateService,
    private imageCropperStateService: ImageCropperStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private companiesService: CompaniesService,
    private companyTimeZoneState: CompanyTimeZoneStateService,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.cProfile = {
      address: [],
      logo: {},
      name: '',
      timeSettings: { workingDays: [], outliersSeconds: 0 },
      supportMailBox: ''
    };
    this.createCProfileForm();
    if (this.companiesStateService.getCurrentCompany()) this.getCurrentCompany(this.companiesStateService.getCurrentCompany());
    this.companiesStateService.onCurrentCompany.subscribe(res => {
      this.getCurrentCompany(res);
    })
    if (this.companyTimeZoneState.getTimeZone().length > 0) {
      this.timezones = this.companyTimeZoneState.getTimeZone().map(item => new TimeZone(item));;
      this.onGetCurrentCompany.emit(null);
    }
    if (this.companyTimeZoneState.getTimeZone().length == 0) this.companyTimeZoneState.onGetTimeZone();
    let onTimeZone = this.companyTimeZoneState.onTimeZone.subscribe(data => {
      this.timezones = this.companyTimeZoneState.getTimeZone().map(item => new TimeZone(item));;
      this.onGetCurrentCompany.emit(null);
    })
    this.sub.add(onTimeZone);
    this.getAddressAutocomplete();
    this.onCroppImage();

  }
  private getCurrentCompany(res) {
    this.currentCompany = res;
    if (
      this.currentCompany &&
      this.currentCompany.logo &&
      this.currentCompany.logo.cropped
    ) {
      this.imageSrc = `/file/${this.currentCompany.logo.cropped.id}.jpg?t=${this.currentCompany.logo.updatedAt}`;
    } else {
      this.imageSrc = '';
    }
    if (this.currentCompany.addresses.length > 0) {
      const timeZone = this.currentCompany.addresses[0].timeZone;
      if (timeZone) {
        this.cProfileForm.patchValue({
          timeZone: timeZone.name
        });
      }
    }
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (data) {
        this.croppedImage = data.croppedImage;
        if (this.imageSrc != '') this.companyProfileService
          .removeAvatar(this.currentCompany.id)
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
  * crop it image
  */
  cropIt() {
    this.isCroppedImg = false;
    let cropImage = {};
    if (this.fileAvatar !== undefined) {
      this.fileAvatar.base64 = undefined;
      cropImage = {
        h: this.croppedImage.height,
        id: this.currentCompany.id,
        origin: this.fileAvatar,
        w: this.croppedImage.width,
        x: this.croppedImage.cropperPosition.x1,
        y: this.croppedImage.cropperPosition.y1,
        base64: this.croppedImage.base64
      };
    } else {
      cropImage = {
        id: this.currentCompany.id,
        origin: this.currentCompany.logo.origin,
        cropped: this.currentCompany.logo.cropped,
        x: this.croppedImage.cropperPosition.x1,
        y: this.croppedImage.cropperPosition.y1,
        w: this.croppedImage.width,
        h: this.croppedImage.height,
        updatedAt: this.currentCompany.logo.updatedAt,
        base64: this.croppedImage.base64
      };
    }
    this.companyProfileService
      .logo(this.currentCompany.id, cropImage)
      .subscribe(
        avatar => {
          if (avatar) {
            this.cProfile.logo = avatar;
            this.toaster.success('Image Cropped Successfully');
            this.companyProfileService.basic(this.cProfile).subscribe(
              res => {
                if (res) {
                  this.onGetCurrentCompany.emit(null);
                }
              },
              error => {
              }
            );
          }
        },
        error => {
        }
      );
  }
  /**
   * get groupp locals
   */
  getGroupedLocales() {
    return new Promise((resolve, reject) => {
      this.companyProfileService.getGroupedLocales().subscribe(
        (res: any) => {
          if (res) {
            this.timezones = res.map(item => new TimeZone(item));;
            resolve(true);
          }
        },
        error => {
          resolve(true);
        }
      );
    });
  }
  createCProfileForm() {
    this.cProfileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      url: new FormControl(''),
      timeZone: new FormControl(''),
      primaryId: new FormControl(''),
      primaryPhone: new FormControl('', [Validators.minLength(14)]),
      primaryPhoneType: new FormControl(''),
      secondaryPhone: new FormControl(''),
      secondaryPhoneType: new FormControl(''),
      suiteNumber: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl(''),
      locale: new FormControl('', Validators.required),
      secondaryId: new FormControl(''),
    });
  }
  /**
    *  file selected on upload.
    */
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const size = event.target.files[0].size;
      if (size > 4194304) {
        this.toaster.info('Maximum size of 4MB');
        return;
      }
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
          event.target.value = null;
        }
      );
    }
  }
  /**
   * get company profile
   */
  getCompanyProfile(res) {
    this.loading = false;
    if (res) {
      this.cProfile.address = res.addresses;
      if (this.cProfile.address.length > 0) {
        if (res.addresses.length > 0 && res.addresses[0].timeZone) {
          let find = this.timezones.find(item => item.second === res.addresses[0].timeZone.name);
          if (find) this.cProfile.address[0].timeZone = new TimeZone(find);
        }
        this.cProfileForm.patchValue({
          locale: res.addresses[0].timeZone.second
        });
      }
      if (this.cProfile.address.length === 0) this.cProfile.address = [{
        timeZone: new TimeZone({
          first: "",
          second: "",
        })
      }]
      this.cProfile.logo = res.logo;
      this.cProfile.name = res.name;
      this.cProfile.timeSettings = res.responseTimeSettings;
      // this.companyTimeZoneState.onEditMode(this.cProfile.address[0].timeZone);
      this.cProfile.supportMailBox = res.supportMailBox;
      this.cProfileForm.patchValue({
        name: res.name,
        url: res.techDomain,
        suiteNumber: res.addresses.length === 0 ? '' : res.addresses[0].suiteNumber,
        address: res.addresses.length === 0 ? '' : res.addresses[0].address,
        postalCode: res.addresses.length === 0 ? '' : res.addresses[0].postalCode
      });
      this.country = res.addresses.length > 0 ? res.addresses[0].country : '';
      this.countryCode = res.addresses.length > 0 ? res.addresses[0].countryCode : '';
      this.longCity = res.addresses.length > 0 ? res.addresses[0].longCity : '';
      this.shortCity = res.addresses.length > 0 ? res.addresses[0].shortCity : '';
      this.longState = res.addresses.length > 0 ? res.addresses[0].longState : '';
      this.shortState = res.addresses.length > 0 ? res.addresses[0].shortState : '';
      for (let i = 0; i < this.cProfile.address.length; i++) {
        const phoneNumbers = this.cProfile.address[i].phoneNumbers,
          firstPhone = (phoneNumbers) ? phoneNumbers[0] : null,
          lastPhone =
            phoneNumbers && phoneNumbers.length > 1
              ? phoneNumbers[phoneNumbers.length - 1]
              : '';
        if (firstPhone) {
          this.cProfileForm.patchValue({
            primaryId: firstPhone.id,
            primaryPhone: firstPhone.number,
            primaryPhoneType: firstPhone.typeNumber
              ? firstPhone.typeNumber.toUpperCase()
              : ''
          });
          if (firstPhone.typeNumber) this.primaryPhoneType = this.phoneTypes.find(item => item.type == firstPhone.typeNumber.toUpperCase());
          this.primaryPhone = firstPhone.number;
        }
        if (lastPhone) {
          this.isAddPhone = true;
          this.cProfileForm.patchValue({
            secondaryId: lastPhone.id,
            secondaryPhone: lastPhone.number,
            secondaryPhoneType: lastPhone.typeNumber
              ? lastPhone.typeNumber.toUpperCase()
              : ''
          });
          if (lastPhone.typeNumber) this.secondaryPhoneType = this.phoneTypes.find(item => item.type == lastPhone.typeNumber.toUpperCase());
          this.secondaryPhone = lastPhone.number;
          this.cProfileForm.controls['secondaryPhone'].setValidators([Validators.minLength(14)]);
        }
      }
      this.cProfileForm.controls['primaryPhone'].updateValueAndValidity()
      this.cProfileForm.controls['primaryPhone'].setErrors(null);
      this.cProfileForm.controls['secondaryPhone'].updateValueAndValidity()
      this.cProfileForm.controls['secondaryPhone'].setErrors(null);
    }
  }
  /**
  * delete avatar
  */
  deleteAvatar() {
    this.companyProfileService
      .removeAvatar(this.currentCompany.id)
      .subscribe(
        res => {
          this.toaster.success('Avatar Deleted Successfully', null, {
            timeOut: 3000
          });
          this.imageSrc = '';
          this.onGetCurrentCompany.emit(null);
          this.basic();
        },
        error => {
        }
      );
  }
  basic() {
    this.companyProfileService
      .basic({
        description: null,
        logo: null,
        name: this.cProfile.name
      })
      .subscribe(
        res => { },
        error => { }
      );
  }
  onChangePrimaryPhoneType(data) {
    this.primaryPhoneType = data;
    this.cProfileForm.patchValue({
      primaryPhoneType: data.type,
    });
  }
  onChangePrimaryPhone(event) {
    if (event.target.value.length >= 16) {
      this.cProfileForm.controls['primaryPhone'].updateValueAndValidity()
      this.cProfileForm.controls['primaryPhone'].setErrors(null);
    }
  }
  onAddPhone() {
    this.isAddPhone = !this.isAddPhone;
    if (this.isAddPhone) {
      this.cProfileForm.patchValue({
        secondaryPhoneType: 'OFFICE'
      });
    } else {
      this.cProfileForm.patchValue({
        secondaryPhone: '',
        secondaryPhoneType: '',
        secondaryId: ''
      });
    }
  }
  public onChangeTimeZone(data) {
    this.cProfileForm.patchValue({
      timeZone: data,
      locale: (data) ? data.second : ''
    });
  }
  onChangeSecondaryPhoneType(data) {
    this.secondaryPhoneType = data;
    this.cProfileForm.patchValue({
      secondaryPhoneType: data.type,
    });
  }
  onChangeSecondaryPhone(event) {
    if (event.target.value.length == 2) {
      this.cProfileForm.controls['secondaryPhone'].clearValidators();
      this.cProfileForm.controls['secondaryPhone'].updateValueAndValidity()
      this.cProfileForm.controls['secondaryPhone'].setErrors(null);
    } else if (event.target.value.length > 2 && event.target.value.length >= 16) {
      this.cProfileForm.controls['secondaryPhone'].updateValueAndValidity()
      this.cProfileForm.controls['secondaryPhone'].setErrors(null);
    } else if (event.target.value.length > 2 && event.target.value.length < 16) {
      this.cProfileForm.controls['secondaryPhone'].setValidators([Validators.minLength(14)]);
      this.cProfileForm.controls['secondaryPhone'].updateValueAndValidity()
    }
  }
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
          this.fromGoogle = true;
          this.cProfileForm.patchValue({
            postalCode: ''
          });
          for (let i = 0, len = place.address_components.length; i < len; i++) {
            if (
              place.address_components[i].types.indexOf('postal_code') !== -1
            ) {
              this.cProfileForm.patchValue({
                postalCode: place.address_components[i].short_name
              });
            }
            if (place.address_components[i].types.indexOf('country') !== -1) {
              this.country = place.address_components[i].long_name;
              this.countryCode = place.address_components[i].short_name;
            }
            if (place.address_components[i].types.indexOf('locality') !== -1) {
              this.longCity = place.address_components[i].long_name;
              this.shortCity = place.address_components[i].short_name;
            }
            if (place.address_components[i].types.indexOf('administrative_area_level_1') !== -1) {
              this.longState = place.address_components[i].long_name;
              this.shortState = place.address_components[i].short_name;
            }
          }
        });
      });
    });
  }
  get f() {
    return this.cProfileForm.controls;
  }
  submitCompanyProfile() {
    console.log("submitCompanyProfile");
    this.submitted = true;
    console.log("this.cProfileForm", this.cProfileForm);
    if (this.cProfileForm.invalid) {
      return;
    }
    let data = {};
    data['id'] = this.currentCompany.addresses.length > 0 ? this.currentCompany.addresses[0].id : '';
    data['isPrimary'] = true;
    data['suiteNumber'] = this.cProfileForm.get('suiteNumber').value;
    data['locale'] = this.cProfileForm.get('locale').value;
    let dis = this.cProfile.address.length > 0 ? this.cProfile.address[0].timeZone == null ? '' : this.cProfile.address[0].timeZone.displayName : '';
    data['timeZone'] = {
      name: this.cProfileForm.get(
        'timeZone'
      ).value == undefined ? '' : (this.cProfileForm.get(
        'timeZone'
      ).value.city || (this.cProfile.address.length > 0 ? (this.cProfile.address[0].timeZone == null ? '' : this.cProfile.address[0].timeZone.name) : '')),
      displayName: this.cProfileForm.get(
        'timeZone'
      ).value == undefined ? '' : '' || dis,
      timeOffset: this.cProfileForm.get(
        'timeZone'
      ).value == undefined ? '' : (this.cProfileForm.get(
        'timeZone'
      ).value.offset || (this.cProfile.address.length > 0 ? (this.cProfile.address[0].timeZone == null ? '' : this.cProfile.address[0].timeZone.timeOffset) : ''))
    };
    data['address'] = this.searchElementRef.nativeElement.value;
    data['postalCode'] = this.cProfileForm.get(
      'postalCode'
    ).value;
    data['country'] = this.country;
    data['countryCode'] = this.countryCode;
    data['locationLat'] = this.latitude;
    data['locationLng'] = this.longitude;
    data['longCity'] = this.longCity;
    data['shortCity'] = this.shortCity;
    data['longState'] = this.longState;
    data['shortState'] = this.shortState;
    data['addressWithSuitNumberAndPostalCode'] = this.cProfile.address.length > 0 ? this.cProfile.address[0].addressWithSuitNumberAndPostalCode : '';
    data['fromGoogle'] = this.fromGoogle;
    const phones = [];
    if (this.cProfileForm.value.primaryPhone) {
      phones.push({
        number: this.cProfileForm.get(
          'primaryPhone'
        ).value,
        typeNumber: this.cProfileForm.get(
          'primaryPhoneType'
        ).value,
        id: this.cProfileForm.get(
          'primaryId'
        ).value,
        priority: 0
      });
    }
    if (this.cProfileForm.value.secondaryPhoneType) {
      phones.push({
        number: this.cProfileForm.get(
          'secondaryPhone'
        ).value,
        typeNumber: this.cProfileForm.get(
          'secondaryPhoneType'
        ).value,
        id: this.cProfileForm.get(
          'secondaryId'
        ).value || ''
      });
    }
    data['phoneNumbers'] = phones;
    if (this.cProfile.name !== this.cProfileForm.get('name').value) {
      this.companyProfileService
        .isCompanyNameUnique(
          this.cProfile.address[0].id,
          this.cProfileForm.get('name').value
        )
        .subscribe(
          (res: any) => {
            this.isCompanyNameUnique = res.value;
            // true, unique companyname
            if (res && res.value) {
              const basic = {
                description: null,
                logo: this.cProfile.logo,
                name: this.cProfileForm.get('name').value
              };
              this.companyProfileService.basic(basic).subscribe(
                res => {
                  this.toaster.success('Records saved successfully');
                  this.companiesStateService.onInitGetCurrentCompany();
                },
                error => {
                  this.toaster.error('Bad Request');
                }
              );
            } else {
            }
          },
          error => {
          }
        );
    } else {
      const address = { addresses: [data] };
      this.companyProfileService.addresses(address).subscribe(
        res => {
          if (res) {
          }
        },
        error => {
        }
      );
    }
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
