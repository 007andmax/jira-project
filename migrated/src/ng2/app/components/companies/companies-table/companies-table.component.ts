import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { CompaniesStateService } from '../services/companies-state.service';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss']
})
export class CompaniesTableComponent implements OnInit {
  @Input() company: Company;
  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public primaryPhone: any;
  public location: string = '';
  public countUsers: number = 0;
  public showArchivedCompanies: boolean = false;
  constructor(private usersStateService: UsersStateService, private companiesStateService: CompaniesStateService) { }

  ngOnInit() {
    this.companiesStateService.getOnShowArchived().subscribe(data => {
      this.showArchivedCompanies = true;
    })
    if (this.usersStateService.getAllUsers().length > 0) {
      this.onGetUsersCount(this.usersStateService.getAllUsers());
    } else {
      this.usersStateService.getOnUsers().subscribe((data) => {
        this.showArchivedCompanies = false;
        this.onGetUsersCount(data);
      })
    }
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
  private onGetUsersCount(data) {

    let users = data;
    this.countUsers = users.filter((user) => {
      var isArchived = user.deletedAt || this.company.deletedAt;
      return !isArchived && !this.showArchivedCompanies && user.company.id === this.company.id || this.showArchivedCompanies && isArchived && user.company.id === this.company.id;
    }).length;
  }
  /*$scope.filterArchived = function (users, company) {
    return users.filter(function (user) {
      var isArchived = user.deletedAt || company.deletedAt;
      return !isArchived && !$rootScope.showArchivedCompanies || $rootScope.showArchivedCompanies && isArchived;
    })
  };*/
  getUserName() {
    return `${this.primaryContact.firstName} ${this.primaryContact.lastName}`;
  };
  getCompanyLogoUrl() {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
      return this.company.logo.base64;
    } else if (!(this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id)) {
      return '/company/default/logo.jpg';
    }
    return `/file/${this.company.logo.cropped.id}.jpg?t=${(this.company.logo.updatedAt ? this.company.logo.updatedAt :
      '')}`;
  };
}
