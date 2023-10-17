import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { NavigationEnd, Router } from '@angular/router';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { LeftPanelStateService } from 'src/app/states/left-panel/left-panel-state.service';

@Component({
  selector: 'left-panel-super-admin',
  templateUrl: './left-panel-super-admin.component.html',
  styleUrls: ['./left-panel-super-admin.component.scss'],
  providers: [TicketsListService]
})
export class LeftPanelSuperAdminComponent implements OnInit {
  state: string = '';
  constructor(public usersStateService: UsersStateService,
    public cd: ChangeDetectorRef,
    private router: Router,
    public companiesStateService: CompaniesStateService,
    private leftPanelStateService: LeftPanelStateService,
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
  onChangeState(data) {
    this.state = data;
    this.leftPanelStateService.goToState(data);
  }
  public logOut() {
    window.location.href = '/logout';
    window.location.hash = '';
  }
}
