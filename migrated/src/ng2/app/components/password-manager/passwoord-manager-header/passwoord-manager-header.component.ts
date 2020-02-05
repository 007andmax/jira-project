import { Component, OnInit } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";
import {ApiPasswordManagerService} from "../../../services/password-manager/api-password-manager.service";

@Component({
  selector: 'app-passwoord-manager-header',
  templateUrl: './passwoord-manager-header.component.html',
  styleUrls: ['./passwoord-manager-header.component.scss']
})
export class PasswoordManagerHeaderComponent implements OnInit {

  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
    private apiPasswordManagerService: ApiPasswordManagerService
  ) { }

  ngOnInit() {
  }

  addRecord() {
    this.passwordManagerService.addRecord();
  }

  /**
   * getPermission
   */
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }

  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
  }

}
