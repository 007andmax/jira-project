import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";
import { PASSWORD_RECORD_TYPES } from 'src/ng2/app/const/password-record-types';
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { Subscription } from 'rxjs';
import { TitleListType } from '../../tickets/tickets/tickets-header/class/title-list-type';
import { FilterPasswordManager } from '../class/filter-password-manager';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { PasswordDeviceUser } from '../class/password-device-user';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
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
  toggleFilter: boolean = true;
  countFilter: number = 0;
  @Output() onChangeFilterField = new EventEmitter<any>();
  @Output() onSelectAll = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<any>();
  @Input() selectAll: boolean = false;
  @Input() recordsData: Array<PasswordRecord> = [];
  sub: Subscription = new Subscription();
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private companiesState: CompaniesStateService,
    private passwordManagerStateService: PasswordManagerStateService,
    private usersStateService: UsersStateService,
    private devicesStateService: DevicesStateService
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {

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

  /**
   * add new record event
   */
  public addRecord() {
    this.passwordManagerService.showAddForm();
  }
  onChangeCountFilter(data) {
    this.countFilter = data;
  }
  /**
   * getPermission
   */
  getSelectedCount() {
    return this.recordsData.filter(item => item.selected).length;
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  /**
   * destroy password manager header component
   */
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
