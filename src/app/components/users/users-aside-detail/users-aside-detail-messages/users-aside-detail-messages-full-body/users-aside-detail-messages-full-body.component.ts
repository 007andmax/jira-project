import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'users-aside-detail-messages-full-body',
  templateUrl: './users-aside-detail-messages-full-body.component.html',
  styleUrls: ['./users-aside-detail-messages-full-body.component.scss']
})
export class UsersAsideDetailMessagesFullBodyComponent implements OnInit {
  opened: boolean = false;
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {
    this.usersStateService.openMessageAside.subscribe(data => {
      this.opened = true;

    })
  }
  close() {
    this.opened = false;
  }
}
