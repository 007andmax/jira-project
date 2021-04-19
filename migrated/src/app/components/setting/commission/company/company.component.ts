import { Component, OnInit, ViewChild, Pipe } from "@angular/core";

import { ReplaySubject, forkJoin, of, throwError } from "rxjs";
import { takeUntil, catchError, debounceTime } from "rxjs/operators";

import { map } from "rxjs/operators";
import { CommissionService } from "../commission.service";
import { UsersService } from "src/app/services/users/users.service";
import { ToastrService } from "ngx-toastr";
import { NgSelectComponent } from "@ng-select/ng-select";
import { FormControl } from "@angular/forms";

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
  filterTechUsers = "";
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
  ) { }

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
    this.loading = true; $(".loading").css("display", "block");
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
          this.loading = false; $(".loading").css("display", "none");
          this.activeTechUsers = techUsers;
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
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

    const techLeadId = techLead.id;
    this.loading = true; $(".loading").css("display", "block");
    this.commissionService.setTechLead(company.id, techLeadId).subscribe(
      res => {
        this.loading = false; $(".loading").css("display", "none");
        this.toastrService.success("Techlead Changed Successfully");
      },
      error => {
        this.loading = false; $(".loading").css("display", "none");
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
    let techUser: any = [];
    if (this.activeTechUsers) {
      techUser = this.activeTechUsers.filter(client => {
        if (client.id === company.techLeadId) {
          //client.firstName = client.firstName + ' ' + client.lastName;
          return client;
        }
      });
    }

    return techUser.length > 0 && techUser[0] ? techUser[0].firstName : null;
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
  getCompanies() {
    this.loading = true; $(".loading").css("display", "block");
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
          this.loading = false; $(".loading").css("display", "none");
          if (custCompany) {
            this.clientsCompanies = custCompany;

          }
        },
        error => {
          this.loading = false; $(".loading").css("display", "none");
        }
      );
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
        .map(function (s) {
          if (s) {
            return s.charAt(0).toUpperCase();
          }
        })
        .join("");
    }
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
}
