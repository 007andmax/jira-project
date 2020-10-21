import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompanyProfile } from '../class/company-profile';
import { CompanySetting } from '../class/company-setting';
import { CompanySubscription } from '../class/company-subscription';
import { CompanyValdiate } from '../class/company-validate';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';

import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanySubscriptionStateService } from '../company-subscription/class/company-subscription-state.service';
import { CompanyTimeZoneStateService } from '../company-time-zone/services/company-time-zone-state.service';
import { isNgTemplate } from '@angular/compiler';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { CompanyTagsStateService } from '../company-tags/states/company-tags-state.service';
import { ItemFilterPerson } from '../../left-panel/left-panel-companies/class/item-filter-person';
import { Subscription } from 'rxjs';
import { CROPP_AVATAR_COMPANY } from 'src/ng2/app/const/image-cropp';
import { ModalImageCropperStateService } from 'src/ng2/app/services/modal/modal-image-cropper/services/modal-image-cropper-state.service';
import { ImageCroper } from 'src/ng2/app/services/modal/modal-image-cropper/class/image-croper';
import { CompanyEditLogo } from '../class/company-edit-logo';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';
import { UsersService } from 'src/ng2/app/services/users/users.service';

@Component({
  selector: 'app-company-edit-aside',
  templateUrl: './company-edit-aside.component.html',
  styleUrls: ['./company-edit-aside.component.scss']
})
export class CompanyEditAsideComponent implements OnInit, OnDestroy {


