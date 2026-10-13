import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/components/users/class/user';
import { Ticket } from 'src/app/interfaces/quote/ticket';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketsPermissionsService } from '../../../../ticket-edit-aside/services/tickets-permissions.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-table-item-assigned-user-more-item',
  templateUrl: './tickets-table-item-assigned-user-more-item.component.html',
  styleUrls: ['./tickets-table-item-assigned-user-more-item.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TicketsTableItemAssignedUserMoreItemComponent implements OnInit {
  @Input() user: User;
  @Input() getAssignedUserNameForAvatar: Function;
  listColorNoAvatar = [];
  indexNoAvatar: number = 0;
  constructor(public ticketsListService: TicketsListService,
    public usersStateService: UsersStateService,
    private ticketsService: TicketsService,
    public ticketsPermissionsService: TicketsPermissionsService,
    private appStateService: AppStateService,
    private toastrService: ToastrService,
  ) { }
  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
}
