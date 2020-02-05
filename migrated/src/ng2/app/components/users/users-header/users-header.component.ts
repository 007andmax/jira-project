import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { USERS } from 'src/ng2/app/const/emails';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { UsersHeaderService } from './services/users-header.service';

@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss'],
  providers: [UsersHeaderService]
})
export class UsersHeaderComponent implements OnInit, OnDestroy {

  @Input() count: number = 0;
  constructor(private usersStateService: UsersStateService,
    private draftEmailStateService: DraftEmailStateService,
    private usersHeaderService: UsersHeaderService) {
  }

  ngOnInit() {
    
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  addUser() {
    this.usersStateService.onOpenAsige();
  }
  ngOnDestroy(): void {
    this.usersHeaderService.onUnsubscribe();
  }
}
