
import { CommonModule } from '@angular/common';
import { EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { MapModalStateService } from 'src/app/states/map-modal/map-modal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { TicketsListService } from '../../services/tickets-list.service';
import { TicketDetailContactDetailsHistoryComponent } from './ticket-detail-contact-details-history/ticket-detail-contact-details-history.component';
import * as moment from "moment";
import { PreviewPhoneMaskComponent } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.component';
import { TicketsTableItemRequestedByComponent } from '../../tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';

@Component({
  standalone: true,
  imports: [PreviewPhoneMaskComponent, TicketsTableItemRequestedByComponent, CommonModule],
  selector: 'ticket-detail-contact-details',
  templateUrl: './ticket-detail-contact-details.component.html',
  styleUrls: ['./ticket-detail-contact-details.component.scss'],
  providers: [TicketsListService]
})
export class TicketDetailContactDetailsComponent implements OnInit, OnDestroy {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @ViewChild('companyHistory', { static: true }) companyHistory: TicketDetailContactDetailsHistoryComponent;
  @Output() onClose = new EventEmitter<any>();
  company: Company;
  primaryContact: any;
  primaryAddress: any;
  primaryPhone: any;
  noPrimaryPhone: any;
  locationShipping: string;
  locationBilling: string;
  companyOpen: string = 'Close';
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  sub: Subscription = new Subscription();
  constructor(public companiesStateService: CompaniesStateService,
    private mapModalStateService: MapModalStateService,
    public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
    this.resetCompany();
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.resetCompany();
    })
    this.sub.add(getOnCompanies);
  }
  getShippingAddress() {
    return this.company.companyInfo.addresses.find(item => item.isPrimary);
  }
  getBillingAddress() {
    return this.company.companyInfo.addresses.find(item => !item.isPrimary);
  }
  public resetCompany() {
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
    this.getDataCompany();
  }
  getDataCompany() {
    if (this.company) {
      let primaryContact,
        primaryAddress,
        noPrimaryPhone,
        primaryPhone;
      if (this.company.companyInfo) {
        if (this.company.companyInfo.contacts) {
          this.company.companyInfo.contacts.sort((a, b) => a.priority - b.priority);
          primaryContact = this.usersStateService.getAllUsers().find(item => item.id === this.company.companyInfo.contacts[this.company.companyInfo.contacts.length - 1].id);
        }
        if (this.company.companyInfo.addresses) {
          for (let address of this.company.companyInfo.addresses) {
            if (address.isPrimary) {
              primaryAddress = address;
              this.locationBilling = address.addressWithSuitNumberAndPostalCode;
            }
            if (!address.isPrimary) {
              if (address.phoneNumbers.length) noPrimaryPhone = address.phoneNumbers[0];
              this.locationShipping = address.addressWithSuitNumberAndPostalCode;
            }
          }
        }
        if (primaryAddress && primaryAddress.phoneNumbers.length) primaryPhone = primaryAddress.phoneNumbers[0];
        if (this.company.companyInfo.workingTime) {
          let day = moment(new Date()).format('dddd');
          let workingDays: any = this.company.companyInfo.workingTime;
          if (workingDays.length !== 0) {
            workingDays.forEach((element, index) => {
              if (element.isSelected) {
                element.timing = `${this.timeFormatter(element.startTime)} ${this.getTimeFormat(element.startTime)} - ${this.timeFormatter(element.endTime)} ${this.getTimeFormat(element.endTime)}`
              }
            });
            let arr = workingDays.filter(val => val.dayOfWeek.toLowerCase() === day.toLowerCase())
            if (arr.length !== 0 && arr[0].isSelected) {
              this.companyOpen = (arr[0].timing) ? `Opens ${arr[0].timing}` : 'Opens';
            } else {
              this.companyOpen = `Close`;
            }
          }
        }
      }
      this.primaryContact = primaryContact;
      this.primaryAddress = primaryAddress;
      this.primaryPhone = primaryPhone;
      this.noPrimaryPhone = noPrimaryPhone;
      if (this.company && this.ticketProfile.createdUser && this.companyHistory) {
        this.companyHistory.setUser(this.ticketProfile.createdUser);
        this.companyHistory.setCompany(this.company);
        this.companyHistory.onInitGetTickets();
      }
    }
  }
  getTimeFormat(time) {
    if (time && time > 0) {
      var timeInHour = time / 3600;
      // var timeInHour = time / 60;
      if (timeInHour < 12) {
        return 'AM';
      } else {
        return 'PM';
      }
    } else {
      return 'AM';
    }
  }
  timeFormatter(time) {
    if (time && time > 0) {
      var seconds = time > 43200 ? time - 43200 : time;
      var hours = Math.floor(seconds / 3600);
      var hoursToReturn = hours.toString().length > 1 ? hours : '0' + hours;
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var minutesToreturn = minutes.toString().length > 1 ? minutes : '0' + minutes;
      return hoursToReturn + ':' + minutesToreturn;
    } else {
      return "12:00";
    }
  }
  checkExistUser() {
    return (this.ticketProfile.createdUser) ? this.usersStateService.getAllUsers().find(user => user.id === this.ticketProfile.createdUser.id) : null;
  }
  getCompanyUser() {
    return this.companiesStateService.getCompanies().find(item => this.ticketProfile.company.id === item.id);
  }
  onShowMap(addresses) {
    this.mapModalStateService.onSohwMap({
      latitude: addresses.locationLat,
      longitude: addresses.locationLng,
      title: addresses.longCity
    })
  }
  public trackByIndex(index, item) {
    return index;
  }
  getPhoneNumbers() {
    let user = this.usersStateService.getAllUsers().find(item => item.id === this.ticketProfile.createdUser.id);
    if (user && user.phoneNumbers) return user.phoneNumbers;
    return [];
  }
  getPrimaryPhone() {
    return (this.primaryPhone && this.primaryPhone.number) ? this.primaryPhone.number : ''
  }
  getNoPrimaryPhone() {
    return (this.noPrimaryPhone && this.noPrimaryPhone.number) ? this.noPrimaryPhone.number : ''
  }
  checkLogo(company) {
    return (company && company.logo && company.logo.cropped && company.logo.cropped.id || company && company.logo && company.logo.origin && company.logo.origin.id)
  }
  close() {
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
