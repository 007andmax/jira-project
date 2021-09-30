import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { Subscription } from 'rxjs';
import { PasswordRecord } from '../class/password-record';
import { AppService } from 'src/app/states/app/app.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';
import { FilterPasswordManager } from '../class/filter-password-manager';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { PasswoordManagerFiltersComponent } from './passwoord-manager-filters/passwoord-manager-filters.component';

/**
 * Password manager header component
 */
@Component({
  selector: 'app-passwoord-manager-header',
  templateUrl: './passwoord-manager-header.component.html',
  styleUrls: ['./passwoord-manager-header.component.scss']
})
export class PasswoordManagerHeaderComponent implements OnInit, OnDestroy {
  toggleFilter: boolean = false;
  toggleSearch: boolean = false;
  countFilter: number = 0;
  @ViewChild('filters') filters: PasswoordManagerFiltersComponent;
  filter: FilterPasswordManager = new FilterPasswordManager();
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAll = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Input() selectAll: boolean = false;
  @Input() recordsData: Array<PasswordRecord> = [];
  @Input() disabledCompany: boolean = false;
  sub: Subscription = new Subscription();
  searchText: string = "";
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
    * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    private leftPanelStateService: LeftPanelStateService,
    public passwordManagerStateService: PasswordManagerStateService,
    public appService: AppService,
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    let geLefttFilter = this.passwordManagerStateService.getOnFilter().subscribe((data) => {
      this.filter.setFilter(data);
      console.log("this.filter", this.filter);
    })
    this.sub.add(geLefttFilter);
  }
  clearSearch() {
    this.searchText = "";
    this.onSearch.emit("");
  }
  toggleAll(data) {
    this.selectAll = true;
    this.onSelectAll.emit(data);
  }
  public onFilter(field) {
    this.onChangeFilterField.emit(field);
  }
  search(event) {
    this.onSearch.emit(event.target.value);
  }
  public addRecord() {
    this.passwordManagerService.showAddForm();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  toggleMobileLeftPanel() {
    this.leftPanelStateService.toggleMobileLeftPanel(true);
    this.appService.toggleMobileAside(true);
  }
  onToggleFilter(data) {
    if (this.appService.checkMobile()) this.appService.toggleMobileAside(data);
    this.toggleFilter = data;
  }
  getSelectedCount() {
    return this.recordsData.filter(item => item.selected).length;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  refreshFilters() {
    this.filters.applyFilters();
  }
  isExistFilters() {
    return this.filter.selectedCompany ||
      this.filter.selectedDate ||
      this.filter.selectedUserOrDevice ||
      this.filter.selectedCategory
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
