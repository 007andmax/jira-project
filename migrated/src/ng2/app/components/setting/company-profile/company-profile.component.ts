import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnDestroy
} from '@angular/core';
import { Observable, Observer } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { CompanyProfileService } from 'src/ng2/app/services/setting/company-profile.service';
import { ToastrService } from 'ngx-toastr';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SettingService } from 'src/ng2/app/services/setting/setting.service';
import { MapsAPILoader } from '@agm/core';
import { NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;
declare var $:any;
@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, OnDestroy {
  // @ViewChild(NgbDatepicker) dd: NgbDatepicker;
  // @ViewChild(NgbDatepicker) d: NgbDatepicker;
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
  public loading = false;
  public currentCompany: any;

  cProfile = {
    address: [],
    logo: {},
    name: '',
    timeSettings: { workingDays: [], outliersSeconds: 0 },
    supportMailBox: ''
  };
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
    displayKey: 'city',
    limitTo: 3,
    search: true,
    searchOnKey: 'city'
  };
  // addres google map
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
  accountingStartDate: NgbDateStruct  = {
    "day": 0,
    "month": 0,
    "year": 0,
  };
  accountingEndDate = {
    "day": new Date().getDate(),
    "month": new Date().getMonth() + 1,
    "year": new Date().getFullYear(),
  };
  @ViewChild('search')
  public searchElementRef: ElementRef;

  phone: string;
  constructor(
    private companyProfileService: CompanyProfileService,
    private toaster: ToastrService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  /**
   * init
   */
  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.cProfile = {
      address: [],
      logo: {},
      name: '',
      timeSettings: { workingDays: [], outliersSeconds: 0 },
      supportMailBox: ''
    };
    this.getAccountingStartDate();
    this.createCProfileForm();

    this.getCurrentCompany();
    this.getCompanyProfile();
    this.getConstants();

    this.getGroupedLocales();

    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    // this.setCurrentPosition();

    // load address autocomplete
    this.getAddressAutocomplete();
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }

  getAddress(place: object) {
    // this.address = place['formatted_address'];
    // this.formattedAddress = place['formatted_address'];
    // this.ngZone.run(() => this.formattedAddress = place['formatted_address']);
  }

  getAccountingStartDate() {
    this.companyProfileService.getAccountingStartDate().subscribe(
      (res: any) => {
        if (res.accountingStartDate !== null) {
          this.accountingStartDate = {
            "day": new Date(res.accountingStartDate).getDate(),
            "month": new Date(res.accountingStartDate).getMonth() + 1,
            "year": new Date(res.accountingStartDate).getFullYear(),
          };
        }
      },
      error => {}
    );
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

  /**
   * create company profile from group
   */
  createCProfileForm() {
    this.cProfileForm = new FormGroup({
      name: new FormControl('', Validators.required),
     // url: new FormControl({ value: '' }, Validators.required),
      url: new FormControl(''),
      timeZone: new FormControl(''),
      primaryId: new FormControl(''),
      primaryPhone: new FormControl(''),
      primaryPhoneType: new FormControl(''),
      secondaryPhone: new FormControl(''),
      secondaryPhoneType: new FormControl(''),
      suiteNumber: new FormControl(''),
      address: new FormControl(''),
      postalCode: new FormControl('')
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.cProfileForm.controls;
  }

  /**
   * get current company
   */
  private getCurrentCompany() {
    this.currentCompany = this.companyProfileService.current().subscribe(
      res => {
        if (res) {
          this.currentCompany = res;
          if (
            this.currentCompany &&
            this.currentCompany.logo &&
            this.currentCompany.logo.cropped
          ) {
            this.imageSrc = `/file/${this.currentCompany.logo.cropped.id}.jpg?t=${this.currentCompany.logo.updatedAt}`;
          } else {
            this.imageSrc = '';
            // this.imageSrc = "../../../../../ng1/images/setting-module/upload-company-logo.svg";
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
      },
      error => {}
    );
  }

  /**
   * get company profile
   */
  getCompanyProfile() {
    this.loading = true;$(".loading").css("display", "block");
    try {
      this.companyProfileService.getCompanyProfile().subscribe(
        (res: any) => {
          this.loading = false;$(".loading").css("display", "none");
          if (res) {
            this.cProfile.address = res.addresses;
            this.cProfile.logo = res.logo;
            this.cProfile.name = res.name;
            this.cProfile.timeSettings = res.responseTimeSettings;

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
              url: res.supportMailBox,
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
                firstPhone = phoneNumbers[0],
                lastPhone =
                  phoneNumbers.length > 1
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
              }
            }
          }
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
          console.log(error);
        }
      );
    } catch (error) {
      this.loading = false;$(".loading").css("display", "none");
    }
  }

  /**
   * get groupp locals
   */
  getGroupedLocales() {
    this.companyProfileService.getGroupedLocales().subscribe(
      (res: any) => {
        if (res) {
          // this.timezones = res;
          const timeZonesMapped = [];

          for (const prop in res) {
            for (const timeZone in res[prop]) {
              const group = res[prop][timeZone];
              for (const index in group) {
                const city = group[index];
                timeZonesMapped.push({
                  offset: parseInt(timeZone),
                  country: prop,
                  city: prop + '/' + city
                });
              }
            }
          }
          this.timezones = timeZonesMapped;
        }
      },
      error => {}
    );
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
          this.cProfileForm.patchValue({ url: this.url });
        }
      },
      error => {}
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
      if (size > 200000) {
        this.toaster.info('Maximum size of 2MB');
        return;
      }
      this.isCroppedImg = true;
      this.imageChangedEvent = event;
      const fromData = new FormData();
      fromData.append('file', event.target.files[0]);
      this.loading = true;$(".loading").css("display", "block");

      this.settingService.fileAvatar(fromData).subscribe(
        result => {
          this.loading = false;$(".loading").css("display", "none");
          if (result) {
            this.fileAvatar = result;
          }
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
          console.log(error);
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
        res => {},
        error => {}
      );
  }

  /**
   * delete avatar
   */
  deleteAvatar() {
    this.loading = true;$(".loading").css("display", "block");
    this.companyProfileService
      .removeAvatar(this.currentCompany.id, true)
      .subscribe(
        res => {
          this.toaster.success('Avatar Deleted Successfully', null, {
            timeOut: 3000
          });
          this.getCompanyProfile();
          this.getCurrentCompany();
          this.basic();
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
        }
      );
  }

  /**
   * reposition avatar
   */
  rePositionAvatar() {
    if (this.cProfile && this.currentCompany.logo.base64 === null) {
      const imageUrl = `/file/${this.currentCompany.logo.origin.id}.jpg`;
      this.loading = true;$(".loading").css("display", "block");
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.loading = false;$(".loading").css("display", "none");
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

    this.loading = true;$(".loading").css("display", "block");
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
                  this.getCurrentCompany();
                }
              },
              error => {
                this.loading = false;$(".loading").css("display", "none");
              }
            );
          }
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
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
      this.loading = true;$(".loading").css("display", "block");
      // selectedWorkingHours.map((h: any, index: number) => {
      //   // tslint:disable-next-line: no-string-literal
      //   const from = document.getElementById('from-' + h.dayOfWeek)['value'];
      //   // tslint:disable-next-line: no-string-literal
      //   const to = document.getElementById('to-' + h.dayOfWeek)['value'];
      //   h.workingHours = `from ${from} to ${to}`;
      // });
      this.companyProfileService.workingTime(data).subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
          this.toaster.success('Records Saved Successfully');
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
          this.toaster.error('Bad Request');
        }
      );
    }
  }

  /**
   * saved records
   */
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.cProfileForm.invalid) {
      return;
    }
