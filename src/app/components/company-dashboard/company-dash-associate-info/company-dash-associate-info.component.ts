import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CompanyProfile } from '../../companies/class/company-profile';

@Component({
  selector: 'company-dash-associate-info',
  templateUrl: './company-dash-associate-info.component.html',
  styleUrls: ['./company-dash-associate-info.component.scss']
})
export class CompanyDashAssociateInfoComponent implements OnInit {
  @Input() company: CompanyProfile;
  companies: Array<any> = [];
  sub: Subscription = new Subscription();
  constructor(private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    if (this.companiesStateService.getCompanies().length > 0) this.getClientsList(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.getClientsList(data);
    })
    this.sub.add(getOnCompanies);
  }
  public getClientsList(data) {
    this.companies = data.filter(item => item.accountType === 'CLIENT' && !item.deletedAt).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

  }
  getCompanyName(id) {
    return (this.companies.length > 0) ? this.companies.find(item => item.id === id).name : '';

  }
  getPhoneNumber(id) {
    if (this.companies.length === 0) return '';
    let company = this.companies.find(item => item.id === id);
    let primaryPhone, primaryAddress;
    if (company.companyInfo) {

      if (company.companyInfo.addresses) {
        for (let address of company.companyInfo.addresses) {
          if (address.isPrimary) primaryAddress = address;
        }
      }
      if (primaryAddress && primaryAddress.phoneNumbers.length) primaryPhone = primaryAddress.phoneNumbers[0];
    }
    return (primaryPhone && primaryPhone.number) ? primaryPhone.number : ''
  }

}
