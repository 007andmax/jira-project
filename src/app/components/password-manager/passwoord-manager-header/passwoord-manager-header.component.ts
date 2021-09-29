import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { Subscription } from 'rxjs';
import { PasswordRecord } from '../class/password-record';

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
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {

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
  getSelectedCount() {
    return this.recordsData.filter(item => item.selected).length;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
