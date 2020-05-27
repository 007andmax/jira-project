import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';
import { TicketsListService } from '../services/tickets-list.service';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { MapModalStateService } from 'src/ng2/app/states/map-modal/map-modal-state.service';
import { CompanyInfoHistoryComponent } from './company-info-history/company-info-history.component';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Component({
  selector: 'app-ticket-edit-aside-company-info',
  templateUrl: './ticket-edit-aside-company-info.component.html',
  styleUrls: ['./ticket-edit-aside-company-info.component.scss'],
  providers: [TicketsListService]

})
export class TicketEditAsideCompanyInfoComponent implements OnInit {
  companyId: string;
  company: Company;
  lastUserId: string = '';
  lastCompanyId: string = '';
  @Input() createdUser: CurrentUser;
  @ViewChild('companyHistory') companyHistory:CompanyInfoHistoryComponent;
  @Input() set setCompanyId(value) {
    this.companyId = value;
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.companyId);
    console.log("this.company", this.company);
    if (this.company && this.createdUser && this.companyHistory && this.lastCompanyId !== this.company.id && this.lastUserId !== this.createdUser.id) {
      this.lastCompanyId = this.company.id;
      this.lastUserId = this.createdUser.id;
      this.companyHistory.onInitGetTickets();
     }

  };
  
 
  reputations = [1, 2, 3, 4, 5];
  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public location: string = '';
  public primaryPhone: any;
  public workingTime: string = '';
  constructor(private companiesStateService: CompaniesStateService,
    public ticketsListService: TicketsListService,
    private usersStateService:UsersStateService,
    private mapModalStateService: MapModalStateService) { }

  ngOnInit() {
   
  }
  ngDoCheck() {
    if (this.company) {
      let primaryContact,
        primaryAddress,
        primaryPhone;

      if (this.company.companyInfo) {
        if (this.company.companyInfo.contacts) {
          for (let contact of this.company.companyInfo.contacts) {
            if (!primaryContact || contact.priority > primaryContact.priority) primaryContact = contact;
          }
        }
        if (this.company.companyInfo.addresses) {
          for (let address of this.company.companyInfo.addresses) {
            if (address.isPrimary) primaryAddress = address;
          }
        }
        if (primaryAddress && primaryAddress.phoneNumbers.length) primaryPhone = primaryAddress.phoneNumbers[0];
        let workingTime = this.company.companyInfo.workingTime[new Date().getDay() - 1];

        let startTime = workingTime.startTime / 3600;
        let typeTime = (startTime > 12) ? "PM" : "AM";
        startTime = (startTime > 12) ? startTime - 12 : startTime;
        var timeInMinutes = startTime * 60,
          hours = Math.floor(timeInMinutes / 60),
          minutes = Math.round(timeInMinutes - (hours * 60));
        this.workingTime = `${(hours < 10) ? '0' + hours : hours}:${(minutes < 10) ? '0' + minutes : minutes} ${typeTime}`;
      }

      this.primaryContact = primaryContact;
      this.primaryAddress = primaryAddress;
      this.primaryPhone = primaryPhone;


      if (primaryAddress) {
        this.location = primaryAddress.addressWithSuitNumberAndPostalCode;
      } else {
        this.location = '';
      }

    }
   
  }
  getPhoneNumbers(userId) {
   let user =  this.usersStateService.getAllUsers().find(item => item.id === userId);
   if (user && user.phoneNumbers) return user.phoneNumbers;
   return [];
  }
  onShowMap() {
    this.mapModalStateService.onSohwMap({
      latitude: this.company.companyInfo.addresses[0].locationLat,
      longitude: this.company.companyInfo.addresses[0].locationLng,
      title: this.company.companyInfo.addresses[0].longCity
    })
  }
  getCompanyLogoUrl() {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) return this.company.logo.base64;
    if (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id) return `/file/${this.company.logo.cropped.id}`;
    if (this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id) return `/file/${this.company.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }

  checkLogo() {
    return (this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id || this.company && this.company.logo && this.company.logo.origin && this.company.logo.origin.id)
  }
}
