import { Component, OnInit, ViewChild, Pipe } from "@angular/core";

import { ReplaySubject, forkJoin, of, throwError } from "rxjs";
import { takeUntil, catchError } from "rxjs/operators";

import { map } from "rxjs/operators";
import { CommissionService } from "../commission.service";
import { UsersService } from "src/ng2/app/services/users/users.service";
import { ToastrService } from "ngx-toastr";
import { NgSelectComponent } from "@ng-select/ng-select";

@Component({
  selector: "app-company-commission",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"]
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
  selectedIdx = -1;
 
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
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.currentUser;
    // this.getClientCompanies();
    this.getCompanies();
    this.getUsers();
  }

  /**
   * get users list
   */
  getUsers() {
    this.loading = true;
    this.commissionService
      .getUsers()
      .pipe(
        map((users: any) => {
          return users.filter(
            (user: any) =>
              user.accountType.toLowerCase() === "tech" &&
              user.deletedAt === null &&
              user.userEnabled
          );
        })
      )
      .subscribe(
        (techUsers: any) => {
          this.loading = false;
          this.activeTechUsers = techUsers;
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
   * set tech lead
   * @param event
   * @param company
   */
  setTechLead(event: any, company: any) {
    if (!event || !company) {
      return;
    }
    const techLeadId = event.id;
    this.loading = true;
    this.commissionService.setTechLead(company.id, techLeadId).subscribe(
      res => {
        this.loading = false;
        this.toastrService.success("Techlead Changed Successfully");
      },
      error => {
        this.loading = false;
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
      return;
    }

    const techUser = this.activeTechUsers.filter(client => {
      if (client.id === company.techLeadId) {
        //client.firstName = client.firstName + ' ' + client.lastName;
        return client;
      }
    });

    return techUser[0] ? techUser[0].firstName : null;
  }

  /**
   * companies data
   */
  getCompanies() {
    this.loading = true;
    this.commissionService
      .getCompanies()
      .pipe(
        map((companys: any) => {
          return companys.filter(
            (company: any) =>
              company.clientType.toLowerCase() !== "vendor" &&
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
          }
        },
        error => {
          this.loading = false;
        }
      );
  }

  selectedDropdown(i){
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
      error => {}
    );
  }

  /**
   * get client company info - not used
   */
  getClientCompaniesInfo() {
    this.commissionService
      .getClientCompaniesInfo()
      .pipe(
        map(res => {
          this.clientsCompanies = res;
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
        .map(function(s) {
          if (s) {
            return s.charAt(0).toUpperCase();
          }
        })
        .join("");
    }
  }
  dropFrstLstChar(user: any) {
    if (user) {
      return [user.firstName, user.lastName]
        .map(function(s) {
          if (s) {
            return s.charAt(0).toUpperCase();
          }
        })
        .join("");
    }
  }
}
