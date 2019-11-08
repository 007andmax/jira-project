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

  public opened = false;
  public company: CompanyProfile = new CompanyProfile();
  public industries: Array<string> = [];
  public version: string = 'short';
  companyTypes = ['Client', 'Lead', 'Vendor'];
  phoneTypes = ['Office', 'Mobile', 'Fax'];
  paymentTerms = [new CompanySetting('COD', 0), new CompanySetting('7 days', 0), new CompanySetting('15 days', 0), new CompanySetting('30 days', 0)];
  serviceTypes = [new CompanySetting('Hourly', 'HOURLY'), new CompanySetting('Block time', 'BLOCK_TIME'), new CompanySetting('Semi managed', 'SEMI_MANAGED'), new CompanySetting('Fully managed', 'FULLY_MANAGED')];
  paymentMethods = ['Cash', 'Cheque', 'Debit Card', 'Credit Card', 'Wire Transfer'];
  listPersons = [];

  subscriptions: Array<CompanySubscription> = [new CompanySubscription('Ticket Updates', 'ticket'),
  new CompanySubscription('Ticket Manager', 'ticketManager'),
  new CompanySubscription('Invoice Updates', 'invoice')];
  //['Ticket Updates', 'Ticket Manager', 'Invoice Updates'];
  public showSelect = false;
  public validate: CompanyValdiate = new CompanyValdiate();
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
  onAddShort() {
    this.validate.isValidate(this.company);
    console.log('company', this.company);
   /* this.companiesService.createCompany(this.company).subscribe(data => {
      console.log(' data', data);
    })*/
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
  public onChangeSubscribe(data) {

    data.forEach(item => this.company.contacts[0].subscription[item.field] = item.selected);


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
    this.validate.isValidate(this.company);
  }
  public onCroppImage() {
    this.imageCropperStateService.getConfirm().subscribe(data => {
      console.log('data', data);
    })
  }
  public uploadFile(event) {
    console.log('event', event);
    if (event.target.value) {
      const file = event.target.files[0];
      console.log('file',file);
    
      this.changeFile(file).then((base64: string): any => {
        const modalRef = this.modalService.open(ImageCropperComponent);
        modalRef.componentInstance.imageBase64 = base64;
        event.target.value = null;
        this.companiesService.uploadAvatar(btoa(base64)).subscribe((data) => {
          console.log('data',data);
              })
      });
    } else alert('Nothing')
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
