import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from "rxjs";
import { ISubscription } from "rxjs/Subscription";

import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";

/**
 * Password manager data table component
 */
@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss']
})
export class PasswordManagerTableComponent implements OnInit {

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
  public direction: string = 'ASC';

  /**
   * Creates an instance of the PasswordManagerTableComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes Password manager data table. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    this.getRecords();
    this.getSelectedCategory();
    this.subAddNewRecords = this.addNewRecords.subscribe(v => {
      this.apiPasswordManagerService.getRecords();
    });
    this.watchDeleteRecord();
    this.onSort();
 
  }

  private onChangeRealtTime() {
    this.passwordManagerService.onChangeRealTime.subscribe(newChange => {
      console.log('newChange',newChange);
      if (newChange.action === 'PASSWORD_RECORD_CREATED') {
        this.recordsData.push(newChange.data);
      } else if(newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData[index] = newChange.data;
        console.log('this.recordsData[index]',this.recordsData[index]);
      } else if(newChange.action === 'PASSWORD_RECORD_DELETED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData.splice(index,1);
      }
    })
  }

  private onSort() {
    this.passwordManagerService.getOnSort().subscribe((data) => {
      console.log('data',data);
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
    this.subGetRecords = this.apiPasswordManagerService.dataChange.subscribe((res) => {
       this.recordsData = res;
       this.onChangeRealtTime();
       this.cd.detectChanges();
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
   let index = this.recordsData.findIndex(record => record.id === item.id);
    if (this.permissionsService.isAllowed('VIEW_PASSWORD')) {
      this.passwordManagerService.addRecord(this.recordsData[index]);
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

  public trackById(index, item) {
    return item.id;
  }

  /**
   * destroy password manager data table component
   */
  ngOnDestroy() {
    this.subGetRecords.unsubscribe();
    this.subAddNewRecords.unsubscribe();
    this.apiPasswordManagerService.deleteSubscription();
  }


}
