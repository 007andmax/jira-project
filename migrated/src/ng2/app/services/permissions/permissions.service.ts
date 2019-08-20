import { Injectable } from '@angular/core';

import { UsersService } from "../users/users.service";

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
    private userService: UsersService
  ) { }

  /**
   * check is allowed
   * @param action - permission
   */
  public isAllowed = function (action) {
    const currentUser = this.userService.currentUser;
    return !!(currentUser && (currentUser.isOwner || currentUser.permissions.indexOf(action) > -1));
  };
}
