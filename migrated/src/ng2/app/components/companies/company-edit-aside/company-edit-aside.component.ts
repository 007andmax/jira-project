import { Component, OnInit, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-company-edit-aside',
  templateUrl: './company-edit-aside.component.html',
  styleUrls: ['./company-edit-aside.component.scss']
})
export class CompanyEditAsideComponent implements OnInit {

  opened = false;
  company: CompanyProfile = new CompanyProfile();
  industries: Array<string> = [];

  companyTypes = [new CompanySetting('Client', 'CLIENT'), new CompanySetting('Lead', 'LEAD'), new CompanySetting('Vendor', 'VENDOR')];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 7), new CompanySetting('15 days', 15), new CompanySetting('30 days', 30)];
  serviceTypes = [new CompanySetting('Hourly', 'HOURLY'), new CompanySetting('Block time', 'BLOCK_TIME'), new CompanySetting('Semi managed', 'SEMI_MANAGED'), new CompanySetting('Fully managed', 'FULLY_MANAGED')];
  paymentMethods = ['Cash', 'Cheque', 'Debit Card', 'Credit Card', 'Wire Transfer'];
  listPersons = [];
  subscriptions: Array<CompanySubscription> = [new CompanySubscription('Ticket Updates', 'ticket'),
  new CompanySubscription('Ticket Manager', 'ticketManager'),
  new CompanySubscription('Invoice Updates', 'invoice')];
  showSelect = false;
  validate: CompanyValdiate = new CompanyValdiate();
  constructor(private companiesStateService: CompaniesStateService, private companiesService: CompaniesService,
    private usersStateService: UsersStateService, private modalService: NgbModal, private imageCropperStateService: ImageCropperStateService,
    private elRef: ElementRef,
    private companySubscriptionState: CompanySubscriptionStateService,
    private companyTimeZoneState: CompanyTimeZoneStateService,
    private companyTagsStateService:CompanyTagsStateService) { }

  ngOnInit() {


    this.getIndustries();
    if (this.usersStateService.getAllUsers().length > 0) {
      this.getTehusers(this.usersStateService.getAllUsers());
    } else {
      this.usersStateService.getOnUsers().subscribe((data) => {
        this.getTehusers(data);
      })
    }

    this.onCroppImage();
    this.onEditCompany();
  }
  close() {
    this.opened = false;
    this.companySubscriptionState.onInitClear();
    this.companyTagsStateService.onInitClear();
    this.company = new CompanyProfile();
    this.companyTypes.forEach(item => item.selected = false);
    this.paymentTerms.forEach(item => item.selected = false);
    this.serviceTypes.forEach(item => item.selected = false);
    this.subscriptions.forEach(item => item.selected = false);
    this.listPersons.forEach(item => item.selected = false);
    this.validate = new CompanyValdiate();

  }
  onEditCompany() {
    this.companiesStateService.getOnEditCompany().subscribe((data: CompanyProfile) => {
      this.company = new CompanyProfile();
      this.company.onEditMode(data);
      this.companySubscriptionState.onEditMode(this.company.contacts[0].subscription);
      if (this.company.addresses[0].timeZone) this.companyTimeZoneState.onEditMode(this.company.addresses[0].timeZone);
      let indexTerms = this.paymentTerms.findIndex(item => item.value === this.company.paymentTerms);
      if (indexTerms > -1) this.onSelectPaymentTerms(indexTerms);

      let indexServiceType = this.serviceTypes.findIndex(item => item.value === this.company.serviceType);
      if (indexServiceType > -1) this.onSelectServiceTypes(indexServiceType);

      let indexPersone = this.listPersons.findIndex(item => item.id === this.company.techLeadId);
      if (indexPersone > -1) this.onSelectTechLead(indexPersone);

      let indexType = this.companyTypes.findIndex(item => item.value === this.company.clientType);
      if (indexType > -1) this.onSelectCompanyTypes(indexType);



      this.elRef.nativeElement.querySelector("#company-description").value = this.company.description;
      console.log('company', this.company);
      this.opened = true;
      //this.company.
    })
  }
  onAddShort() {
    if (!this.validate.isValidate(this.company)) return;
    console.log('company', this.company);
    this.companiesService.createCompany(this.company).subscribe(data => {
      console.log(' data', data);

    })
  }
  public onSelectCompanyTypes(index) {
    this.companyTypes.forEach(item => item.selected = false);
    this.companyTypes[index].selected = true;
    this.company.clientType = this.companyTypes[index].value;
    this.validate.resetType();
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

  public onChangePrimaryEmail() {
    this.validate.checkValidPrimaryEmail(this.company.contacts[0].primaryEmail);
  }
  public onChangeSubscribe(data) {
    data.forEach(item => this.company.contacts[0].subscription[item.field] = item.selected);
  }
  public onChangeName() {
    if (this.company.name && this.company.name.length > 0) {
      this.companiesService.checkCompanyName(this.company.id, this.company.name).subscribe((data: any) => {
        if (data.value) {
          this.validate.resetName();
        } else {
          this.validate.setNoValidName();
        }
      })
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
    this.company.addresses[0].timeZone = data;
  }
  public onChangeTags(tags) {
    console.log('tags',tags);
    /* tags.forEach((item) => {
       this.recurringState.getCreateTicket().addTag(item.id);
     })*/
  }
  public onChangeDescription(event) {
    this.company.description = event.target.value;
    //  this.recurringState.getCreateTicket().setDescription(event.target.value);
  }
  public onUpdateFull() {
    if (!this.validate.isValidate(this.company)) return;
    
    this.companiesService.updateCompany(this.company).subscribe(data => {
      console.log(' data', data);
    })
  }
  public onCroppImage() {
    this.imageCropperStateService.getConfirm().subscribe(data => {
      console.log('data', data);
      if (data.edit) {
        this.company.editLogo(data);
      } else {
        this.company.setLogo(data);
      }

    })
  }
  public onChangeAvatar() {
    this.downloadCompanyLogo().then(data => {
      const modalRef = this.modalService.open(ImageCropperComponent);
      modalRef.componentInstance.imageBase64 = data;
      modalRef.componentInstance.id = this.company.logo.origin.id;
    })
  }
  private getTehusers(list) {

    list.forEach((item) => {
      if (item.accountType === "TECH") {
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
  getCompanyLogoUrl() {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
      return this.company.logo.base64;
    } else if (!(this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id)) {
      return '/company/default/logo' + '.jpg';
    }
    return `/file/${this.company.logo.cropped.id}.jpg?t=${(this.company.logo.updatedAt ? this.company.logo.updatedAt :
      '')}`;
  };
  downloadCompanyLogo() {
    return new Promise((resolve, reject) => {
      if (this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
        resolve(this.company.logo.base64);
      } else if (this.company.logo && this.company.logo.cropped) {
        var req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.open('GET', `/file/${this.company.logo.origin.id}.jpg?t=${(this.company.logo.updatedAt ? this.company.logo.updatedAt : '')}`, true); /* Третий аргумент true означает асинхронность */
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
