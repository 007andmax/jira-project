import { Injectable } from '@angular/core';
import { CurrentUser } from 'src/ng2/class/current-user/current-user';
import { PermissionsService } from 'src/ng2/app/services/permissions/permissions.service';
import { UsersStateService } from 'src/ng2/app/states/users/users-state.service';

@Injectable()
export class TicketsPermissionsService {


  ACTIONS = null;
  constructor(private permissionsService: PermissionsService,
    private usersStateService: UsersStateService) {
      this.ACTIONS = {
        'CLAIM_TICKET': (ticket) => {
    
          // if (!ticket.multiAssignedUsers) return false;
          return ticket.status === null && !this.isSpamOrTrash(ticket);
        },
        'CHANGE_STATUS': this.isUpdateAllowed,
        'CHANGE_PRIORITY': this.isTicketOpen,
        'LINK_AGENT': (ticket, company) => {
          return this.isTicketOpen(ticket) && company && !company.isDefault && ticket.company.id === company.id;
        },
        'SEND_TO_SPAM': this.isTicketOpen,
        'SEND_TO_TRASH': this.isTicketOpen,
    
        'REOPEN': (ticket, option) => {
          if (ticket.status !== 'COMPLETED' || this.isSpamOrTrash(ticket)) {
            return false;
          }
    
          if (option === 'billed') {
            return ticket.hasInvoice;
    
          } else if (option === 'old') {
            return !ticket.isBillable && !this.isCanBeReOpened(ticket);
    
          } else if (option === 'open') {
            return !ticket.isBillable && this.isCanBeReOpened(ticket);
    
          } else if (option === 'billable') {
            return this.isBillable(ticket);
    
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
                return (ticket.assignPerformer.id !== user.id) && (((ticket.assignedUser && ticket.assignedUser.id === ticket.assignPerformer.id || indexPerformerMultiAssigned > -1) && indexUser=== -1)  || !ticket.assignedUser && indexPerformerMultiAssigned > -1 && indexUser === -1);
    
              case 'USER_ASSIGNED_USER':
                return ticket.assignPerformer.id !== user.id && ((ticket.assignedUser && ticket.assignedUser.id !== user.id && indexUser === -1 && (otherAPerformerAndAUser && indexPerformerMultiAssigned === -1)) || !ticket.assignedUser && indexUser === -1 && (otherAPerformerAndAUser && indexPerformerMultiAssigned === -1));
    
              case 'MY_TICKET':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser && ticket.assignedUser.id === user.id) || (ticket.assignPerformer.id === user.id) && indexUser > -1;
            }
          }
        },
    
        'UPDATE': this.isUpdateModeAllowed,
        'UPDATE_AND_CLOSE': this.isUpdateAllowed,
        'DELETE_UPDATE': this.editTicketUpdate,
        'EDIT_UPDATE': this.editTicketUpdate,
        'ADD_EXPENSE': this.isUpdateAllowed,
        'EDIT_TICKET': (ticket) => {
          return (!ticket.closedAt || this.isCanBeReOpened(ticket)) && !ticket.hasInvoice && this.permissionsService.isAllowed('EDIT_TICKETS');
        }
      };
     }
  isTicketOpen= (ticket) => {
    return ticket.status !== 'COMPLETED' && !this.isSpamOrTrash(ticket);
  }

  isSpamOrTrash(ticket) {
    return ticket.reportedAsSpamAt || ticket.markedAsSpamAt || ticket.trash;
  }

  isBillable(ticket) {
    return ticket.isBillable && !ticket.hasInvoice;
  }

  isCanBeReOpened(ticket) {

    var thirtyDaysInMs = 2592000000,
      now = new Date().getTime();

    return ticket.closedAt >= (now - thirtyDaysInMs);
  }
  isUpdateModeAllowed = (ticket) => {
    if (!ticket.status) return false;
    if (this.usersStateService.getCurrentUser() && this.usersStateService.getCurrentUser().isOwner && (ticket.assignedUser && ticket.assignedUser.id || ticket.multiAssignedUsers && ticket.multiAssignedUsers.length > 0) && this.isTicketOpen(ticket)) return true;

    if (this.permissionsService.isAllowed('EDIT_ANOTHER_USERS_TICKET') && (ticket.assignedUser && ticket.assignedUser.id || ticket.multiAssignedUsers && ticket.multiAssignedUsers.length > 0) && this.isTicketOpen(ticket)) return true;
    let indexUser = -1;
    if (this.usersStateService.getCurrentUser() && ticket.multiAssignedUsers && ticket.multiAssignedUsers.length) {
      indexUser = ticket.multiAssignedUsers.findIndex(item => item.id == this.usersStateService.getCurrentUser().id);
    }
    return this.isTicketOpen(ticket) &&
      ((this.usersStateService.getCurrentUser() && (ticket.assignedUser && ticket.assignedUser.id === this.usersStateService.getCurrentUser().id))  || indexUser > -1 ||
        this.isSharedToCurrentUser(ticket));
  }

  isUpdateAllowed = (ticket) => {

    if (this.usersStateService.getCurrentUser() && this.usersStateService.getCurrentUser().isOwner && (ticket.assignedUser && ticket.assignedUser.id || ticket.multiAssignedUsers && ticket.multiAssignedUsers.length > 0) && this.isTicketOpen(ticket)) return true;

    if (this.permissionsService.isAllowed('EDIT_ANOTHER_USERS_TICKET') && (ticket.assignedUser && ticket.assignedUser.id || ticket.multiAssignedUsers && ticket.multiAssignedUsers.length > 0) && this.isTicketOpen(ticket)) return true;
    let indexUser = -1;
    if (this.usersStateService.getCurrentUser() && ticket.multiAssignedUsers && ticket.multiAssignedUsers.length) {
      indexUser = ticket.multiAssignedUsers.findIndex(item => item.id == this.usersStateService.getCurrentUser().id);
    }
    return this.isTicketOpen(ticket) &&
      ((this.usersStateService.getCurrentUser() && (ticket.assignedUser && ticket.assignedUser.id === this.usersStateService.getCurrentUser().id)) ||
        (ticket.assignedUser && ticket.assignedUser.id === this.usersStateService.getCurrentUser().id) || indexUser > -1 ||
        this.isSharedToCurrentUser(ticket));
  }

  editTicketUpdate = (ticket, updateCreator) => {
    if (this.usersStateService.getCurrentUser() && this.usersStateService.getCurrentUser().isOwner && ticket.assignedUser && this.isTicketOpen(ticket)) return true;

    if (this.permissionsService.isAllowed('EDIT_ANOTHER_USERS_TICKET') && ticket.assignedUser && this.isTicketOpen(ticket)) return true;

    return this.isTicketOpen(ticket) && updateCreator.id === this.usersStateService.getCurrentUser().id;
  }

  isSharedToCurrentUser(ticket) {
    return ticket.shares && ticket.shares.some((share) => {
      return share.user && share.user.id === this.usersStateService.getCurrentUser().id;
    });
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