let data = {};
debugger;
data['id'] = this.currentCompany.addresses.length > 0 ? this.currentCompany.addresses[0].id : '';
data['isPrimary'] = true;
data['suiteNumber'] = this.cProfileForm.get('suiteNumber').value;
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
data['locale'] = this.cProfileForm.get(
  'timeZone'
).value == undefined ? '' : (this.cProfileForm.get(
  'timeZone'
).value.city
|| (this.cProfile.address.length > 0 ? this.cProfile.address[0].locale : ''));
data['countryCode'] = this.countryCode;
data['locationLat'] = this.latitude;
data['locationLng'] = this.longitude;
data['longCity'] = this.longCity;
data['shortCity'] = this.shortCity;
data['longState'] = this.longState;
data['shortState'] = this.shortState;
data['addressWithSuitNumberAndPostalCode'] = this.cProfile.address.length > 0 ? this.cProfile.address[0].addressWithSuitNumberAndPostalCode : '';
data['fromGoogle'] = this.fromGoogle;
    // this.cProfile.address[0].suiteNumber = this.cProfileForm.get(
    //   'suiteNumber'
    // ).value;
    // this.cProfile.address[0].timeZone.name = this.cProfileForm.value.timeZone
    //   ? this.cProfileForm.value.timeZone.city
    //   : '';
    // this.cProfile.address[0].address = this.searchElementRef.nativeElement.value; // this.cProfileForm.get("address").value;
    // this.cProfile.address[0].postalCode = this.cProfileForm.get(
    //   'postalCode'
    // ).value;
    if (data['address'] == '') {
      return;
    }
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
      this.loading = true;$(".loading").css("display", "block");
      this.companyProfileService
        .isCompanyNameUnique(
          this.cProfile.address[0].id,
          this.cProfileForm.get('name').value
        )
        .subscribe(
          (res: any) => {
            this.loading = false;$(".loading").css("display", "none");
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
                },
                error => {
                  this.loading = false;$(".loading").css("display", "none");
                  this.toaster.error('Bad Request');
                }
              );
            } else {
            }
          },
          error => {
            this.loading = false;$(".loading").css("display", "none");
          }
        );
    } else {
      const address = { addresses: [data] };
      this.loading = true;$(".loading").css("display", "block");
      this.companyProfileService.addresses(address).subscribe(
        res => {
          this.loading = false;$(".loading").css("display", "none");
          if (res) {
          }
        },
        error => {
          this.loading = false;$(".loading").css("display", "none");
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
    // this.cProfile.timeSettings.workingDays[workingday.id].startTime =
    //   hours * 3600 + minutes * 60;
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
    const startWith = 'from ',
      splitWith = ' to ';
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

    return value;
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
    return value;
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

      // model[field] = hours * 3600 + minutes * 60;
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

  saveAccountingDate() {
    let data = new Date(this.accountingStartDate.month + '/' + this.accountingStartDate.day + '/' + this.accountingStartDate.year).getTime()
    this.companyProfileService.setAccountingStartDate(data).subscribe(
      (res: any) => {
        this.toaster.success('Accounting date updated successfully', null, {
          timeOut: 3000
        });
      },
      error => {}
    );
  }

  resetAccountingDate() {
    this.companyProfileService.resetAccountingStartDate().subscribe(
      (res: any) => {
        this.toaster.success('Accounting date reset successfully', null, {
          timeOut: 3000
        });
      },
      error => {}
    );
  }
}
