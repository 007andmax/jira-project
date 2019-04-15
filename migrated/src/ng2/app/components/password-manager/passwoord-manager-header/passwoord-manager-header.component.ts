import { Component, OnInit } from '@angular/core';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PermissionsService } from "../../../services/permissions/permissions.service";

@Component({
  selector: 'app-passwoord-manager-header',
  templateUrl: './passwoord-manager-header.component.html',
  styleUrls: ['./passwoord-manager-header.component.scss']
})
export class PasswoordManagerHeaderComponent implements OnInit {

  constructor(
    private passwordManagerService: PasswordManagerService,
    private permissionsService: PermissionsService,
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

}
