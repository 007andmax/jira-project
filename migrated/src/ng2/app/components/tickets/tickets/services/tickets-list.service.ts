import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { TicketsFilter } from '../class/tickets-filter';
import { Ticket } from '../../class/ticket';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Injectable()
export class TicketsListService {

  blockList: boolean = false;
  sub: Subscription = new Subscription();
  constructor(private usersStateService: UsersStateService) { }
  public addSubscription(data) {
    this.sub.add(data);

  }
  public onUnsubscribe() {
    this.sub.unsubscribe();
  }
  public setBlockList(data) {
    this.blockList = data;
  }
  public getBlockList() {
    return this.blockList;
  }

  isTicketMatchesFilters(ticketsFilter:TicketsFilter,ticket: Ticket) {
    console.log("this.ticketsFilter.listType",ticketsFilter.listType);
    console.log("ticket", ticket);
    if (ticketsFilter.listType === "ALL" && ticket.ticketSource !== "FROM_RECURRING_TICKET" && this.checkFilterUse(ticketsFilter,ticket)) return true;
    if (ticketsFilter.listType === "UNASSIGNED" && ticket.status === null  && this.checkFilterUse(ticketsFilter,ticket)) return true;
    if (ticketsFilter.listType === "OPEN" && ticket.status !== "COMPLETED" && this.checkFilterUse(ticketsFilter,ticket)) return true;
    if (ticketsFilter.listType === "USERS" && this.checkFilterUse(ticketsFilter,ticket)) {
      if (ticket.assignedUserId === this.usersStateService.getCurrentUser().id) {
        return true;
      } else if (this.checkUserInMultiAssigned(ticket.multiAssignedUsers)) {
        return true;
      } else if (ticket.status === null) {
        return true;
      }
    }
    if (ticketsFilter.listType === "RECURRING_TICKETS_OPEN" && ticket.ticketSource === "FROM_RECURRING_TICKET" && ticket.status === "IN_PROGRESS" && this.checkFilterUse(ticketsFilter,ticket)) return true;
    return false;
  }
  checkFilterUse(ticketsFilter:TicketsFilter,ticket: Ticket) {
    if (ticketsFilter.tags.length > 0) return false;
  let  selectedCompany = true,
    selectedTechUser = true,
    selectedUser = true;
    if (ticketsFilter.selectedCompany) {
      selectedCompany = (ticketsFilter.selectedCompany.id === ticket.companyId);
    }

    if (ticketsFilter.selectedTechUser) {
      let assignedUser:boolean = (ticketsFilter.selectedTechUser.id === ticket.assignedUserId);
      let multiAssignedUser = (ticket.multiAssignedUsers || []).find(item => item.id === ticketsFilter.selectedTechUser.id);
      selectedTechUser = (assignedUser && !multiAssignedUser);
    }

    if (ticketsFilter.selectedUser) {
      selectedUser = (ticketsFilter.selectedUser.id === ticket.createdUserId);
    }
    return selectedCompany && selectedTechUser && selectedUser;

  }
  checkUserInMultiAssigned(multiAssignedUsers) {
    let find =  ((multiAssignedUsers) ? multiAssignedUsers : []).find(item => item.id === this.usersStateService.getCurrentUser().id);
    return (find) ? true : false;
  }
  getStyleAvatar(user) {
    if (!(user && user.avatar)) {
      return '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) no-repeat`;
    } else {
      return '#16a4fa';
    }
  };
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}${(user.lastName) ? user.lastName[0].toUpperCase() : ''}`;
    return '';
  }
}
