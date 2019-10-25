import { Component, OnInit, ViewChild, Pipe } from '@angular/core';

import { ReplaySubject, forkJoin, of, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';

import { map } from 'rxjs/operators';
import { CommissionService } from '../commission.service';
import { UsersService } from 'src/ng2/app/services/users/users.service';

@Component({
  selector: 'app-company-commission',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  clientsCompanies: any;
  currentCompany: any;
  currentUser: any;
  loading = false;
  users: any[] = [];
  usersByCompanies = [];
  activeTechUsers: any;
  filterTechUsers: any;

  config = {
    displayKey: 'firstName',
    search: true,
    height: 'auto',
    limitTo: 3,
    moreText: 'more',
    searchPlaceholder: 'Search',
    searchOnKey: 'firstName'
  };

  constructor(
    private commissionService: CommissionService,
    private userService: UsersService
  ) {
    // this.getCurrentCompany();
  }

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    // this.getClientCompanies();
    this.getCompanies();
    this.getUsers();
  }

  getUsers() {
    this.commissionService
      .getUsers()
      .pipe(
        map((users: any) => {
          return users.filter(
            (user: any) =>
              user.accountType.toLowerCase() === 'tech' &&
              user.deletedAt === null &&
              user.userEnabled
          );
        })
      )
      .subscribe((techUsers: any) => {
        this.activeTechUsers = techUsers;
        console.log(this.activeTechUsers);
        // this.activeTechUsers = techUsers.map(({ id, firstName}) => ({
        //   id,
        //   firstName,
        // }));
      });
  }

  getFullName(client) {
    if (client) {
      const isAllSpaces = client.lastName === '    ';
      if (client.lastName && !isAllSpaces) {
        return client.firstName + ' ' + client.lastName;
      } else {
        return client.firstName;
      }
    }
  }

  setTechLead(event: any, company: any) {
    if (!event || !company) {
      return;
    }
    const techLeadId = event.id;
    this.commissionService
      .setTechLead(company.id, techLeadId)
      .subscribe(res => {}, error => {});
  }

  getClinetUrl(client) {
    if (client && client.avatar) {
      return `/users/${client.id}/image.jpg?t=${client.avatar.updatedAt}`;
    }
  }

  selectedActiveTechUsers(company, i) {
    if (company.techLeadId === null) {
      return;
    }

    const aa = this.activeTechUsers.filter(client => {
      if (client.id === company.techLeadId) {
        return client.firstName;
      }
    });

    return aa[0].firstName;
  }

  getCompanies() {
    this.loading = true;
    this.commissionService
      .getCompanies()
      .pipe(
        map((companys: any) => {
          return companys.filter(
            (company: any) =>
              company.clientType.toLowerCase() !== 'vendor' &&
              company.deletedAt === null &&
              !company.isDefault
          );
        })
      )
      .subscribe(
        (custCompany: any) => {
          this.loading = false;
          if (custCompany) {
            this.clientsCompanies = custCompany;
            console.log(this.clientsCompanies);
          }
        },
        error => {
          this.loading = false;
        }
      );
  }

  getCurrentCompany() {
    this.commissionService.getCurrentCompany().subscribe(
      res => {
        this.currentCompany = res;
      },
      error => {}
    );
  }

  getClientCompaniesInfo() {
    this.commissionService
      .getClientCompaniesInfo()
      .pipe(
        map(res => {
          this.clientsCompanies = res;
          console.log(this.clientsCompanies);
        }),
        catchError(err => throwError(new Error('get client companies')))
      )
      .subscribe();
  }

  getCompanyLogoUrl(company: any) {
    if (
      company &&
      company.logo &&
      company.logo &&
      company.logo.base64 &&
      !company.logo.cropped
    ) {
      return company.logo.base64;
    } else if (
      !(
        company &&
        company.logo &&
        company.logo.cropped &&
        company.logo.cropped.id
      )
    ) {
      return '/company/default/logo' + '.jpg';
    }
    return (
      '/file/' +
      company.logo.cropped.id +
      '.jpg?t=' +
      (company.logo.updatedAt ? company.logo.updatedAt : '')
    );
  }



  

  ngOnDestroy() {
    // this._onDestroy.next();
    // this._onDestroy.complete();
  }
}
