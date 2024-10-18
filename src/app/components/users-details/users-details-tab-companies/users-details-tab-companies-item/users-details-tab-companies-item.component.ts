import { Component, Input, OnInit } from '@angular/core';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { UserDefaultSubscription } from 'src/app/components/users/class/user-default-subscription';
import { Company } from 'src/app/interfaces/company/company';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Component({
  selector: 'app-users-details-tab-companies-item',
  templateUrl: './users-details-tab-companies-item.component.html',
  styleUrls: ['./users-details-tab-companies-item.component.scss']
})
export class UsersDetailsTabCompaniesItemComponent implements OnInit {
  @Input() customerCompaniesInfo: UserCustomerCompaniesInfo;
  selectedCompany: Company;
  defaultSubscriptions: UserDefaultSubscription = new UserDefaultSubscription(null);
  constructor(private companiesStateService: CompaniesStateService,) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id == this.customerCompaniesInfo.companyId);
    this.defaultSubscriptions = this.customerCompaniesInfo.defaultSubscriptions;

  }

}
