import { Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'left-panel-super-admin',
  templateUrl: './left-panel-super-admin.component.html',
  styleUrls: ['./left-panel-super-admin.component.scss'],
  providers: [TicketsListService]
})
export class LeftPanelSuperAdminComponent implements OnInit {

  constructor(public usersStateService: UsersStateService,
    public ticketsListService: TicketsListService,) { }

  ngOnInit() {
  }
  getNameForAvatar() {
    if (!this.usersStateService.getCurrentUser()) return '';
    if (!this.usersStateService.getCurrentUser().avatar) return `${(this.usersStateService.getCurrentUser().firstName) ? this.usersStateService.getCurrentUser().firstName[0].toUpperCase() : ''}`;
    return '';
  }
  getFullUserName() {
    if (!this.usersStateService.getCurrentUser()) return '';
    return `${this.usersStateService.getCurrentUser().firstName} ${this.usersStateService.getCurrentUser().lastName
      }`;

  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
}
