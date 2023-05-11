import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserCustomerCompaniesInfo } from 'src/app/components/users/class/user-customer-companies-info';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { CurrentUser } from 'src/class/current-user/current-user';
import { CurrentUserCustomerCompaniesInfo } from 'src/class/current-user/current-user-customer-companies-info';

@Component({
  selector: 'left-panel-customer-portal-users',
  templateUrl: './left-panel-customer-portal-users.component.html',
  styleUrls: ['./left-panel-customer-portal-users.component.scss']
})
export class LeftPanelCustomerPortalUsersComponent implements OnInit {
  currentUser: CurrentUser;
  open: boolean = false;
  @Input() activePage: string = "";
  sub: Subscription = new Subscription();
  @Output() onGoToLink = new EventEmitter();
  @Output() onChangeState = new EventEmitter();
  @Output() onOpenPanel = new EventEmitter();
  constructor(private usersStateService: UsersStateService,) { }

  ngOnInit() {
    if (this.usersStateService.getCurrentUser()) this.getCurrentUser(this.usersStateService.getCurrentUser());
    this.usersStateService.getOnGetCurrentuser().subscribe(data => {
      this.getCurrentUser(data)
    })
  }
  openPanel() {
    this.onOpenPanel.emit(null);
  }
  private getCurrentUser(data) {
    this.currentUser = data;
  }
}
