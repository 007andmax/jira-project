import { Injectable } from '@angular/core';
import { CurrentUser } from 'src/class/current-user/current-user';
import { PermissionsService } from 'src/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Injectable()
export class TicketsPermissionsService {


  ACTIONS = null;
  constructor(private permissionsService: PermissionsService,
    private usersStateService: UsersStateService) {
    this.ACTIONS = {
      'CLAIM_TICKET': (ticket) => {
        return ticket.status === null && !this.isSpamOrTrash(ticket);
      },
      'SEND_TO_SPAM': this.isTicketOpen,
      'SEND_TO_TRASH': this.isTicketOpen,
      'REOPEN': (ticket, option) => {
        if (ticket.status !== 'COMPLETED' || this.isSpamOrTrash(ticket)) {
          return false;
        }

        if (option === 'billed') {
          return ticket.hasInvoice;

        } else if (option === 'billable') {
          return !ticket.hasInvoice;

        } else {
          return true;
        }
      },
      'RESTORE': (ticket, option) => {
        if (!this.isSpamOrTrash(ticket)) {
          return false;
        }

        if (option === 'from_spam') {
          if (this.usersStateService.getCurrentUser()) {
            if (this.usersStateService.getCurrentUser().isOwner) {
              return ticket.markedAsSpamAt || ticket.reportedAsSpamAt;
            } else {
              return ticket.reportedAsSpamAt && !ticket.markedAsSpamAt;
            }
          }
        } else if (option === 'from_trash') {
          return ticket.trash;
        } else {
          return true;
        }
      },
      'DELETE_FOREVER': (ticket) => {
        return this.isSpamOrTrash(ticket) && !this.isBillable(ticket) && this.permissionsService.isAllowed('DELETE_TICKETS');
      },
      'USER_TIP': (ticket, type) => {

        if (!ticket.assignedUser && ticket.multiAssignedUsers && ticket.multiAssignedUsers.length == 0) {
          return false
        }
        if (ticket && ticket.assignPerformer && ticket.assignPerformer.id && ticket.assignedUser && ticket.assignedUser.id || ticket && ticket.assignPerformer && ticket.assignPerformer.id && ticket.multiAssignedUsers.length > 0) {
          var user = this.usersStateService.getCurrentUser(),
            otherAPerformerAndAUser = (ticket.assignedUser) ? ticket.assignPerformer.id !== ticket.assignedUser.id : true;
          var indexUser = (ticket.multiAssignedUsers) ? ticket.multiAssignedUsers.findIndex(user_s => user_s.id === user.id) : -1;
          let indexPerformerMultiAssigned = (ticket.multiAssignedUsers) ? ticket.multiAssignedUsers.findIndex(user_s => user_s.id === ticket.assignPerformer.id) : -1;
          switch (type) {
            case 'ASSIGNED_TO_ME':
              return (ticket.assignPerformer.id !== user.id) && (((ticket.assignedUser && (ticket.assignedUser.id === user.id || indexUser > -1))) || !ticket.assignedUser && indexUser > -1);

            case 'I_ASSIGNED_TO_USER':
              return (ticket.assignPerformer.id === user.id) && ((ticket.assignedUser && (ticket.assignedUser.id !== user.id && indexUser === -1)) || !ticket.assignedUser && indexUser === -1);

            case 'USER_CLAIMED':
              return (ticket.assignPerformer.id !== user.id) && (((ticket.assignedUser && ticket.assignedUser.id === ticket.assignPerformer.id || indexPerformerMultiAssigned > -1) && indexUser === -1) || !ticket.assignedUser && indexPerformerMultiAssigned > -1 && indexUser === -1);

            case 'USER_ASSIGNED_USER':
              return ticket.assignPerformer.id !== user.id && ((ticket.assignedUser && ticket.assignedUser.id !== user.id && indexUser === -1 && (otherAPerformerAndAUser && indexPerformerMultiAssigned === -1)) || !ticket.assignedUser && indexUser === -1 && (otherAPerformerAndAUser && indexPerformerMultiAssigned === -1));

            case 'MY_TICKET':
              return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser && ticket.assignedUser.id === user.id) || (ticket.assignPerformer.id === user.id) && indexUser > -1;
          }
        }
      },
      'UPDATE': this.isUpdateModeAllowed
    };
  }
  /**
 * @description Check if the ticket is open or not
 * @param ticket - Object Ticket
 * @returns {Boolean} This is the result
*/
  isTicketOpen = (ticket) => {
    return ticket.status !== 'COMPLETED' && !this.isSpamOrTrash(ticket);
  }
  /**
   * @description Check if the ticket is reported as spam or trash
   * @param ticket - Object Ticket
   * @returns {Boolean} This is the result
  */
  isSpamOrTrash(ticket) {
    return ticket.reportedAsSpamAt || ticket.markedAsSpamAt || ticket.trash;
  }

  /**
     * @description Check if the ticket can be billed and does not have an invoice
     * @param ticket - Object Ticket
     * @returns {Boolean} This is the result
    */
  isBillable(ticket) {
    return ticket.isBillable && !ticket.hasInvoice;
  }

  /**
     * @description Check if the current logged-in user type -  tech company owner / generic tech user / client user. 
        Check if the current logged-in tech user is assigned to the ticket.
        Check if the current logged-n tech user has enabled permission to edit another user tickets
     * @param ticket - Object Ticket
     * @returns {Boolean} This is the result
    */
  isUpdateModeAllowed = (ticket) => {
    if (!ticket.status) return false;
    if (this.usersStateService.getCurrentUser() && (this.usersStateService.getCurrentUser().isOwner || this.usersStateService.getCurrentUser().accountType === "CLIENT") && this.isTicketOpen(ticket)) return true;
    if ((this.permissionsService.isAllowed('EDIT_TICKETS') && (ticket.assignedUser && ticket.assignedUser.id == this.usersStateService.getCurrentUser().id || ticket.multiAssignedUsers && ticket.multiAssignedUsers.some(item => item.id == this.usersStateService.getCurrentUser().id)) ||
      this.permissionsService.isAllowed('EDIT_ANOTHER_USERS_TICKET') && (ticket.assignedUser && ticket.assignedUser.id != this.usersStateService.getCurrentUser().id && ticket.multiAssignedUsers && !ticket.multiAssignedUsers.some(item => item.id == this.usersStateService.getCurrentUser().id))) && this.isTicketOpen(ticket)) return true;
    return false;
  }

  isActionVisible(actions, tickets, option, additionalAction) {
    var arrActions = actions.split(','),
      result;
    for (var i = 0; i < arrActions.length; i++) {
      var action = arrActions[i].toUpperCase();
      if (Array.isArray(tickets)) {
        result = !!tickets.length;
        for (var j = 0; j < tickets.length; j++) {
          if (!this.ACTIONS[action](tickets[j], option, additionalAction)) {
            result = false;
            break;
          }
        }
        if (result) {
          return true;
        }
      } else if (tickets && this.ACTIONS[action](tickets, option, additionalAction)) {
        return true;
      }
    }
    return false;
  };
}
