import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserProfile } from '../users/class/user-profile';
import { User } from '../users/class/user';
import { USERS } from 'src/app/const/emails';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel/users-details-left-panel.component';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersRealTimeService } from 'src/app/states/users/users-real-time.service';
import { UserCustomerCompaniesInfo } from '../users/class/user-customer-companies-info';
import { UserCustomSubscription } from '../users/class/user-custom-subscription';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.scss']
})
export class UsersDetailsComponent implements OnInit {
  tab: string = 'companies';
  user: UserProfile = new UserProfile();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  @ViewChild('leftPanel') leftPanel: UsersDetailsLeftPanelComponent;
  constructor(public usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    private draftEmailStateService: DraftEmailStateService,
    public customerPortalStateService: CustomerPortalStateService,
    private permissionsService: PermissionsService,
    private usersRealTimeService: UsersRealTimeService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    let id = this.activateRoute.snapshot.params['id'];
    let subscription = this.activateRoute.params.subscribe(params => {
      this.showPreloader = true;
      id = params['id'];
      if (this.usersStateService.getAllUsers().length > 0 && this.activateRoute.snapshot.params['id']) this.setUserRoutingId(this.activateRoute.snapshot.params['id']);
    });
    this.sub.add(subscription);
    let onGetUsers = this.usersStateService.onGetUsers.subscribe(ata => {
      if (this.usersStateService.getAllUsers().length > 0 && this.activateRoute.snapshot.params['id']) this.setUserRoutingId(this.activateRoute.snapshot.params['id']);
    })
    this.sub.add(onGetUsers);
    setTimeout(() => {

      let stompClient = this.usersRealTimeService.changeSubscriptionsUsers.subscribe(newChange => {
        if (newChange.action === 'DEFAULT_SUBSCRIPTION_SAVED') {
          if (this.user.id == newChange.data.userId) {
            let index = this.user.customerCompaniesInfo.findIndex(item => item.companyId === newChange.data.companyId);
            if (index > -1) this.user.customerCompaniesInfo[index] = new UserCustomerCompaniesInfo(newChange.data);
          }
          this.cd.detectChanges();
        }
        if (newChange.action === 'CUSTOM_SUBSCRIPTION_SAVED') {
          if (this.user.id == newChange.data.userId) this.user.changeCustomSubscriptions(newChange.data.customSubscriptions.map(item => new UserCustomSubscription(item)));
          this.cd.detectChanges();
        }
      });
      this.sub.add(stompClient);
    }, 3000);
  }

  setUserRoutingId(id) {
    let user = this.usersStateService.getAllUsers().find(item => item.id == id);
    console.log("user", user);
    this.usersStateService.setUserForEdit(user);
    this.user.onEdit(user);
    console.log("this.user", this.user);
    this.showPreloader = false;
  }
  edit() {
    this.usersStateService.setUserForEdit(new User(JSON.parse(JSON.stringify(this.usersStateService.getAllUsers().find(item => item.id == this.user.id)))));
    this.usersStateService.onOpenEditAsige();
    //  this.cd.markForCheck();
  }
  public getPermissions(action) {
    return this.permissionsService.isAllowed(action)
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.user);
    this.draftEmailStateService.toggleAsideForAdd();
    // this.cd.markForCheck();
  }
}