  opened = false;
  company: CompanyProfile = new CompanyProfile();
  industries: Array<string> = [];
  selectedTechLead: string = null;
  companyTypes = [new CompanySetting('Client', 'CLIENT'), new CompanySetting('Lead', 'LEAD'), new CompanySetting('Vendor', 'VENDOR')];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 7), new CompanySetting('15 days', 15), new CompanySetting('30 days', 30)];
  serviceTypes = [new CompanySetting('Hourly', 'HOURLY'), new CompanySetting('Block time', 'BLOCK_TIME'), new CompanySetting('Semi managed', 'SEMI_MANAGED'), new CompanySetting('Fully managed', 'FULLY_MANAGED')];
  paymentMethods = [new CompanySetting('Cash', 'CASH'),
  new CompanySetting('Cheque', 'CHEQUE'),
  new CompanySetting('Debit Card', 'DEBIT_CARD'),
  new CompanySetting('Credit Card', 'CREDIT_CARD'),
  new CompanySetting('Wire Transfer', 'WIRE_TRANSFER')];
  listPersons: Array<ItemFilterPerson> = [];
  subscriptions: Array<CompanySubscription> = [new CompanySubscription('Ticket Updates', 'ticket'),
  new CompanySubscription('Ticket Manager', 'ticketManager'),
  new CompanySubscription('Invoice Updates', 'invoice')];
  showSelect = false;
  validate: CompanyValdiate = new CompanyValdiate();
  sub: Subscription = new Subscription();
  locationIsinit: boolean = false;
  @ViewChild('addresstext') addresstext: any;
  allTitles: Array<string> = [];
  constructor(private companiesStateService: CompaniesStateService, private companiesService: CompaniesService,
    private usersStateService: UsersStateService, private modalService: NgbModal, private imageCropperStateService: ImageCropperStateService,
    private elRef: ElementRef,
    private usersService: UsersService,
    private companySubscriptionState: CompanySubscriptionStateService,
    private companyTimeZoneState: CompanyTimeZoneStateService,
    private companyTagsStateService: CompanyTagsStateService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private tagsState: CompanyTagsStateService,
    public cd: ChangeDetectorRef) { }

  ngOnInit() {

    this.company.fullVersion();
    // this.getIndustries();
    this.industries = this.companiesStateService.getIndustries();
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTehusers(this.usersStateService.getAllUsers());
      this.getUsersTitle(this.usersStateService.getAllUsers());
    }
    let getOnUsers = this.usersStateService.getOnUsers().subscribe((data) => {
      this.getTehusers(data);
      this.getUsersTitle(data);
    })
    this.sub.add(getOnUsers);


    this.onCroppImage();
    this.onEditCompany();
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
  getSelectedPaymentMethod() {
    let index = this.paymentMethods.findIndex(item => item.value === this.company.defaultPaymentMethod);
    if (index > -1) return this.paymentMethods[index].title;
    return "";
  }
  onSelectDesignation(data) {
    this.company.contacts[0].designation = data;

  }
  private getPlaceAutocomplete() {
    this.locationIsinit = true;
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: null,
        types: ['address']  // 'establishment' / 'address' / 'geocode'
      });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.invokeEvent(place);
    });
  }

  invokeEvent(place: any) {

    this.company.addresses[0].locationLat = place.geometry.location.lat();
    this.company.addresses[0].locationLng = place.geometry.location.lng();
    this.company.addresses[0].address = this.addresstext.nativeElement.value;
    this.company.addresses[0].addressWithSuitNumberAndPostalCode = place.formatted_address;
    place.address_components.forEach(item => {
      if (item.types.indexOf('postal_code') !== -1) {
        this.company.addresses[0].postalCode = item.short_name;
      }
      if (item.types.indexOf('country') !== -1) {
        this.company.addresses[0].countryCode = item.short_name;
      }
      this.cd.detectChanges();
    })

  }

  public onCheckGoogleAutoComplete() {
    if (!this.locationIsinit) this.getPlaceAutocomplete();
  }
  close() {
    this.opened = false;
    this.locationIsinit = false;
    this.companySubscriptionState.onInitClear();
    this.companyTagsStateService.onInitClear();
    this.company = new CompanyProfile();
    //  this.company.fullVersion();
    this.companyTypes.forEach(item => item.selected = false);
    this.paymentTerms.forEach(item => item.selected = false);
    this.serviceTypes.forEach(item => item.selected = false);
    this.subscriptions.forEach(item => item.selected = false);
    this.selectedTechLead = null;
    // this.listPersons.forEach(item => item.selected = false);
    this.validate = new CompanyValdiate();

  }
  onEditCompany() {
    let getCompanyFromEdit = this.companiesStateService.getCompanyFromEdit().subscribe((data: CompanyProfile) => {
      this.company = new CompanyProfile();
      this.company.onEditMode(data);
      this.companySubscriptionState.onEditMode(this.company.contacts[0].subscription);
      this.companyTimeZoneState.onEditMode(this.company.addresses[0].timeZone);
      let indexTerms = this.paymentTerms.findIndex(item => item.value === this.company.paymentTerms);
      if (indexTerms > -1) this.onSelectPaymentTerms(indexTerms);

      let indexServiceType = this.serviceTypes.findIndex(item => item.value === this.company.serviceType);
      if (indexServiceType > -1) this.onSelectServiceTypes(indexServiceType);

      let indexPersone = this.listPersons.findIndex(item => item.id === this.company.techLeadId);
      if (indexPersone > -1) this.selectedTechLead = this.listPersons[indexPersone].name;
      //  if (indexPersone > -1) this.onSelectTechLead(indexPersone);

      let indexType = this.companyTypes.findIndex(item => item.value === this.company.clientType);
      if (indexType > -1) this.onSelectCompanyTypes(indexType);


      this.tagsState.setTagsFromtEdit(this.company.tags);
      this.elRef.nativeElement.querySelector("#company-description").value = this.company.description;
      this.opened = true;
      //this.company.
      this.cd.detectChanges();
    })
    this.sub.add(getCompanyFromEdit);
  }

  public onSelectCompanyTypes(index) {
    this.companyTypes.forEach(item => item.selected = false);
    this.companyTypes[index].selected = true;
    this.company.clientType = this.companyTypes[index].value;
    this.validate.resetType();
  }
  public onSelectTechLead(event) {
    if (event) {
      this.company.techLeadId = event.id;
      this.selectedTechLead = null;
    } else {
      this.company.techLeadId = null;

    }
    //this.listPersons.forEach(item => item.selected = false);
    //  this.listPersons[index].selected = true;

  }
  /* public onSelectTechLead(index) {
     this.listPersons.forEach(item => item.selected = false);
     this.listPersons[index].selected = true;
     this.company.techLeadId = this.listPersons[index].id;
   }*/
  public onSelectPaymentTerms(index) {
    this.paymentTerms.forEach(item => item.selected = false);
    this.paymentTerms[index].selected = true;
    this.company.paymentTerms = this.paymentTerms[index].value;
  }
  public onSelectServiceTypes(index) {
    this.serviceTypes.forEach(item => item.selected = false);
    this.serviceTypes[index].selected = true;
    this.company.serviceType = this.serviceTypes[index].value;
  }
  onCheckEmail() {
    
    if (this.company.contacts[0].primaryEmail && this.company.contacts[0].primaryEmail.length > 0) this.onCheckValidPrimaryEmail();
  }
  onCheckValidPrimaryEmail() {
    this.usersService.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail, this.company.id).subscribe((data: any) => {

      this.validate.setExistPrimaryContactEmail(data.value);
      this.cd.detectChanges();
    })
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onChangeSubscribe(data) {
    data.forEach(item => this.company.contacts[0].subscription[item.field] = item.selected);
  }
  public onChangeDomain() {
    this.validate.checkValidDomain(this.company.domain);
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      let checkCompanyName = this.companiesService.checkCompanyName(this.company.id, this.company.name).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetName();
          this.validate.resetNameIsExist();
        } else {
          this.validate.setNameIsExist();
        }
      })
      this.sub.add(checkCompanyName);
    } else {
      this.validate.checkValidName(this.company.name);
    }
  }
  public onChangePhoneNumber() {
    this.validate.checkValidPhoneNumber(this.company.addresses[0].phoneNumbers[0].number);
  }
  public onChangeFirstName() {
    this.validate.checkValidFirstname(this.company.contacts[0].firstName);
  }
  public onChangeType() {
    this.validate.checkValidType(this.company.clientType);
  }
  public onChangeTimeZone(data) {
    this.company.addresses[0].locale = data.name;
    this.company.addresses[0].timeZone = data;
  }
  onSelectClientIndustry(item) {
    this.company.clientIndustry.name = item
  }
  public onChangeTags(tags) {

    this.company.setTags(tags);
    /* tags.forEach((item) => {
      this.recurringState.getCreateTicket().addTag(item.id);
    }) */
  }
  public onChangeDescription(event) {
    this.company.description = event.target.value;
    //  this.recurringState.getCreateTicket().setDescription(event.target.value);
  }
  public onUpdateFull() {

    if (!this.validate.isValidate(this.company)) return;

    let updateCompany = this.companiesService.updateCompany(this.company.getDataForUpdate()).subscribe(data => {

      this.close();
      this.cd.detectChanges();
    })
    this.sub.add(updateCompany);
  }
  public onCroppImage() {
    let getConfirm = this.imageCropperStateService.getConfirm().subscribe(data => {
      if (!this.opened || !data || this.imageCropperStateService.getAction() !== CROPP_AVATAR_COMPANY) return;

      this.companiesService.editCompanyAvatar(this.company.id, new CompanyEditLogo(data.croppedImage.base64, data.croppedImage.height,
        this.company.id, (data.edit) ? this.company.logo.origin.id : data.id, data.croppedImage.width, data.croppedImage.imagePosition.x1, data.croppedImage.imagePosition.y1)).subscribe(res => {
          this.company.editLogo(res);
        })
      /*  if (data.edit) {
          this.companiesService.editCompanyAvatar(this.company.id,new CompanyEditLogo(data.croppedImage.base64,data.croppedImage.height,
            this.company.id,this.company.logo.origin.id,data.croppedImage.width,data.croppedImage.imagePosition.x1,data.croppedImage.imagePosition.y1)).subscribe(res => {
              this.company.editLogo(res);
            })
         
        } else {
          this.companiesService.editCompanyAvatar(this.company.id,new CompanyEditLogo(data.croppedImage.base64,data.croppedImage.height,
            this.company.id,data.id,data.croppedImage.width,data.croppedImage.imagePosition.x1,data.croppedImage.imagePosition.y1)).subscribe(res => {
              this.company.editLogo(res);
            })
          this.company.setLogo(data);
        }*/

    })
    this.sub.add(getConfirm);
  }
  public onChangeAvatar() {

    this.downloadCompanyLogo().then(data => {
      //   const modalRef = this.modalService.open(ImageCropperComponent);

      //  modalRef.componentInstance.imageBase64 = data;
      //  modalRef.componentInstance.id = this.company.logo.origin.id;
      this.modalImageCropperStateService.onInitOpen(new ImageCroper(data, this.company.logo.origin.id, true));
      this.cd.detectChanges();

    })
  }
  private getTehusers(list) {

    list.forEach((item) => {
      if (item.accountType === "TECH" && !item.deletedAt) {
        // item.selected = false;
        //   this.listPersons.push(item);
        this.listPersons.push(new ItemFilterPerson(item.id, `${item.firstName} ${item.lastName}`));
        this.listPersons.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
          1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
      }

    })

  }
  /* private getIndustries() {
     let getIndustries = this.companiesService.getIndustries().subscribe((data: Array<string>) => {
       this.industries = data;
        
     })
     this.sub.add(getIndustries);
   }*/
  getSelectedCompanyTypes() {
    let index = this.companyTypes.findIndex(item => item.selected === true);
    if (index > -1) return this.companyTypes[index].title;
    return "";
  }
  /* getSelectedTechLead() {
     let index = this.listPersons.findIndex(item => item.selected === true);
     if (index > -1) return this.listPersons[index].firstName + ' ' + this.listPersons[index].lastName;
     return "";
   }*/
  getSelectedServiceType() {
    let index = this.serviceTypes.findIndex(item => item.selected === true);
    if (index > -1) return this.serviceTypes[index].title;
    return "";
  }
  getSelectedPaymentTerms() {
    let index = this.paymentTerms.findIndex(item => item.selected === true);
    if (index > -1) return this.paymentTerms[index].title;
    return "";
  }
  getSelectedDropDown(value) {
    if (!value) return "";
    let editValue = value.substring(1, value.length);
    editValue = editValue.toLowerCase();
    editValue = `${value[0]}${editValue}`;
    return editValue;
  }
  getCompanyLogoUrl() {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) return this.company.logo.base64;
    if (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id) return `/file/${this.company.logo.cropped.id}`;
    if (this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id) return `/file/${this.company.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  downloadCompanyLogo() {
    return new Promise((resolve, reject) => {
      if (this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
        resolve(this.company.logo.base64);
      } else {
        var req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.open('GET', `/file/${this.company.logo.origin.id}.jpg`, true); /* Третий аргумент true означает асинхронность */
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
  public uploadFileOnBrower(event) {
    this.imageCropperStateService.setAction(CROPP_AVATAR_COMPANY);
    this.imageCropperStateService.uploadFileOnBrower(event);
    /* if (event.target.value) {
       const file = event.target.files[0];
        
       this.uploadFile(file).then((data: any) => {
         let res = JSON.parse(data.response);
         // this.changeFile(file).then((base64: string): any => {
       //  const modalRef = this.modalService.open(ImageCropperComponent,res.base64);
      
       //  modalRef.componentInstance.imageBase64 = res.base64;
      //   modalRef.componentInstance.id = res.id;
         event.target.value = null;
         this.modalImageCropperStateService.onInitOpen(new ImageCroper(res.base64,res.id));
       this.cd.detectChanges();
 
         // });
 
       });
 
     }  */
  }
  /*uploadFile(file) {
    return new Promise((resolve, reject) => {
      //  var file = this.dataURLtoFile(this.img, this.fileName);
       
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {

        resolve(xhr);

      }, false);
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);


      xhr.open("POST", "/file?isAvatar=true&ratio=1");
      xhr.send(fd);
    });
  }*/
  changeFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  /**
  * show selecct wrapper
  */
  public showSelectWrapper($event) {
    this.showSelect = !this.showSelect;
    this.stopEvent($event);
  }

  /**
  * stop event
  */
  private stopEvent($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
