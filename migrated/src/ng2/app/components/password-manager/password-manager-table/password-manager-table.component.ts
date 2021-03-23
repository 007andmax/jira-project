import { Component, Input, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Subject } from "rxjs";
import { ISubscription } from "rxjs/Subscription";

import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { FilterPasswordManager } from '../class/filter-password-manager';
import { PasswordRecord } from '../class/password-record';
import { PasswordManagerListService } from '../services/password-manager-list.service';

/**
 * Password manager data table component
 */
@Component({
  selector: 'app-password-manager-table',
  templateUrl: './password-manager-table.component.html',
  styleUrls: ['./password-manager-table.component.scss'],
  providers: [PasswordManagerListService]
})
export class PasswordManagerTableComponent implements OnInit {
  public recordsData: Array<PasswordRecord> = [];
  public list_records: Array<PasswordRecord> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = false;
  public page_number: number = 0;
  public filter: FilterPasswordManager = new FilterPasswordManager();

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
    private passwordManagerListService: PasswordManagerListService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes Password manager data table. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    window.scrollTo(0, 0);
    this.getRecords();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.filterList();
  }

  private filterList() {
    if (this.passwordManagerListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.filter.getFilterList(this.recordsData);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let list_records = [];
    for (let i = start; i < end; i++) {
      list_records.push(listFilter[i]);
    }
    this.list_records = [...this.list_records, ...list_records.map(item => new PasswordRecord(JSON.parse(JSON.stringify(item))))];
    console.log("this.list_records", this.list_records);
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.passwordManagerListService.setBlockList(true);

  }
  private onChangeRealtTime() {
    this.passwordManagerService.onChangeRealTime.subscribe(newChange => {

      if (newChange.action === 'PASSWORD_RECORD_CREATED') {
        this.recordsData.push(newChange.data);
      } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData[index] = newChange.data;

      } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);

        if (index > -1) this.recordsData.splice(index, 1);

      }
      if (!this.cd['destroyed']) {
        this.cd.detectChanges();
      }
    })
  }




  /**
   * Get records list
   */
  public getRecords() {
    console.log("getRecords");
    this.apiPasswordManagerService.getRecords().subscribe((res: any) => {
      console.log("res", res);
      this.recordsData = res.map(item => new PasswordRecord(item));
      this.showPreloader = false;
      this.onChangeRealtTime();
      this.onScroll();
      this.cd.detectChanges();
    });
  }

  public trackById(index, item) {
    return item.id;
  }

  /**
   * destroy password manager data table component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
  }
}
