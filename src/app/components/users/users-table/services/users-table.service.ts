import { Injectable } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Injectable()
export class UsersTableService {

  constructor(private companiesStateService: CompaniesStateService) { }

  getUsersCount(users, customerCompaniesInfo, showArchivedUsers) {
    let company = this.companiesStateService.getCompanies().find(item => customerCompaniesInfo.find(clientCompany => clientCompany.companyId === item.id));
    return users.filter((user) => {
      var isArchived = user.deletedAt || company.deletedAt;
      return !isArchived && !showArchivedUsers && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === company.id) || showArchivedUsers && isArchived && user.customerCompaniesInfo.find(clientCompany => clientCompany.companyId === company.id);
    }).length;
  }
}
