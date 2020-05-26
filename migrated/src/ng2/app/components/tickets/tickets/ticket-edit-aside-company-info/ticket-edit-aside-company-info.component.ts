import { Component, OnInit, Input } from '@angular/core';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';
import { TicketsListService } from '../services/tickets-list.service';

@Component({
  selector: 'app-ticket-edit-aside-company-info',
  templateUrl: './ticket-edit-aside-company-info.component.html',
  styleUrls: ['./ticket-edit-aside-company-info.component.scss'],
  providers: [TicketsListService]
  
})
export class TicketEditAsideCompanyInfoComponent implements OnInit {
  companyId: string;
  company: Company;
  @Input() set setCompanyId(value) {
    this.companyId = value;
    this.company = this.companiesStateService.getCompanies().find(item => item.id === this.companyId);
console.log("this.company",this.company);
console.log("this.companyId",this.companyId);
  };
  reputations = [1, 2, 3, 4, 5];
  public primaryContact: CompanyAndressContact;
  public primaryAddress: CompanyAndress;
  public location: string = '';
  public primaryPhone: any;
  constructor(private companiesStateService: CompaniesStateService,
    public ticketsListService:TicketsListService) { }

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
