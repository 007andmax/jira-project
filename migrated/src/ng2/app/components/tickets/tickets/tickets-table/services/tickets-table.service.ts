import { Injectable } from '@angular/core';
import { TicketsFilter } from '../../class/tickets-filter';
import { Ticket } from '../../../class/ticket';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Injectable( )
export class TicketsTableService {

  constructor(   private usersStateService: UsersStateService,) { }
  isTicketMatchesFilters(ticketsFilter:TicketsFilter,ticket: Ticket) {
    console.log("this.ticketsFilter.listType",ticketsFilter.listType);
    console.log("ticket", ticket);
    if (ticketsFilter.listType === "ALL" && ticket.ticketSource !== "FROM_RECURRING_TICKET") return true;
    if (ticketsFilter.listType === "UNASSIGNED" && ticket.status === null) return true;
    if (ticketsFilter.listType === "OPEN" && ticket.status !== "COMPLETED") return true;
    if (ticketsFilter.listType === "USERS") {
      if (ticket.assignedUserId === this.usersStateService.getCurrentUser().id) {
        return true;
      } else if (this.checkUserInMultiAssigned(ticket.multiAssignedUsers)) {
        return true;
      } else if (ticket.status === null) {
        return true;
      }
    }
    if (ticketsFilter.listType === "RECURRING_TICKETS_OPEN" && ticket.ticketSource === "FROM_RECURRING_TICKET" && ticket.status === "IN_PROGRESS") return true;
    return false;
  }
  
  checkUserInMultiAssigned(multiAssignedUsers) {
    let find = multiAssignedUsers.find(item => item.id === this.usersStateService.getCurrentUser().id);
    return (find) ? true : false;
  }
}
