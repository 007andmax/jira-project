import { Component, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../users/class/user-profile';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { Router } from '@angular/router';
import { User } from '../../users/class/user';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { USERS } from 'src/app/const/emails';


@Component({
  selector: 'app-users-details-header',
  templateUrl: './users-details-header.component.html',
  styleUrls: ['./users-details-header.component.scss']
})
export class UsersDetailsHeaderComponent implements OnInit {
  @Input() user: UserProfile = new UserProfile();
  constructor(public customerPortalStateService: CustomerPortalStateService,
    private companiesStateService: CompaniesStateService,
    private permissionsService: PermissionsService,
    public usersStateService: UsersStateService,
    private draftEmailStateService: DraftEmailStateService,
    private router: Router,) { }

  ngOnInit() {
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  goToUsers() {
    this.router.navigate(
      [`${this.companiesStateService.getCurrentCompany().techDomain}/users/`]);
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.user);
    this.draftEmailStateService.toggleAsideForAdd();
    // this.cd.markForCheck();
  }
  edit() {
    this.usersStateService.setUserForEdit(new User(JSON.parse(JSON.stringify(this.usersStateService.getAllUsers().find(item => item.id == this.user.id)))));
    this.usersStateService.onOpenEditAsige();
    //  this.cd.markForCheck();
  }
}
