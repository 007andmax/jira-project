import { Injectable } from '@angular/core';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';

@Injectable()
export class UsersTableService {

  constructor(private companiesStateService: CompaniesStateService) { }

  getUsersCount(users, clientCompanies, showArchivedUsers) {
    let company = this.companiesStateService.getCompanies().find(item => clientCompanies.find(clientCompany => clientCompany === item.id));
    return users.filter((user) => {
      var isArchived = user.deletedAt || company.deletedAt;
      return !isArchived && !showArchivedUsers && user.clientCompanies.find(clientCompany => clientCompany === company.id) || showArchivedUsers && isArchived && user.clientCompanies.find(clientCompany => clientCompany === company.id);
    }).length;
  }
}
