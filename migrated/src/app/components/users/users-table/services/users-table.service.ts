import { Injectable } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Injectable()
export class UsersTableService {

  constructor(private companiesStateService: CompaniesStateService) { }

  getUsersCount(users, companyId, showArchivedUsers) {
    let company = this.companiesStateService.getCompanies().find(item => item.id === companyId);
    return users.filter((user) => {
      var isArchived = user.deletedAt || company.deletedAt;
      return !isArchived && !showArchivedUsers && user.company.id === company.id || showArchivedUsers && isArchived && user.company.id === company.id;
    }).length;
  }
}
