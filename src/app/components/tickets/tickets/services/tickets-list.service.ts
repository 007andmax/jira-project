import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { TicketsFilter } from '../class/tickets-filter';
import { Ticket } from '../../class/ticket';
import { UsersStateService } from 'src/app/states/users/users-state.service';

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

  isTicketMatchesFilters(ticketsFilter: TicketsFilter, ticket: Ticket) {
    if (ticketsFilter.listType === "ALL" && ticket.ticketSource !== "FROM_RECURRING_TICKET" && this.checkFilterUse(ticketsFilter, ticket)) return true;
    if (ticketsFilter.listType === "UNASSIGNED" && ticket.status === null && this.checkFilterUse(ticketsFilter, ticket)) return true;
    if (ticketsFilter.listType === "OPEN" && ticket.status !== "COMPLETED" && this.checkFilterUse(ticketsFilter, ticket)) return true;
    if (ticketsFilter.listType === "USERS" && this.checkFilterUse(ticketsFilter, ticket)) {
      if (ticket.assignedUserId === this.usersStateService.getCurrentUser().id) {
        return true;
      } else if (this.checkUserInMultiAssigned(ticket.multiAssignedUsers)) {
        return true;
      } else if (ticket.status === null) {
        return true;
      }
    }
    if (ticketsFilter.listType === "RECURRING_TICKETS_OPEN" && ticket.ticketSource === "FROM_RECURRING_TICKET" && ticket.status === "IN_PROGRESS" && this.checkFilterUse(ticketsFilter, ticket)) return true;
    return false;
  }
  checkFilterUse(ticketsFilter: TicketsFilter, ticket: Ticket) {
    if (ticketsFilter.tags.length > 0) return false;
    let selectedCompany = true,
      selectedTechUser = true,
      selectedUser = true;
    if (ticketsFilter.selectedCompanies.length > 0) {
      selectedCompany = (ticketsFilter.selectedCompanies.some(item => item.id === ticket.companyId));
    }

    if (ticketsFilter.selectedTechUsers.length > 0) {
      let assignedUser: boolean = (ticketsFilter.selectedTechUsers.find(item => item.id === ticket.assignedUserId) ? true : false);
      let multiAssignedUser = (ticket.multiAssignedUsers || []).find(item => ticketsFilter.selectedTechUsers.some(techUser => techUser.id == item.id));
      selectedTechUser = (assignedUser && !multiAssignedUser);
    }

    if (ticketsFilter.selectedUsers.length > 0) {
      selectedUser = (ticketsFilter.selectedUsers.find(item => item.id === ticket.createdUserId) ? true : false);
    }
    return selectedCompany && selectedTechUser && selectedUser;

  }
  checkUserInMultiAssigned(multiAssignedUsers) {
    let find = ((multiAssignedUsers) ? multiAssignedUsers : []).find(item => item.id === this.usersStateService.getCurrentUser().id);
    return (find) ? true : false;
  }
  getStyleAvatar(user, color = null) {
    if (!(user && user.avatar)) {
      return (color) ? color : '#16a4fa';
    }
    if (user.id) {
      return `url(${'/users/' + (user.id || 'default') + '/image' + (user.avatar ? '.jpg?t=' + user.avatar.updatedAt :
        '')}) 0% 0% / contain no-repeat`
    } else if (user.avatar && user.avatar.origin && user.avatar.origin.id) {
      return `url(/file/${(user.avatar.origin.id)}.jpg) 0% 0% / contain no-repeat`;
    } else {
      return (color) ? color : '#16a4fa';
    }
  };
  randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
  public getUserName(user) {
    return (user) ? `${user.firstName} ${user.lastName}` : '';
  }
  getAssignedUserNameForAvatar(user) {
    if (!user) return '';
    if (!user.avatar) return `${(user.firstName) ? user.firstName[0].toUpperCase() : ''}`;
    return '';
  }
}
