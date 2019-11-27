import { Injectable } from '@angular/core';

import { UsersService } from "../users/users.service";
import { UsersStateService } from '../../states/users/users-state.service';

/**
 * Permissions service
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  /**
   * Permissions service constructor
   * @param {UsersService} userService Service to work user
   */
  public constructor(
    private usersStateService: UsersStateService
  ) { }

  /**
   * check is allowed
   * @param action - permission
   */
  public isAllowed (action) {
    const currentUser = this.usersStateService.getCurrentUser();
    return !!(currentUser && (currentUser.isOwner || currentUser.permissions.indexOf(action) > -1));
  };
}
