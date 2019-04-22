import { Component, Input, OnInit } from '@angular/core';
import { Subject } from "rxjs";

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
  public recordsData: any;

  constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    this.getRecords();
    this.getSelectedCategory();
    this.addNewRecords.subscribe(v => {
      this.getRecords();
    });
    this.watchDeleteRecord();
  }

  public getSelectedCategory() {
    this.passwordManagerService.emitSelectedCategory.subscribe((category) => {
       this.selectedCategory = category;
    });
  }

  getRecords() {
    this.apiPasswordManagerService.dataChange.subscribe((res) => {
      this.recordsData = res;
    });
  }

  deleteRecord(recordId) {
    if (this.permissionsService.isAllowed('DELETE_PASSWORD')) {
      this.apiPasswordManagerService.deleteRecord(recordId).subscribe((res) => {
        this.passwordManagerService.deleteRecord(recordId);
        return this.recordsData = this.recordsData.filter((item) => item.id !== recordId);
      });
    }
  }

  doNext(value) {
    this.dataChange.next(value);
  }

  public watchDeleteRecord() {
    this.passwordManagerService.deleteItemEditForm.subscribe((item) => {
      return this.deleteRecord(item);
    });
  }

  editRecord(item) {
    if (this.permissionsService.isAllowed('VIEW_PASSWORD')) {
      this.passwordManagerService.addRecord(item);
    }
  }

  public getRecordTypeClass(type) {
    return type.toLowerCase();
  }

  /**
   * getPermission
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }


}
