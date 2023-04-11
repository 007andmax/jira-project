import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

/**
 * Password manager component
 */
@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss'],
  providers: [PasswordManagerListService]
})

export class PasswordManagerComponent implements OnInit, OnDestroy {
  public list_records: Array<PasswordRecord> = [];
  public showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public filter: FilterPasswordManager = new FilterPasswordManager();
  public selectAll: boolean = false;
  public showPendingPreloader: boolean = false;
  public sub: Subscription = new Subscription();
  container = document.body.querySelector(".main-container");
  constructor(
    public passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    public passwordManagerListService: PasswordManagerListService,
    public confirmStateService: ConfirmStateService,
    public passwordManagerStateService: PasswordManagerStateService,
    public companiesStateService: CompaniesStateService,
    public activateRoute: ActivatedRoute,
    public leftPanelStateService: LeftPanelStateService,
    public cd: ChangeDetectorRef,
    public elRef: ElementRef,
  ) { }

  /**
   * Initializes Password manager data table. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.onScroll();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_RECORD) this.onRemoveRecord(this.passwordManagerStateService.getRecordForRemove().id);
      }
    })
    this.sub.add(getConfirm);
    let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {
      document.body.querySelector(".main-container").scrollTo(0, 0);
      this.filter.setFilter(data);
      this.setDefaultScoll();
      this.onScroll();
    })
    this.sub.add(geLefttFilter);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_CREATED') {
        this.list_records.push(new PasswordRecord(newChange.data));
      } else if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let index = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.list_records[index].onUpdate(newChange.data);
      } else if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let indexList = this.list_records.findIndex(item => item.id === newChange.data.id);
        if (indexList > -1) this.list_records.splice(indexList, 1);
      }
      if (!this.cd['destroyed']) this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
    if (this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
  }
  onSearch(value) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.setSearch((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.showPreloader = true;
    this.filter.page = 0;
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
    if (this.filter.page > 0) this.showPendingPreloader = true;

    this.passwordManagerService.getRecords(this.filter.getDataForRequest()).subscribe((res: any) => {
      this.list_records = [...this.list_records, ...res.map(item => new PasswordRecord(item))];
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.infiniteScrollDisabled = false;
      if (res.length < this.filter.limit) this.passwordManagerListService.setBlockList(true);
      this.filter.page += 1;
      this.cd.detectChanges();
    });
  }
  onSelectRecord(record) {
    this.list_records.find(item => item.id === record.id).selected = record.selected;
    this.selectAll = (this.filter.getFilterList(this.list_records).find(item => !item.selected)) ? false : true;
  }
  onSelectAll(event) {
    if (event.target.checked) {
      this.selectAll = true;
      this.list_records.forEach(item => {
        item.selected = true;
      })
      this.filter.getFilterList(this.list_records).forEach(item => {
        this.list_records.find(user => user.id === item.id).selected = true;
      })
    } else {
      this.selectAll = false;
      this.list_records.forEach(item => {
        item.selected = false;
      })
    }
  }
  public onFilter(field) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    this.filter.setSort(field);
    this.setDefaultScoll();
    this.onScroll();
  }
  public addRecord() {
    this.passwordManagerService.showAddForm();
  }
  public trackById(index, item) {
    return item.id;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
