import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { UserProfile } from '../users/class/user-profile';
import { User } from '../users/class/user';
import { USERS } from 'src/app/const/emails';
import { DraftEmailStateService } from 'src/app/states/draft-email/draft-email-state.service';

@Component({
  selector: 'app-users-details',
  templateUrl: './users-details.component.html',
  styleUrls: ['./users-details.component.scss']
})
export class UsersDetailsComponent implements OnInit {
  user: UserProfile = new UserProfile();
  showPreloader: boolean = true;
  sub: Subscription = new Subscription();
  constructor(public usersStateService: UsersStateService,
    public activateRoute: ActivatedRoute,
    private draftEmailStateService: DraftEmailStateService,
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
  }
  setUserRoutingId(id) {
    this.user.onEdit(this.usersStateService.getAllUsers().find(item => item.id == id));
    this.showPreloader = false;
  }
  edit() {
    this.usersStateService.setUserForEdit(new User(JSON.parse(JSON.stringify(this.usersStateService.getAllUsers().find(item => item.id == this.user.id)))));
    this.usersStateService.onOpenEditAsige();
    //  this.cd.markForCheck();
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.resetSelectedUsers();
    this.draftEmailStateService.addSelectedUser(this.user);
    this.draftEmailStateService.toggleAsideForAdd();
    // this.cd.markForCheck();
  }
}
