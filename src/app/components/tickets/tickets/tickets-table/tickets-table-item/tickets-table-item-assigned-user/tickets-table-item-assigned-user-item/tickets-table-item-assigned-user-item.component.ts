import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/components/users/class/user';
import { Ticket } from 'src/app/interfaces/quote/ticket';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { ToastrService } from 'ngx-toastr';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { TicketsPermissionsService } from '../../../../ticket-edit-aside/services/tickets-permissions.service';
import { TicketsTableItemRequestedByComponent } from '../../tickets-table-item-requested-by/tickets-table-item-requested-by.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLogoPopoverDirective } from 'src/app/directives/user-logo-popover/user-logo-popover.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-table-item-assigned-user-item',
  templateUrl: './tickets-table-item-assigned-user-item.component.html',
  styleUrls: ['./tickets-table-item-assigned-user-item.component.scss'],
  standalone: true,
  imports: [TicketsTableItemRequestedByComponent, CommonModule, NgbModule, UserLogoPopoverDirective]
})
export class TicketsTableItemAssignedUserItemComponent implements OnInit {
  @Input() ticket: Ticket;
  @Input() user: User;
  @Input() getUserById: Function;
  @Input() i = 0;
  @Input() getAssignedUserNameForAvatar: Function;
  @Input() getStyleNetAvatar: Function;
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
