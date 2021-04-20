import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UsersService } from 'src/app/services/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionManageService {
  private apiUrl = environment.apiUrl;
  companiesRelatedPermissions = [
    'CREATE_COMPANIES',
    'EDIT_COMPANIES',
    'ARCHIVE_COMPANIES',
    'NETWORK_SCAN_CLIENTS',
    'REMOTE_CONNECTIONS',
    'MODIFY_SETTINGS',
    'VIEW_PASSWORD_SECTION',
    'CREATE_PASSWORD',
    'EDIT_PASSWORD'
  ];

  userRelatedPermissions = ['CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'];
  accountingRelatedPermissions = ['CREATE_INVOICE'];
  productsRelatedPermissions = ['MANAGE_PRODUCTS'];
  passwordsRelatedPermissions = [
    'VIEW_PASSWORD',
    'CREATE_PASSWORD',
    'EDIT_PASSWORD',
    'DELETE_PASSWORD'
  ];
  viewPasswordsRelatedPermissions = ['CREATE_PASSWORD', 'EDIT_PASSWORD'];
  sections = {
    'Tickets Area': [
      'EDIT_TICKETS',
      'DELETE_TICKETS',
      'REOPEN_CLOSED_TICKETS',
      'EDIT_ANOTHER_USERS_TICKET'
    ],
    'Company Area': [
      'VIEW_COMPANIES',
      'CREATE_COMPANIES',
      'EDIT_COMPANIES',
      'ARCHIVE_COMPANIES',
      'VIEW_USERS',
      'CREATE_USERS',
      'EDIT_USERS',
      'ARCHIVE_USERS'
    ],
    Accounting: [
      'VIEW_ACCOUNTING',
      'CREATE_INVOICE',
      'MANAGE_PRODUCTS',
      'VIEW_PRODUCT_COST',
      'MANAGE_SERVICES',
      'VIEW_TICKET_AND_INVOICE_SETTINGS',
      'DELETE_SERVICE_AGREEMENTS',
      'VIEW_SERVICE_AGREEMENTS',
      'VIEW_ACCOUNTING_DASHBOARD'
    ],
    Devices: ['NETWORK_SCAN_CLIENTS', 'REMOTE_CONNECTIONS', 'MODIFY_SETTINGS'],
    Passwords: [
      'VIEW_PASSWORD_SECTION',
      'VIEW_PASSWORD',
      'CREATE_PASSWORD',
      'EDIT_PASSWORD',
      'DELETE_PASSWORD'
    ],
    'Quick Support': ['ALLOW_QUICK_CONNECT'],
    Reports: [
      'VIEW_SALES_REPORT',
      'VIEW_FINANCIAL_REPORT',
      'VIEW_PERFORMANCE_REPORT',
      'VIEW_REMOTE_ACCESS_REPORT',
      'VIEW_TAXES_REPORT',
      'VIEW_DEVICES_REPORTS'
    ],
    Settings: [
      'VIEW_COMPANY_PROFILE_SETTINGS',
      'VIEW_TECH_USERS_SETTINGS',
      'VIEW_PERMISSIONS_SETTINGS',
      'VIEW_EMAIL_SETTINGS',
      'VIEW_TAXES_SETTINGS',
      'VIEW_EMAIL_TEMPLATES_SETTINGS',
      'VIEW_TAGS_SETTINGS'
    ]
  };

  constructor(private http: HttpClient) { }

  // getOnebyId(id: string): any {
  //   this.userService
  //     .getAllusers()
  //     .pipe(
  //       map((users: any) => {
  //         return users.filter(
  //           (user: any) => user.id === id && user.deletedAt === null
  //         );
  //       })
  //     )
  //     .subscribe();
  // }

  /**
   * permission on companies
   */
  getCompaniesRelatedPermissions() {
    return this.companiesRelatedPermissions.slice();
  }

  /**
   * permission on users
   */
  getUserRelatedPermissions() {
    return this.userRelatedPermissions.slice();
  }

  /**
   * permission on accouting
   */
  getAccountingRelatedPermissions() {
    return this.accountingRelatedPermissions.slice();
  }

  /**
   * permission on products
   */
  getProductsRelatedPermissions() {
    return this.productsRelatedPermissions.slice();
  }

  /**
   * permission on passwords
   */
  getPasswordsRelatedPermissions() {
    return this.passwordsRelatedPermissions.slice();
  }

  /**
   * permission on view passwords
   */
  getViewPasswordsRelatedPermissions() {
    return this.viewPasswordsRelatedPermissions.slice();
  }

  getsections() {
    return this.sections;
  }

  /**
   * get permissions
   */
  getPermissions() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/permissions`);
  }

  /**
   * saved role
   * @param role
   */
  permissions(role) {
    return this.http.post(
      `${this.apiUrl}settings/companyProfile/permissions`,
      role
    );
  }

  /**
   * get role names
   */
  getRoleNames() {
    return this.http.get(`${this.apiUrl}settings/companyProfile/getRoleNames`);
  }

  /**
   * created tech role
   * @param newRole
   */
  createTechRole(newRole: any) {
    return this.http.post(
      `${this.apiUrl}settings/companyProfile/createTechRole`,
      newRole
    );
  }

  /**
   * delete tech role based on params
   * @param roleId
   */
  deleteTechRole(roleId: string) {
    return this.http.delete(
      `${this.apiUrl}settings/companyProfile/deleteTechRole/${roleId}`
    );
  }

  /**
   * updated tech role based on params
   * @param roleId
   * @param newTechRoleName
   */
  updateTechRole(roleId: string, newTechRoleName: string) {
    return this.http.put(
      `${this.apiUrl}settings/companyProfile/updateTechRoleName/${roleId}`,
      { newTechRoleName }
    );
  }

  /**
   * saved
   * @param user
   */
  save(user) {
    return this.http.put(`${this.apiUrl}users/${user.id}`, user);
  }

  // private log(message: string) {
  //   console.error("PizzaService: " + message);
  // }

  // private handleError<T>(operation = "operation", result?: T) {
  //   return (error: any): Observable<T> => {
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     console.error(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
}
