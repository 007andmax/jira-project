import { EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { MapModalStateService } from 'src/app/states/map-modal/map-modal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';
import { CompanyInfoHistoryComponent } from '../../ticket-edit-aside-company-info/company-info-history/company-info-history.component';
import { TicketDetailContactDetailsHistoryComponent } from './ticket-detail-contact-details-history/ticket-detail-contact-details-history.component';

@Component({
  selector: 'ticket-detail-contact-details',
  templateUrl: './ticket-detail-contact-details.component.html',
  styleUrls: ['./ticket-detail-contact-details.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailContactDetailsComponent implements OnInit, OnDestroy {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @ViewChild('companyHistory') companyHistory: TicketDetailContactDetailsHistoryComponent;
  @Output() onClose = new EventEmitter<any>();
  company: Company;
  primaryContact: any;
  primaryAddress: any;
  primaryPhone: any;
  location: string;
  workingTime: string;
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,
    private mapModalStateService: MapModalStateService,
    public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
    console.log("company", this.company);
    this.getDataCompany();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.company = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
      this.getDataCompany();
    })
    this.sub.add(getOnCompanies);
  }
  getDataCompany() {
    if (this.company) {
      let primaryContact,
        primaryAddress,
        primaryPhone;
      if (this.company.companyInfo) {
        if (this.company.companyInfo.contacts) {
          this.company.companyInfo.contacts.sort((a, b) => a.priority - b.priority);
          primaryContact = this.usersStateService.getAllUsers().find(item => item.id === this.company.companyInfo.contacts[this.company.companyInfo.contacts.length - 1].id);
        }
        if (this.company.companyInfo.addresses) {
          for (let address of this.company.companyInfo.addresses) {
            if (address.isPrimary) primaryAddress = address;
          }
        }
        if (primaryAddress && primaryAddress.phoneNumbers.length) primaryPhone = primaryAddress.phoneNumbers[0];
        if (!this.company.companyInfo.workingTime) {
          this.workingTime = '';
        } else {
          let workingTime = this.company.companyInfo.workingTime[new Date().getDay() - 1];
          let startTime = workingTime.startTime / 3600;
          let typeTime = (startTime > 12) ? "PM" : "AM";
          startTime = (startTime > 12) ? startTime - 12 : startTime;
          var timeInMinutes = startTime * 60,
            hours = Math.floor(timeInMinutes / 60),
            minutes = Math.round(timeInMinutes - (hours * 60));
          this.workingTime = `${(hours < 10) ? '0' + hours : hours}:${(minutes < 10) ? '0' + minutes : minutes} ${typeTime}`;
        }
      }
      this.primaryContact = primaryContact;
      this.primaryAddress = primaryAddress;
      this.primaryPhone = primaryPhone;
      if (primaryAddress) {
        this.location = primaryAddress.addressWithSuitNumberAndPostalCode;
      } else {
        this.location = '';
      }
      if (this.company && this.ticketProfile.createdUser && this.companyHistory) {
        this.companyHistory.setUser(this.ticketProfile.createdUser);
        this.companyHistory.setCompany(this.company);
        this.companyHistory.onInitGetTickets();
      }
    }
  }
  checkExistUser() {
    return (this.ticketProfile.createdUser) ? this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id) : null;
  }
  getCompanyUser() {
    return this.companiesStateService.getCompanies().find(item => item.id === this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id).company.id);
  }
  onShowMap() {
    console.log("this.company.companyInfo.addresses", this.company.companyInfo.addresses);
    this.mapModalStateService.onSohwMap({
      latitude: this.company.companyInfo.addresses[0].locationLat,
      longitude: this.company.companyInfo.addresses[0].locationLng,
      title: this.company.companyInfo.addresses[0].longCity
    })
  }
  getPhoneNumbers() {
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
    if (user && user.phoneNumbers) return user.phoneNumbers;
    return [];
  }
  getPrimaryPhone() {
    return (this.primaryPhone && this.primaryPhone.number) ? this.primaryPhone.number : ''
  }
  checkLogo(company) {
    return (company && company.logo && company.logo.cropped && company.logo.cropped.id || company && company.logo && company.logo.origin && company.logo.origin.id)
  }
  getCompanyLogoUrl(company) {
    if (company && company.logo && company.logo && company.logo.base64 && !company.logo.cropped) return company.logo.base64;
    if (company && company.logo && company.logo.cropped && company.logo.cropped.id) return `/file/${company.logo.cropped.id}`;
    if (company && company.logo && company.logo.origin && company.logo.origin.id) return `/file/${company.logo.origin.id}`;
    return '/company/default/logo.jpg';
  }
  close() {
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
