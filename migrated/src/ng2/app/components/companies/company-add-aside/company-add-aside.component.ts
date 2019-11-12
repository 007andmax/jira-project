import { Component, OnInit, ElementRef } from '@angular/core';

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
  companyTypes = ['Client', 'Lead', 'Vendor'];
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
  constructor(private companiesStateService: CompaniesStateService, private companiesService: CompaniesService,
    private usersStateService: UsersStateService, private modalService: NgbModal, private imageCropperStateService: ImageCropperStateService,
    private elRef: ElementRef) { }

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

  onAddShort() {
    if (!this.validate.isValidate(this.company)) return;
    console.log('company', this.company);
    this.companiesService.createCompany(this.company).subscribe(data => {
      console.log(' data', data);
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
  public onSelectType(item) {
    this.company.clientType = item.toUpperCase();
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
      if (item.accountType === "TECH") this.listPersons.push(item);
    })
    console.log('this.listPersons', this.listPersons);
  }
  private getIndustries() {
    this.companiesService.getIndustries().subscribe((data: Array<string>) => {
      this.industries = data;
      console.log('industries', this.industries);
    })
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
