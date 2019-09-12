import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

@Component({
  selector: 'app-companies-table',
  templateUrl: './companies-table.component.html',
  styleUrls: ['./companies-table.component.scss']
})
export class CompaniesTableComponent implements OnInit {
  @Input() company: Company;
  public primaryContact:CompanyAndressContact;
  public primaryAddress:CompanyAndress;
  public primaryPhone:any;
  public location:string = '';
  constructor() { }

  ngOnInit() {
    if(this.company) {
      var primaryContact,
        primaryAddress,
        primaryPhone;

      if (this.company.companyInfo) {


        if (this.company.companyInfo.contacts) {
          for (var i = 0; i < this.company.companyInfo.contacts.length; i++) {
            if (!primaryContact || this.company.companyInfo.contacts[i].priority > primaryContact.priority)
              primaryContact = this.company.companyInfo.contacts[i];
          }
        }


        for (var i = 0; i < this.company.companyInfo.addresses.length; i++) {
          if (this.company.companyInfo.addresses[i].isPrimary) {
            primaryAddress = this.company.companyInfo.addresses[i];
          }
        }

        if (primaryAddress && primaryAddress.phoneNumbers.length) {
          primaryPhone = primaryAddress.phoneNumbers[0];
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
    }
  }
  $scope.filterArchived = function (users, company) {
    return users.filter(function (user) {
      var isArchived = user.deletedAt || company.deletedAt;
      return !isArchived && !$rootScope.showArchivedCompanies || $rootScope.showArchivedCompanies && isArchived;
    })
  };
  getUserName  () {
    return `${this.primaryContact.firstName} ${this.primaryContact.lastName}`;
  };
  getCompanyLogoUrl () {
    if (this.company && this.company.logo && this.company.logo && this.company.logo.base64 && !this.company.logo.cropped) {
      return this.company.logo.base64;
    } else if (!(this.company && this.company.logo && this.company.logo.cropped && this.company.logo.cropped.id)) {
      return '/company/default/logo.jpg';
    }
    return `/file/${this.company.logo.cropped.id}.jpg?t=${(this.company.logo.updatedAt ? this.company.logo.updatedAt :
      '')}`;
  };
}
