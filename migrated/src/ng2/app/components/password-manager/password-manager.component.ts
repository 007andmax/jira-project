import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";

import { ApiPasswordManagerService } from "../../services/password-manager/api-password-manager.service";
import { CompaniesService } from "../../services/company/companies.service";
import { PasswordManagerService } from "../../services/password-manager/password-manager.service";
import { UsersService } from "../../services/users/users.service";
import { PermissionsService } from "../../services/permissions/permissions.service";
import { PasswordManagerListService } from './services/password-manager-list.service';
import { UsersStateService } from '../../states/users/users-state.service';

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


  /**
   * Creates an instance of the PasswordManagerComponent with the injected services
   * @param {ApiPasswordManagerService} apiPasswordManagerService Service to work with api
     */
  public constructor(
    private apiPasswordManagerService: ApiPasswordManagerService,
  ) {
  }

  /**
   * Initializes Password manager. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {

  };

  /**
   * destroy password manager component
   */
  ngOnDestroy() {
    this.apiPasswordManagerService.deleteSubscription();
  }
}
