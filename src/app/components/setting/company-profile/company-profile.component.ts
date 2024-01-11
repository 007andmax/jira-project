import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewContainerRef
} from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { CompanyProfileService } from 'src/app/services/setting/company-profile.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SettingService } from 'src/app/services/setting/setting.service';
import { MapsAPILoader } from '@agm/core';
import { TimeZone } from '../../companies/company-time-zone/class/time-zone';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ModalImageCropperStateService } from 'src/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from 'src/app/services/modal/modal-image-cropper/class/image-croper';
import { ImageCropperStateService } from 'src/app/states/image-cropper/image-cropper-state.service';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { WORK_HOURS } from 'src/app/const/time';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';

declare var google: any;
declare var $: any;
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  tabSet: string = "tab1";
  cProfileForm: FormGroup;
  accForm: FormGroup;
  workingHoursForm: FormGroup;
  submitted = false;
  isAddPhone = false;
  isCompanyNameUnique = true;
  url: '';
  imageSrc = '';
  constants: any;
  timezones: any;
  croppedImage: any;
  imageChangedEvent: any;
  isCroppedImg = false;
  fileAvatar: any;
  imageBase64 = '';
  fromGoogle = false;
  public loading = true;
  public currentCompany: any;
  cProfile = {
    address: [],
    logo: {},
    name: '',
    timeSettings: { workingDays: [], outliersSeconds: 0 },
    supportMailBox: ''
  };
  primaryPhone: string = '';
  secondaryPhone: string = '';
  weekDays = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
  ];
  defaultWorkingDay = {
    dayOfWeek: 'MONDAY',
    startTime: 28800,
    endTime: 61200,
    isSelected: false
  };
  config = {
    displayKey: 'first',
    limitTo: 3,
    search: true,
    searchOnKey: 'first'
  };
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  countryCode = '';
  country = '';
  longCity = '';
  shortCity = '';
  longState = '';
  shortState = '';
  @ViewChild('search', { static: true })
  public searchElementRef: ElementRef;
  sub: Subscription = new Subscription();
  phone: string;
  idUploadFile: string;
  phoneTypes = [new TitleListType("Mobile", "MOBILE"),
  new TitleListType("Office", "OFFICE"),
  new TitleListType("Fax", "FAX")];
  workHours = WORK_HOURS;
  secondaryPhoneType;
  primaryPhoneType;
  constructor(
    private companyProfileService: CompanyProfileService,
    private toaster: ToastrService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private settingStateService: SettingStateService,
    private companiesStateService: CompaniesStateService,
    private imageCropperStateService: ImageCropperStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private companiesService: CompaniesService,
    private customerPortalStateService: CustomerPortalStateService,
    private ngZone: NgZone
  ) { }

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
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

    this.getConstants();
    this.getGroupedLocales().then(data => {
      this.getCompanyProfile();
    });
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    // create search FormControl
    this.searchControl = new FormControl();
    // load address autocomplete
    this.getAddressAutocomplete();
    this.settingStateService.setComponentName('CompanyProfileComponent');
    this.onCroppImage();
  }
  public setTab(data) {
    this.tabSet = data['nextId'];
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
  ngOnDestroy() {
    this.sub.unsubscribe();
    $('body').removeClass('page-settings');
  }

  getAddress(place: object) {
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
          this.zoom = 12;
        });
      });
    });
  }
  public onChangeTimeZone(data) {
    this.cProfileForm.patchValue({
      timeZone: data,
      locale: (data) ? data.second : ''
    });
  }
  // get current position
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
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
  /**
   * create company profile from group
   */
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

  // convenience getter for easy access to form fields
  get f() {
    return this.cProfileForm.controls;
  }

  /**
   * get current company
   */
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

  /**
   * get company profile
   */
  getCompanyProfile() {
    try {
      this.companyProfileService.getCompanyProfile().subscribe(
        (res: any) => {
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
            if (res.responseTimeSettings) {
              const workingDays = res.responseTimeSettings.workingDays;
              for (let i = 0; i < this.weekDays.length; i++) {
                const day = workingDays[i],
                  name = this.weekDays[i];

                if (!day || day.dayOfWeek !== name) {
                  this.defaultWorkingDay.dayOfWeek = name;
                  workingDays.splice(
                    i,
                    0,
                    Object.assign({}, this.defaultWorkingDay)
                  );
                } else {
                  day.isSelected = true;
                }
              }
            }
            this.cProfile.supportMailBox = res.supportMailBox;
            this.url = res.supportMailBox;
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
        },
        error => {
          this.loading = false;
        }
      );
    } catch (error) {
      this.loading = false;
    }
  }
  onChangeSecondaryPhoneType(data) {
    this.secondaryPhoneType = data;
    this.cProfileForm.patchValue({
      secondaryPhoneType: data.type,
    });
  }
  checkValidateDomain() {
    var regex = /^[a-zA-Z\d\-]+$/;
    this.cProfileForm.get(
      'url'
    ).setValue(
      this.cProfileForm.get(
        'url'
      ).value.toLowerCase());
    if (!regex.test(this.cProfileForm.get(
      'url'
    ).value)) this.cProfileForm.get(
      'url'
    ).setErrors({ 'invalidate': true });
    if (regex.test(this.cProfileForm.get(
      'url'
    ).value)) this.cProfileForm.get(
      'url'
    ).setErrors({ 'invalidate': false });

  }
  checkDomain() {
    this.checkValidateDomain();
    if (this.cProfileForm.get('url').getError('invalidate')) return;
    this.companyProfileService.checkDomain(this.cProfileForm.get(
      'url'
    ).value).subscribe(data => {
      this.cProfileForm.get(
        'url'
      ).setErrors({ 'incorrect': true });
    }, err => {
      this.cProfileForm.get(
        'url'
      ).setErrors({ 'incorrect': false });
      this.setDomain();
    })

  }
  setDomain() {
    this.companyProfileService.setDomain(this.cProfileForm.get(
      'url'
    ).value).subscribe(data => {

    })
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

  /**
   * get constants
   */
  getConstants() {
    this.companyProfileService.getConstants().subscribe(
      res => {
        if (res) {
          this.constants = res;
          this.url = this.url
            ? this.url + '.' + res['website.dns']
            : res['website.dns'];
        }
      },
      error => { }
    );
  }

  /**
   * display secondary phone, when clicked
   */
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

  /**
   * image croped event
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }

  /**
   * close model on close button
   */
  closeModel() {
    this.isCroppedImg = false;
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
          event.target.value = null;
        }
      );
    }
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
          this.getCompanyProfile();
          this.basic();
        },
        error => {
        }
      );
  }

  /**
   * reposition avatar
   */
  rePositionAvatar() {
    if (this.cProfile && this.currentCompany.logo.base64 === null) {
      const imageUrl = `/file/${this.currentCompany.logo.origin.id}.jpg`;
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.isCroppedImg = true;
        this.croppedImage = this.currentCompany.logo.cropped;
        this.croppedImage.base64 = base64data;
        this.imageBase64 = base64data;
      });
    }
  }

  /**
   * get base64Image from url based on params url
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
   * get base64image based on img
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
                  this.getCompanyProfile();
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

  onWorkSubmit() {
    if (
      this.cProfile &&
      this.cProfile.timeSettings &&
      this.cProfile.timeSettings.workingDays
    ) {
      const selectedWorkingHours = this.cProfile.timeSettings.workingDays.filter(
        f => f.isSelected
      );
      const workingTime = {
        outliersSeconds: 21600,
        workingDays: selectedWorkingHours
      };
      const data = {
        companyWorkingTimeDto: {
          workingDays: selectedWorkingHours
        }
      };
      this.companyProfileService.workingTime(data).subscribe(
        res => {
          this.toaster.success('Records Saved Successfully');
        },
        error => {
          this.toaster.error('Bad Request');
        }
      );
    }
  }

  /**
   * saved records
   */
  onSubmit() {
    if (this.tabSet == "tab1") this.submitCompanyProfile();
    if (this.tabSet == "workspace") this.checkDomain();
    if (this.tabSet == "operationalhours") this.onWorkSubmit();
  }
  submitCompanyProfile() {
    this.submitted = true;
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

  /**
   * start time changed based on params
   * @param workingday
   * @param startTime
   */
  startTimeChange(workingday: any, startTime: any) {
    const splitTime = startTime.split(':');
    if (!Number(splitTime[0])) {
      return;
    }
    let hours = parseInt(splitTime[0]) || 0;
    let minutes =
      (!splitTime[1] || splitTime[1].length > 1
        ? parseInt(splitTime[1])
        : parseInt(splitTime[1] + '0')) || 0;
    if (minutes > 59) {
      minutes = 0;
    }
    if (hours > 23) {
      hours = 23;
    }
    const itemIndex = this.cProfile.timeSettings.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.cProfile.timeSettings.workingDays[itemIndex].startTime =
      hours * 3600 + minutes * 60;
  }

  endTimeChange(workingday: any, endTime: any) {
    const splitTime = endTime.split(':');
    if (!Number(splitTime[0])) {
      return;
    }
    let hours = parseInt(splitTime[0]) || 0;
    let minutes =
      (!splitTime[1] || splitTime[1].length > 1
        ? parseInt(splitTime[1])
        : parseInt(splitTime[1] + '0')) || 0;
    if (minutes > 59) {
      minutes = 0;
    }
    if (hours > 23) {
      hours = 23;
    }
    const itemIndex = this.cProfile.timeSettings.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.cProfile.timeSettings.workingDays[itemIndex].endTime =
      hours * 3600 + minutes * 60;
  }

  /**
   * display from time
   * @param from
   */
  fromTime_convert(from) {
    const fromHours = Math.floor(from / 3600);
    const fromMinutes = Math.round(from / 60 - fromHours * 60);
    let fHours = '';
    if (fromHours < 10) {
      fHours = '0' + fromHours;
    }
    let fMinutes = '';
    if (fromMinutes < 10) {
      fMinutes = '0' + fromMinutes;
    }
    const h = fHours ? fHours : Number(fromHours) ? fromHours : 0;
    const m = fMinutes ? fMinutes : Number(fromMinutes) ? fromMinutes : 0;
    const value = h + ':' + m;
    return this.workHours.find(item => item.value == value);
  }

  /**
   * display to time
   * @param to
   */
  toTime_convert(to) {
    const toHours = Math.floor(to / 3600);
    const toMinutes = Math.round(to / 60 - toHours * 60);
    let tHours = '';
    if (toHours < 10) {
      tHours = '0' + toHours;
    }
    let tMinutes = '';
    if (toMinutes < 10) {
      tMinutes = '0' + toMinutes;
    }
    const h = tHours !== '' ? tHours : toHours;
    const m = tMinutes !== '' ? tMinutes : toMinutes;
    const value = h + ':' + m;
    return this.workHours.find(item => item.value == value);
  }

  formatOnInput(workingDay, event) {
    const startTime =
      workingDay && workingDay.startTime ? workingDay.startTime : '';
    if (startTime !== '' && this.numberOnly(workingDay.startTime)) {
      let splitTime = startTime.split(':'),
        hours = parseInt(splitTime[0]) || 0,
        minutes =
          (!splitTime[1] || splitTime[1].length > 1
            ? parseInt(splitTime[1])
            : parseInt(splitTime[1] + '0')) || 0;
      if (minutes > 59) {
        minutes = 0;
      }
      if (hours > 23) {
        hours = 23;
      }
      this.cProfile.timeSettings.workingDays[workingDay.id].startTime =
        hours * 3600 + minutes * 60;
    }
  }

  /**
   * checked number only
   * @param event
   */
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onBackMenu() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('backMenu'); // remove the class
    body.classList.add('backMenu');
  }
}
