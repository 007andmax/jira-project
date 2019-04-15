import { Injectable } from '@angular/core';

import { UsersService } from "../users/users.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(
    private userService: UsersService
  ) { }

  public isAllowed = function (action) {
    const currentUser = this.userService.currentUser;
    console.log(currentUser, 'currentUser');
    return !!(currentUser && (currentUser.isOwner || currentUser.permissions.indexOf(action) > -1));
  };
}
