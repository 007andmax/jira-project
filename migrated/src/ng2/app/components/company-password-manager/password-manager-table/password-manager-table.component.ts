import { Component, Input, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { ISubscription } from "rxjs/Subscription";

import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";

/**
 * Password manager data table component
 */
@Component({
  selector: 'app-company-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss']
})
export class CompanyPasswordManagerTableComponent implements OnInit {

  @Input() selectedCompany: any;
  @Input() selectedUserOrDevice: any;
  @Input() selectedDate: any;
  @Input() selectedCategory: any;
  @Input() addNewRecords: Subject<boolean>;
  @Input() showDataTable: Subject<boolean>;
  private subGetRecords: ISubscription;
  private subAddNewRecords: ISubscription;
  public recordsData: any;
  public sort: string = 'companyName';
  public direction: string = null;

  /**
   * Creates an instance of the PasswordManagerTableComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService
  ) { }

  /**
   * Initializes Password manager data table. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getRecords();
    this.getSelectedCategory();
    this.subAddNewRecords = this.addNewRecords.subscribe(v => {
      console.log('this.selectedCompany.id',this.selectedCompany);
      this.apiPasswordManagerService.getCompanyRecords(this.selectedCompany.id);

    });
    this.watchDeleteRecord();
    this.onSort();
  }

  private onSort() {
    this.passwordManagerService.getOnSort().subscribe((data) => {

      this.sort = data.sort;
      this.direction = data.direction;

      //  this.cd.detectChanges();
    })
  }

  /**
   * Get selected category
   */
  public getSelectedCategory() {
    this.passwordManagerService.emitSelectedCategory.subscribe((category) => {
      this.selectedCategory = category;
    });
  }

  /**
   * Get records list
   */
  public getRecords() {
    this.subGetRecords = this.apiPasswordManagerService.companyRecords.subscribe((res) => {
      this.recordsData = res;
      //  this.recordsData = res.filter(item => item.companyId === this.selectedCompany.id);
    });
  }

  /**
   * delete record from list
   */
  public deleteRecord(recordId) {
    if (this.permissionsService.isAllowed('DELETE_PASSWORD')) {
      this.apiPasswordManagerService.deleteRecord(recordId).subscribe((res) => {
        this.passwordManagerService.deleteRecord(recordId);
        return this.recordsData = this.recordsData.filter((item) => item.id !== recordId);
      });
    }
  }

  /**
   * subscription for deleting records
   */
  public watchDeleteRecord() {
    this.passwordManagerService.deleteItemEditForm.subscribe((item) => {
      return this.deleteRecord(item);
    });
  }

  /**
   * edit record
   * @param item - item for edit
   */
  public editRecord(item) {
    if (this.permissionsService.isAllowed('VIEW_PASSWORD')) {
      this.passwordManagerService.addRecord(item);
    }
  }

  /**
   * get record type class
   * @param type - record type
   */
  public getRecordTypeClass(type) {
    return type.toLowerCase();
  }

  /**
   * getPermission
   * @param action - permission type
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  /**
   * destroy password manager data table component
   */
  ngOnDestroy() {
    //   this.subGetRecords.unsubscribe();
    this.subAddNewRecords.unsubscribe();
    this.apiPasswordManagerService.deleteSubscription();
  }


}
