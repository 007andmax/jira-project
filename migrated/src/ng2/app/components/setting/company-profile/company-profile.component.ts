import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import { Observable, Observer } from "rxjs";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

import { CompanyProfileService } from "src/ng2/app/services/setting/company-profile.service";
import { ToastrService } from "ngx-toastr";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { SettingService } from "src/ng2/app/services/setting/setting.service";
import { MapsAPILoader } from "@agm/core";

declare var google: any;

@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.scss"]
})
export class CompanyProfileComponent implements OnInit {
  cProfileForm: FormGroup;
  workingHoursForm: FormGroup;

  submitted = false;
  isAddPhone = false;
  isCompanyNameUnique = true;

  url: "";
  imageSrc = "";
  constants: any;
  timezones: any;
  croppedImage: any;
  imageChangedEvent: any;
  isCroppedImg = false;
  fileAvatar: any;
  imageBase64 = "";
  public loading = false;
  public currentCompany: any;

  cProfile = {
    address: [],
    logo: {},
    name: "",
    timeSettings: { workingDays: [], outliersSeconds: 0 },
    supportMailBox: ""
  };
  weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];

  defaultWorkingDay = {
    dayOfWeek: "MONDAY",
    startTime: 28800,
    endTime: 61200,
    isSelected: false
  };

  config = {
    displayKey: "city",
    limitTo: 3,
    search: true,
    searchOnKey: "city"
  };
  // addres google map
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
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
    this.cProfile = {
      address: [],
      logo: {},
      name: "",
      timeSettings: { workingDays: [], outliersSeconds: 0 },
      supportMailBox: ""
    };

    this.createCProfileForm();

    this.getCurrentCompany();
    this.getCompanyProfile();
    this.getConstants();

    this.getGroupedLocales();

    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    // this.setCurrentPosition();

    // load address autocomplete
    this.getAddressAutocomplete();
  }

  getAddress(place: object) {
    // this.address = place['formatted_address'];
    // this.formattedAddress = place['formatted_address'];
    // this.ngZone.run(() => this.formattedAddress = place['formatted_address']);
  }

  getAddressAutocomplete() {
    //load address Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"]
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place = (google.maps.places.PlaceResult = autocomplete.getPlace());

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  // get current position
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
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
      name: new FormControl("", Validators.required),
      url: new FormControl({ value: "", disabled: true }, Validators.required),
      timeZone: new FormControl(""),
      primaryId: new FormControl(""),
      primaryPhone: new FormControl(""),
      primaryPhoneType: new FormControl(""),
      secondaryPhone: new FormControl(""),
      secondaryPhoneType: new FormControl(""),
      suiteNumber: new FormControl(""),
      address: new FormControl(""),
      postalCode: new FormControl("")
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
          if (this.currentCompany && this.currentCompany.logo) {
            this.imageSrc = `/file/${this.currentCompany.logo.cropped.id}.jpg?t=${this.currentCompany.logo.updatedAt}`;
          } else {
            this.imageSrc = "ng2/assets/img/company-logo.svg";
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
    this.loading = true;
    try {
      this.companyProfileService.getCompanyProfile().subscribe(
        (res: any) => {
          this.loading = false;
          if (res) {
            this.cProfile.address = res.addresses;
            this.cProfile.logo = res.logo;
            this.cProfile.name = res.name;
            this.cProfile.timeSettings = res.responseTimeSettings;

            if (res.responseTimeSettings) {
              const workingDays = res.responseTimeSettings.workingDays;
              for (let i = 0; i < this.weekDays.length; i++) {
                var day = workingDays[i],
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
              suiteNumber: res.addresses[0].suiteNumber,
              address: res.addresses[0].address,
              postalCode: res.addresses[0].postalCode
            });

            for (var i = 0; i < this.cProfile.address.length; i++) {
              const phoneNumbers = this.cProfile.address[i].phoneNumbers,
                firstPhone = phoneNumbers[0],
                lastPhone =
                  phoneNumbers.length > 1
                    ? phoneNumbers[phoneNumbers.length - 1]
                    : "";

              if (firstPhone) {
                this.cProfileForm.patchValue({
                  primaryId: firstPhone.id,
                  primaryPhone: firstPhone.number,
                  primaryPhoneType: firstPhone.typeNumber
                    ? firstPhone.typeNumber.toUpperCase()
                    : ""
                });
              }
              if (lastPhone) {
                this.isAddPhone = true;
                this.cProfileForm.patchValue({
                  secondaryId: lastPhone.id,
                  secondaryPhone: lastPhone.number,
                  secondaryPhoneType: lastPhone.typeNumber
                    ? lastPhone.typeNumber.toUpperCase()
                    : ""
                });
              }
            }
          }
        },
        error => {
          this.loading = false;
          console.log(error);
        }
      );
    } catch (error) {
      this.loading = false;
    }
  }

  /**
   * get groupp locals
   */
  getGroupedLocales() {
    this.companyProfileService.getGroupedLocales().subscribe(
      (res: any) => {
        if (res) {
          //this.timezones = res;
          const timeZonesMapped = [];

          for (var prop in res) {
            for (var timeZone in res[prop]) {
              var group = res[prop][timeZone];
              for (var index in group) {
                var city = group[index];
                timeZonesMapped.push({
                  offset: parseInt(timeZone),
                  country: prop,
                  city: prop + "/" + city
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
            ? this.url + "." + res["website.dns"]
            : res["website.dns"];
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
        secondaryPhoneType: "OFFICE"
      });
    } else {
      this.cProfileForm.patchValue({
        secondaryPhone: "",
        secondaryPhoneType: "",
        secondaryId: ""
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
        this.toaster.info("Maximum size of 2MB");
        return;
      }
      this.isCroppedImg = true;
      this.imageChangedEvent = event;
      const fromData = new FormData();
      fromData.append("file", event.target.files[0]);
      this.loading = true;

      this.settingService.fileAvatar(fromData).subscribe(
        result => {
          this.loading = false;
          if (result) {
            this.fileAvatar = result;
          }
        },
        error => {
          this.loading = false;
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
    this.loading = true;
    this.companyProfileService
      .removeAvatar(this.currentCompany.id, true)
      .subscribe(
        res => {
          this.toaster.success("Avatar deleted successfully");
          this.getCompanyProfile();
          this.getCurrentCompany();
          this.basic();
        },
        error => {
          this.loading = false;
        }
      );
  }

  /**
   * reposition avatar
   */
  rePositionAvatar() {
    if (this.cProfile && this.currentCompany.logo.base64 === null) {
      let imageUrl = `/file/${this.currentCompany.logo.origin.id}.jpg`;
      this.loading = true;
      this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
        this.loading = false;
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

  /**
   * get base64image based on img
   * @param img
   */
  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
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

    this.loading = true;
    this.companyProfileService
      .logo(this.currentCompany.id, cropImage)
      .subscribe(
        avatar => {
          if (avatar) {
            this.cProfile.logo = avatar;
            this.toaster.success("Image cropped successfully");
            this.companyProfileService.basic(this.cProfile).subscribe(
              res => {
                if (res) {
                  this.getCompanyProfile();
                  this.getCurrentCompany();
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

  onWorkSubmit() {
    if (
      this.cProfile &&
      this.cProfile.timeSettings &&
      this.cProfile.timeSettings.workingDays
    ) {
      const selectedWorkingHours = this.cProfile.timeSettings.workingDays.filter(
        f => f.isSelected
      );
      const workingTime = { workingDays: selectedWorkingHours };
      this.loading = true;
      this.companyProfileService.workingTime(workingTime).subscribe(
        res => {
          this.loading = false;
          this.toaster.success("Records saved successfully");
        },
        error => {
          this.loading = false;
          this.toaster.error(`Error occured, ${error}`);
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

    if (!this.cProfile.address[0]) {
      return;
    }

    this.cProfile.address[0].suiteNumber = this.cProfileForm.get(
      "suiteNumber"
    ).value;
    this.cProfile.address[0].timeZone.name = this.cProfileForm.value.timeZone
      ? this.cProfileForm.value.timeZone.city
      : "";
    this.cProfile.address[0].address = this.searchElementRef.nativeElement.value; //this.cProfileForm.get("address").value;
    this.cProfile.address[0].postalCode = this.cProfileForm.get(
      "postalCode"
    ).value;

    const phones = [];
    if (this.cProfileForm.value.primaryPhone) {
      phones.push({
        number: this.cProfileForm.value.primaryPhone,
        typeNumber: this.cProfileForm.value.primaryPhoneType,
        id: this.cProfileForm.value.primaryId,
        priority: 0
      });
    }

    if (this.cProfileForm.value.secondaryPhoneType) {
      phones.push({
        number: this.cProfileForm.value.secondaryPhone,
        typeNumber: this.cProfileForm.value.secondaryPhoneType,
        id: this.cProfileForm.value.secondaryId || ""
      });
    }

    this.cProfile.address[0].phoneNumbers = phones;

    if (this.cProfile.name !== this.cProfileForm.get("name").value) {
      this.loading = true;
      this.companyProfileService
        .isCompanyNameUnique(
          this.cProfile.address[0].id,
          this.cProfileForm.get("name").value
        )
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.isCompanyNameUnique = res.value;
            // true, unique companyname
            if (res && res.value) {
              const basic = {
                description: null,
                logo: this.cProfile.logo,
                name: this.cProfileForm.get("name").value
              };
              this.companyProfileService.basic(basic).subscribe(
                res => {
                  this.toaster.success("Records saved successfully");
                },
                error => {
                  this.loading = false;
                  this.toaster.error(`Error Occurred, ${error}`);
                }
              );
            } else {
            }
          },
          error => {
            this.loading = false;
          }
        );
    } else {
      const address = { addresses: this.cProfile.address };
      this.loading = true;
      this.companyProfileService.addresses(address).subscribe(
        res => {
          this.loading = false;
          if (res) {
          }
        },
        error => {
          this.loading = false;
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
    const splitTime = startTime.split(":");
    if (!Number(splitTime[0])) {
      return;
    }
    let hours = parseInt(splitTime[0]) || 0;
    let minutes =
      (!splitTime[1] || splitTime[1].length > 1
        ? parseInt(splitTime[1])
        : parseInt(splitTime[1] + "0")) || 0;

    if (minutes > 59) {
      minutes = 0;
    }

    if (hours > 23) {
      hours = 23;
    }
    let itemIndex = this.cProfile.timeSettings.workingDays.findIndex(
      item => item.id == workingday.id
    );
    this.cProfile.timeSettings.workingDays[itemIndex].startTime =
      hours * 3600 + minutes * 60;
    // this.cProfile.timeSettings.workingDays[workingday.id].startTime =
    //   hours * 3600 + minutes * 60;
  }

  /**
   * display from time
   * @param from
   */
  fromTime_convert(from) {
    const startWith = "from ",
      splitWith = " to ";
    let fromHours = Math.floor(from / 3600);
    let fromMinutes = Math.round(from / 60 - fromHours * 60);

    let fHours = "";
    if (fromHours < 10) {
      fHours = "0" + fromHours;
    }

    let fMinutes = "";
    if (fromMinutes < 10) {
      fMinutes = "0" + fromMinutes;
    }

    const h = fHours ? fHours : Number(fromHours) ? fromHours : 0;
    const m = fMinutes ? fMinutes : Number(fromMinutes) ? fromMinutes : 0;

    const value = h + ":" + m;

    return value;
  }

  /**
   * display to time
   * @param to
   */
  toTime_convert(to) {
    let toHours = Math.floor(to / 3600);
    let toMinutes = Math.round(to / 60 - toHours * 60);

    let tHours = "";
    if (toHours < 10) {
      tHours = "0" + toHours;
    }

    let tMinutes = "";
    if (toMinutes < 10) {
      tMinutes = "0" + toMinutes;
    }

    const h = tHours !== "" ? tHours : toHours;
    const m = tMinutes !== "" ? tMinutes : toMinutes;

    const value = h + ":" + m;

    return value;
  }

  formatOnInput(workingDay, event) {
    const startTime =
      workingDay && workingDay.startTime ? workingDay.startTime : "";
    if (startTime !== "" && this.numberOnly(workingDay.startTime)) {
      var splitTime = startTime.split(":"),
        hours = parseInt(splitTime[0]) || 0,
        minutes =
          (!splitTime[1] || splitTime[1].length > 1
            ? parseInt(splitTime[1])
            : parseInt(splitTime[1] + "0")) || 0;

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
}
