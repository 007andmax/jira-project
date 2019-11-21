import { Component, OnInit, ElementRef, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';

import { CompanyProfile } from '../class/company-profile';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { CompanySubscription } from '../class/company-subscription';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperComponent } from '../../shared/image-cropper/image-cropper.component';
import { ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';
import { CompanySetting } from '../class/company-setting';
import { CompanyValdiate } from '../class/company-validate';
import {} from 'google-maps';
@Component({
  selector: 'app-company-add-aside',
  templateUrl: './company-add-aside.component.html',
  styleUrls: ['./company-add-aside.component.scss']
})
export class CompanyAddAsideComponent implements OnInit {

  opened = false;
  company: CompanyProfile = new CompanyProfile();
  industries: Array<string> = [];
  version: string = 'short';
  companyTypes = [new CompanySetting('Client', 'CLIENT'),new CompanySetting('Lead', 'LEAD'),new CompanySetting('Vendor', 'VENDOR')];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 0), new CompanySetting('15 days', 0), new CompanySetting('30 days', 0)];
  serviceTypes = [new CompanySetting('Hourly', 'HOURLY'), new CompanySetting('Block time', 'BLOCK_TIME'), new CompanySetting('Semi managed', 'SEMI_MANAGED'), new CompanySetting('Fully managed', 'FULLY_MANAGED')];
  paymentMethods = ['Cash', 'Cheque', 'Debit Card', 'Credit Card', 'Wire Transfer'];
  listPersons = [];
  subscriptions: Array<CompanySubscription> = [new CompanySubscription('Ticket Updates', 'ticket'),
  new CompanySubscription('Ticket Manager', 'ticketManager'),
  new CompanySubscription('Invoice Updates', 'invoice')];
  showSelect = false;
  validate: CompanyValdiate = new CompanyValdiate();

  locationIsinit:boolean = false;
  @ViewChild('addresstext') addresstext: any;
  constructor(private companiesStateService: CompaniesStateService, private companiesService: CompaniesService,
    private usersStateService: UsersStateService, private modalService: NgbModal, private imageCropperStateService: ImageCropperStateService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {

    this.onShowAside();
    this.getIndustries();
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTehusers(this.usersStateService.getAllUsers());
    } else {
      this.usersStateService.getOnUsers().subscribe((data) => {
        this.getTehusers(data);
      })
    }

    this.onCroppImage();
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
    place.address_components.forEach(item => {
      if (item.types.indexOf('postal_code') !== -1) {
        this.company.addresses[0].postalCode = item.short_name;
        this.cd.detectChanges();
      }
    })

}
  close() {
    this.opened = false;
    this.version = 'short';
    this.locationIsinit = false;
    this.company = new CompanyProfile();
    this.companyTypes.forEach(item => item.selected = false);
    this.paymentTerms.forEach(item => item.selected = false);
    this.serviceTypes.forEach(item => item.selected = false);
    this.subscriptions.forEach(item => item.selected = false);
    this.listPersons.forEach(item => item.selected = false);
    this.validate = new CompanyValdiate();

  }
  public onSelectTechLead(index) {
    this.listPersons.forEach(item => item.selected = false);
    this.listPersons[index].selected = true;
    this.company.techLeadId = this.listPersons[index].id;
  }
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
  onAddShort() {
    if (!this.validate.isValidate(this.company)) return;
    console.log('company', this.company);
    this.companiesService.createCompany(this.company).subscribe(data => {
      console.log(' data', data);
      this.close();
    })
  }
  public onShowAside() {
    this.companiesStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
    })
  }
  public oninitFullVersion() {
    this.version = 'full';
    this.company.fullVersion();
    
  }
  public onCheckGoogleAutoComplete () {
   if (!this.locationIsinit) this.getPlaceAutocomplete();
  }
  public onSelectCompanyTypes(index) {
    this.companyTypes.forEach(item => item.selected = false);
    this.companyTypes[index].selected = true;
    this.company.clientType = this.companyTypes[index].value;
    this.validate.resetType();
  }
  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onChangeSubscribe(data) {
    data.forEach(item => this.company.contacts[0].subscription[item.field] = item.selected);
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      this.companiesService.checkCompanyName("", this.company.name).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetName();
          this.validate.resetNameIsExist();
        } else {
          this.validate.setNameIsExist();
        }
      })
    } else {
      this.validate.checkValidName(this.company.name);
    }
  }
  public onChangeDomain() {
   this.validate.checkValidDomain(this.company.domain); 
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
    this.company.addresses[0].timeZone = data;
  }
  public onChangeTags(tags) {
    /* tags.forEach((item) => {
       this.recurringState.getCreateTicket().addTag(item.id);
     })*/
  }
  public onChangeDescription(event) {
    this.company.description = event.target.value;
    //  this.recurringState.getCreateTicket().setDescription(event.target.value);
  }
  public onAddFull() {
    if (!this.validate.isValidate(this.company)) return;

    this.companiesService.createCompany(this.company).subscribe(data => {
      console.log(' data', data);
      this.close();
    })
  }
  public onCroppImage() {
    this.imageCropperStateService.getConfirm().subscribe(data => {
      console.log('data', data);
      this.company.setLogo(data);
    })
  }
  private getTehusers(list) {

    list.forEach((item) => {
      if (item.accountType === "TECH" && !item.deletedAt) {
        item.selected = false;
        this.listPersons.push(item);
      }
    })
    console.log('this.listPersons', this.listPersons);
  }
  private getIndustries() {
    this.companiesService.getIndustries().subscribe((data: Array<string>) => {
      this.industries = data;
      console.log('industries', this.industries);
    })
  }
  getSelectedCompanyTypes() {
    let index = this.companyTypes.findIndex(item => item.selected === true);
    if (index > -1) return this.companyTypes[index].title;
    return "";
  }
  getSelectedTechLead() {
    let index = this.listPersons.findIndex(item => item.selected === true);
    if (index > -1) return this.listPersons[index].firstName + ' ' + this.listPersons[index].lastName;
    return "";
  }
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
  public uploadFileOnBrower(event) {
    console.log('event', event);
    if (event.target.value) {
      const file = event.target.files[0];
      console.log('file', file);
      this.uploadFile(file).then((data: any) => {
        let res = JSON.parse(data.response);
        // this.changeFile(file).then((base64: string): any => {
        const modalRef = this.modalService.open(ImageCropperComponent);
        modalRef.componentInstance.imageBase64 = res.base64;
        modalRef.componentInstance.id = res.id;
        event.target.value = null;

        // });

      });

    } else alert('Nothing')
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      //  var file = this.dataURLtoFile(this.img, this.fileName);
      console.log(file);
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
  }
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
}
