import { Component, OnInit, ViewChild, Pipe, OnDestroy } from "@angular/core";

import { ReplaySubject, forkJoin, of, throwError, Subscription } from "rxjs";
import { takeUntil, catchError, debounceTime } from "rxjs/operators";

import { map } from "rxjs/operators";
import { CommissionService } from "../commission.service";
import { UsersService } from "src/app/services/users/users.service";
import { ToastrService } from "ngx-toastr";
import { FormControl } from "@angular/forms";
import { UsersStateService } from "src/app/states/users/users-state.service";
import { PermissionsService } from "src/app/services/permissions/permissions.service";
import { CompaniesStateService } from "src/app/states/company/companies-state.service";
import { CompanyCommissionFilter } from "./class/company-commission-filter";

@Component({
  selector: "app-company-commission",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"]
})
export class CompanyComponent implements OnInit, OnDestroy {
  clientsCompanies: any;
  currentCompany: any;
  currentUser: any;
  loading = true;
  users: any[] = [];
  usersByCompanies = [];
  activeTechUsers: any;
  filterTechUsers = "";
  selectedIdx = -1;
  filter: CompanyCommissionFilter = new CompanyCommissionFilter();

  sub: Subscription = new Subscription();
  config = {
    displayKey: "firstName",
    search: true,
    height: "auto",
    limitTo: 3,
    searchPlaceholder: "Search",
    searchOnKey: "firstName"
  };

  constructor(
    private commissionService: CommissionService,
    private userService: UsersService,
    private toastrService: ToastrService,
    private usersStateService: UsersStateService,
    private permissionsService: PermissionsService,
    private companiesStateService: CompaniesStateService
  ) { }


  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.currentUser = this.usersStateService.getCurrentUser();
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.currentUser = data;
    })
    // this.getClientCompanies();

    this.getUsers();
  }
  onFilter(field) {
    this.filter.onFilter(field, this.clientsCompanies);
  }
  /**
 * get users list
 */
  getUsers() {
    this.commissionService
      .getTechUsers()
      .pipe(
        map((users: any) => {
          return users.filter(
            (user: any) =>
              user.userEnabled
          );
        })
      )
      .subscribe(
        (techUsers: any) => {
          this.loading = false;
          this.activeTechUsers = techUsers;
          if (this.companiesStateService.getCompanies().length > 0) this.getCompanies(this.companiesStateService.getCompanies());
          let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
            this.getCompanies(data);
          })
          this.sub.add(getOnCompanies);

        },
        error => {
          this.loading = false;
        }
      );
  }

  /**
   * get full name based on first name and last name
   * @param client
   */
  getFullName(client) {
    if (client) {
      const isAllSpaces = client.lastName === "    ";
      if (client.lastName && !isAllSpaces) {
        return client.firstName + " " + client.lastName;
      } else {
        return client.firstName;
      }
    }
  }

  /**
   * updated tech user based on params
   * @param techLead
   * @param company
   */
  setTechLead(techLead: any, company: any) {
    if (!techLead || !company) {
      return;
    }
    const techLeadId = techLead[0].id;
    this.commissionService.setTechLead(company.id, techLeadId).subscribe(
      res => {
        this.toastrService.success("Techlead Changed Successfully");
      },
      error => {
        this.toastrService.error(`Error Occured, ${error}`);
      }
    );
  }

  /**
   * get client url
   * @param client
   */
  getClinetUrl(client) {
    if (client && client.avatar) {
      return `/users/${client.id}/image.jpg?t=${client.avatar.updatedAt}`;
    }
  }

  /**
   * selected active tech usres
   * @param company
   * @param i
   */
  selectedActiveTechUsers(company, i): any {
    if (company.techLeadId === null) {
      return [];
    }
    let techUser: any = [];
    if (this.activeTechUsers) {
      techUser = this.activeTechUsers.filter(client => {
        if (client.id === company.techLeadId) {
          //client.firstName = client.firstName + ' ' + client.lastName;
          return client;
        }
      });
    }
    return techUser;
  }

  selectedActiveTechUserURL(company, i): any {
    if (company.techLeadId === null) {
      return;
    }
    let techUser: any = [];
    if (this.activeTechUsers) {
      techUser = this.activeTechUsers.filter(client => {
        if (client.id === company.techLeadId) {
          if (client.firstName === "Edge") {

          }
          return client;
        }
      });
    }

    return techUser.length > 0 && techUser[0] && techUser[0].avatar
      ? `/users/${techUser[0].id}/image.jpg?t=${techUser[0].avatar.updatedAt}`
      : null;
  }

  /**
   * companies data
   */
  getCompanies(companys) {
    this.clientsCompanies = companys.filter(
      (company: any) =>
        company.clientType.toLowerCase() !== "vendor" &&
        company.deletedAt === null &&
        !company.isDefault
    ).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
      1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
  }

  selectedDropdown(i) {
    this.selectedIdx = i;
  }

  /**
   * get current company records - not used
   */
  getCurrentCompany() {
    this.commissionService.getCurrentCompany().subscribe(
      res => {
        this.currentCompany = res;
      },
      error => { }
    );
  }

  /**
   * get client company info - not used
   */
  getClientCompaniesInfo() {
    this.commissionService
      .getClientCompaniesInfo()
      .pipe(
        map((res: any) => {
          this.clientsCompanies = res.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ?
            1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
        }),
        catchError(err => throwError(new Error("Get Client Companies")))
      )
      .subscribe();
  }

  /**
   * get company logo url by company - not used
   * @param company
   */
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
      return "/company/default/logo" + ".jpg";
    }
    return (
      "/file/" +
      company.logo.cropped.id +
      ".jpg?t=" +
      (company.logo.updatedAt ? company.logo.updatedAt : "")
    );
  }

  displayFrstLstChar(user: any) {
    if (user) {
      const splitUser = user.split(" ");
      return [splitUser[0], splitUser[1]]
        .map(function (s) {
          if (s) {
            return s.charAt(0).toUpperCase();
          }
        })
        .join("");
    }
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  dropFrstLstChar(company: any) {
    if (company === null) {
      return;
    }

    return [company.firstName, company.lastName]
      .map(function (s) {
        if (s) {
          return s.charAt(0).toUpperCase();
        }
      })
      .join("");
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
