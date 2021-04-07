import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { PasswordManagerService } from "../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../services/permissions/permissions.service";
import { PasswordManagerListService } from './services/password-manager-list.service';
import { PasswordRecord } from './class/password-record';
import { FilterPasswordManager } from './class/filter-password-manager';
import { ConfirmStateService } from '../shared/confirm/services/confirm-state.service';
import { REMOVE_RECORD } from '../../const/confirm';
import { PasswordManagerStateService } from '../../states/password-manager/password-manager-state.service';
import { CompaniesStateService } from '../../states/company/companies-state.service';

/**
 * Password manager component
 */
@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss'],
  providers: [PasswordManagerListService]
})

export class PasswordManagerComponent implements OnInit {
  public recordsData: Array<PasswordRecord> = [];
  public list_records: Array<PasswordRecord> = [];
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  public filter: FilterPasswordManager = new FilterPasswordManager();
  selectAll: boolean = false;
  sub: Subscription = new Subscription();
  constructor(
    public passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    public passwordManagerListService: PasswordManagerListService,
    public confirmStateService: ConfirmStateService,
    public passwordManagerStateService: PasswordManagerStateService,
    public companiesStateService: CompaniesStateService,
    public cd: ChangeDetectorRef,
  ) { }

  /**
   * Initializes Password manager data table. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    window.scrollTo(0, 0);
    this.getRecords();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) this.onRemoveRecord(this.passwordManagerStateService.getRecordForRemove().id);
      }
    })
    this.sub.add(getConfirm);
    let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {
      window.scrollTo(0, 0);
      this.filter.setFilter(data);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(geLefttFilter);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_CREATED') {
        this.recordsData.push(new PasswordRecord(newChange.data));
      } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData[index] = new PasswordRecord(newChange.data);
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records[indexList] = new PasswordRecord(newChange.data);
      } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let index = this.recordsData.findIndex(item => item.id === newChange.data.id);
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.recordsData.splice(index, 1);
        if (indexList > -1) this.list_records.splice(indexList, 1);
      }
      if (!this.cd['destroyed']) this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
    if (this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
  }
  onSearch(value) {
    window.scrollTo(0, 0);
    this.filter.setSearch((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.passwordManagerListService.setBlockList(false);
    this.list_records = [];
  }
  onRemoveRecord(id) {
    this.passwordManagerService.deleteRecord(id).subscribe(data => {
    })
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
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.passwordManagerListService.setBlockList(true);
  }
  onSelectRecord(record) {
    this.recordsData.find(item => item.id === record.id).selected = record.selected;
    this.selectAll = (this.filter.getFilterList(this.recordsData).find(item => !item.selected)) ? false : true;
  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.selectAll = true;
      this.list_records.forEach(item => {
        item.selected = true;
      })
      this.filter.getFilterList(this.recordsData).forEach(item => {
        this.recordsData.find(user => user.id === item.id).selected = true;
      })
    } else {
      this.selectAll = false;
      this.list_records.forEach(item => {
        item.selected = false;
      })
      this.recordsData.forEach(item => {
        item.selected = false;
      })
    }
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.recordsData)
    this.page_number = 0;
    this.passwordManagerListService.setBlockList(false);
    this.list_records = [];
    this.onScroll();
  }
  public getRecords() {
    this.passwordManagerService.getRecords().subscribe((res: any) => {
      this.recordsData = res.map(item => new PasswordRecord(item));
      this.recordsData.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.onScroll();
      this.cd.detectChanges();
    });
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
