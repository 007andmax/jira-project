import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  agreementRelatedPermissions = ['EDIT_SERVICE_AGREEMENTS', 'DELETE_SERVICE_AGREEMENTS'];
  userRelatedPermissions = ['CREATE_USERS', 'EDIT_USERS', 'ARCHIVE_USERS'];
  ticketRelatedPermissions = ['EDIT_ANOTHER_USERS_TICKET', 'REOPEN_CLOSED_TICKETS', 'DELETE_TICKETS'];
  accountingRelatedPermissions = ['CREATE_INVOICE', 'ROLLBACK_INVOICE'];
  productsRelatedPermissions = ['MANAGE_PRODUCTS'];
  passwordsRelatedPermissions = [
    'VIEW_PASSWORD',
    'CREATE_PASSWORD',
    'EDIT_PASSWORD',
    'DELETE_PASSWORD'
  ];
  viewPasswordsRelatedPermissions = ['CREATE_PASSWORD', 'EDIT_PASSWORD'];
  viewDocumentsRelatedPermissions = ['CREATE_DOCUMENT', 'EDIT_DOCUMENT'];
  editCategoryDocumentsRelatedPermissions = ['DELETE_CATEGORY'];
  sections = {
    'Tickets Area': [
      'COMPLETE_EXPENSE',
      'TICKET_REVIEW',
      'EDIT_TICKETS',
      'EDIT_ANOTHER_USERS_TICKET',
      'REOPEN_CLOSED_TICKETS',
      'DELETE_TICKETS',
      'CREATE_TICKET_NOTE_TEMPLATE',
      'EDIT_TICKET_NOTE_TEMPLATE',
      'DELETE_TICKET_NOTE_TEMPLATE'
    ],
    'Company Area': [
      'VIEW_COMPANIES',
      'CREATE_COMPANIES',
      'EDIT_COMPANIES',
      'ARCHIVE_COMPANIES',
      'VIEW_USERS',
      'CREATE_USERS',
      'EDIT_USERS',
      'ARCHIVE_USERS',
      'CREATE_GLOBAL_USER_FILTER',
      'EDIT_GLOBAL_USER_FILTER',
      'DELETE_GLOBAL_USER_FILTER'
    ],
    Accounting: [
      'VIEW_ACCOUNTING',
      'CREATE_INVOICE',
      'ROLLBACK_INVOICE',
      'MANAGE_PRODUCTS',
      'VIEW_PRODUCT_COST',
      'MANAGE_SERVICES',
      'VIEW_SERVICE_AGREEMENTS',
      'EDIT_SERVICE_AGREEMENTS',
      'DELETE_SERVICE_AGREEMENTS',
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
      'VIEW_DEVICES_REPORTS',
      'VIEW_TICKET_REPORT'
    ],
    Settings: [
      'VIEW_COMPANY_PROFILE_SETTINGS',
      'VIEW_TECH_USERS_SETTINGS',
      'VIEW_PERMISSIONS_SETTINGS',
      'VIEW_EMAIL_SETTINGS',
      'VIEW_TAXES_SETTINGS',
      'VIEW_EMAIL_TEMPLATES_SETTINGS',
      'VIEW_TAGS_SETTINGS',
      'VIEW_TICKET_SETTINGS',
      'VIEW_PRODUCT_CATEGORY_SETTINGS',
      'VIEW_CRM_SETTINGS',
      'VIEW_ACCOUNTING_SETTINGS'
    ],
    Documents: [
      'VIEW_DOCUMENT',
      'CREATE_DOCUMENT',
      'EDIT_DOCUMENT',
      'DELETE_DOCUMENT',
      'CREATE_CATEGORY',
      'EDIT_CATEGORY',
      'DELETE_CATEGORY',
      'CREATE_TEMPLATE',
      'EDIT_TEMPLATE',
      'DELETE_TEMPLATE'
    ],
    "Tasks Area": [
      'DELETE_TASK'
    ],
    "Integrations": [
      'MANAGE_INTEGRATIONS'
    ]
  };

  sectionsCustomPermission = {
    'Tickets Area': [
      'VIEW_ALL_TICKETS',
      'EDIT_OTHER_TICKETS'
    ],
    'Users': [
      'EDIT_USERS'
    ],
    Devices: ['VIEW_ALL_DEVICES',
      'DEVICES_REMOTE_CONTROL'],
    'Invoices': [
      'VIEW_ALL_INVOICES'
    ],
    'Quotes': [
      'VIEW_ALL_QUOTES'
    ],
    'Payments': [
      'VIEW_ALL_PAYMENTS'
    ]
  };


  constructor(private http: HttpClient) { }

  /**
   * permission on companies
   */
  getCompaniesRelatedPermissions() {
    return this.companiesRelatedPermissions.slice();
  }
  /**
     * permission on users
     */
  getAgreementRelatedPermissions() {
    return this.agreementRelatedPermissions.slice();
  }
  /**
   * permission on users
   */
  getUserRelatedPermissions() {
    return this.userRelatedPermissions.slice();
  }
  /**
 * permission on tickets
 */
  getTicketRelatedPermissions() {
    return this.ticketRelatedPermissions.slice();
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

  getViewDocumentsRelatedPermissions() {
    return this.viewDocumentsRelatedPermissions.slice();
  }
  getEditCategoryDocumentsRelatedPermissions() {
    return this.editCategoryDocumentsRelatedPermissions.slice();
  }


  getsections() {
    return this.sections;
  }
  getSectionsCustomPermission() {
    return this.sectionsCustomPermission;
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
    return this.http.get(`${this.apiUrl}settings/companyProfile/getTechRoleNames`);
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

  deleteTechRole(roleId) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {
        if (xhr.status == 200) resolve(xhr);
        if (xhr.status != 200) reject(xhr);
      }, false);
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);
      xhr.open("DELETE", `${this.apiUrl}settings/companyProfile/deleteTechRole/${roleId}`);
      xhr.send();
    });
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
}
