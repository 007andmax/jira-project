import { Component, OnInit } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import { ApiPasswordManagerService } from "../../../services/password-manager/api-password-manager.service";

/**
 * Password manager header component
 */
@Component({
  selector: 'app-passwoord-manager-header',
  templateUrl: './passwoord-manager-header.component.html',
  styleUrls: ['./passwoord-manager-header.component.scss']
})
export class PasswoordManagerHeaderComponent implements OnInit {
  showAddCategory: boolean = false;
  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
   * @param {PasswordManagerService} passwordManagerService Service to work with filters
   * @param {permissionsService} permissionsService to work with permissions service
   */
  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  /**
   * Initializes Password manager header. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() { }

  /**
   * add new record event
   */
  public addRecord() {
    this.passwordManagerService.showAddForm();
  }

  /**
   * getPermission
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  /**
   * destroy password manager header component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
  }

}
