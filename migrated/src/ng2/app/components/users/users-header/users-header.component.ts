import {Component, OnInit} from '@angular/core';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';
import { USERS } from 'src/ng2/app/const/emails';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';

@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.scss']
})
export class UsersHeaderComponent implements OnInit {
count:number = 0;
  constructor(private usersStateService:UsersStateService,
    private draftEmailStateService:DraftEmailStateService) {
  }

  ngOnInit() {
    this.usersStateService.getOnCount().subscribe(data => {
      this.count = data;
    })
  }
  public showAsideForDraftEmail() {
    this.draftEmailStateService.setAction(USERS);
    this.draftEmailStateService.toggleAsideForAdd();
  }
  addUser () {
    this.usersStateService.onOpenAsige();
  }
}
