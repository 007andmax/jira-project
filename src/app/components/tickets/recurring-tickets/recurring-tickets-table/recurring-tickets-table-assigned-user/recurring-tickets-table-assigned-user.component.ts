import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from '../../../tickets/services/tickets-list.service';
import { NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsTableItemRequestedByComponent } from '../../../tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';

@Component({
  standalone: true,
  imports: [CommonModule, NgbModule, TicketsTableItemRequestedByComponent, UserLogoPopoverDirective],
  selector: 'app-recurring-tickets-table-assigned-user',
  templateUrl: './recurring-tickets-table-assigned-user.component.html',
  styleUrls: ['./recurring-tickets-table-assigned-user.component.scss'],
  providers: [TicketsListService],

})
export class RecurringTicketsTableAssignedUserComponent implements OnInit {
  @Input() user: any;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];

  constructor(public ticketsListService: TicketsListService,
    private usersStateService: UsersStateService
  ) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
  getUserById(userId) {
    return this.usersStateService.getAllUsers().find(item => item.id == userId);
  }
  getStyleNetAvatar(i) {
    return `${12 * i}px`;
  }
}
