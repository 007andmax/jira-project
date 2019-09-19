'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.TicketsPermissionsService',
    ['$rootScope', 'UsersService', 'quicktech.common.services.PermissionsService', function ($rootScope, UsersService, PermissionsService) {

      var ACTIONS = {
        'CLAIM_TICKET': function (ticket) {
          return isTicketOpen(ticket) && !ticket.assignedUser;
        },
        'CHANGE_STATUS': isUpdateAllowed,
        'CHANGE_PRIORITY': isTicketOpen,
        'LINK_AGENT': function (ticket, company) {
          return isTicketOpen(ticket) && company && !company.isDefault && ticket.company.id === company.id;
        },
        'SEND_TO_SPAM': isTicketOpen,
        'SEND_TO_TRASH': isTicketOpen,
        'ASSIGN': function (ticket) {
          var techUsers = UsersService.getTechUsers();
          return techUsers && techUsers.length > 1 && isTicketOpen(ticket);
        },
        'REOPEN': function (ticket, option) {
          if (ticket.status !== 'COMPLETED' || isSpamOrTrash(ticket)) {
            return false;
          }

          if (option === 'billed') {
            return ticket.hasInvoice;

          } else if (option === 'old') {
            return !ticket.isBillable && !isCanBeReOpened(ticket);

          } else if (option === 'open') {
            return !ticket.isBillable && isCanBeReOpened(ticket);

          } else if (option === 'billable') {
            return isBillable(ticket);

          } else {
            return true;
          }
        },
        'RESTORE': function (ticket, option) {
          if (!isSpamOrTrash(ticket)) {
            return false;
          }

          if (option === 'from_spam') {
            if ($rootScope.currentUser) {
              if ($rootScope.currentUser.isOwner) {
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
        'DELETE_FOREVER': function (ticket) {
          return isSpamOrTrash(ticket) && !isBillable(ticket) && PermissionsService.isAllowed('DELETE_TICKETS');
        },
        'USER_TIP': function (ticket, type) {

          if (!ticket.assignedUser && ticket.multiAssignedUsers && ticket.multiAssignedUsers.length == 0) {
            return false
          }
        
         

          if (ticket && ticket.assignPerformer && ticket.assignPerformer.id && ticket.assignedUser && ticket.assignedUser.id || ticket && ticket.assignPerformer && ticket.assignPerformer.id && ticket.multiAssignedUsers.length > 0) {

            var user = $rootScope.currentUser,
              otherAPerformerAndAUser = ticket.assignedUser && ticket.assignPerformer.id !== ticket.assignedUser.id;
              var indexUser = ticket.multiAssignedUsers.findIndex(user_s => user_s.id === user.id);
            switch (type) {
              case 'ASSIGNED_TO_ME':
                return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser && ticket.assignedUser.id === user.id) && !ticket.isReassigned;

              case 'RE-ASSIGNED_TO_ME':
                return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser && ticket.assignedUser.id === user.id) && ticket.isReassigned;

              case 'I_ASSIGNED_TO_USER':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser && ticket.assignedUser.id !== user.id) && !ticket.isReassigned;

              case 'I_RE-ASSIGNED_TO_USER':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser && ticket.assignedUser.id !== user.id) && ticket.isReassigned;

              case 'USER_CLAIMED':
                return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser && ticket.assignedUser.id === ticket.assignPerformer.id);

              case 'USER_RE-ASSIGNED_USER':
                return ticket.assignPerformer.id !== user.id && ticket.assignedUser && ticket.assignedUser.id !== user.id && otherAPerformerAndAUser && ticket.isReassigned;

              case 'USER_ASSIGNED_USER':
                return ticket.assignPerformer.id !== user.id && ticket.assignedUser && ticket.assignedUser.id !== user.id && otherAPerformerAndAUser && !ticket.isReassigned;

              case 'MY_TICKET':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser && ticket.assignedUser.id === user.id) || (ticket.assignPerformer.id === user.id) && indexUser > -1;
            }
          }
        },
        'STATUS_VISIBLE': function (ticket) {
          return !isSpamOrTrash(ticket);
        },
        'UPDATE': isUpdateAllowed,
        'UPDATE_AND_CLOSE': isUpdateAllowed,
        'DELETE_UPDATE': editTicketUpdate,
        'EDIT_UPDATE': editTicketUpdate,
        'ADD_EXPENSE': isUpdateAllowed,
        'EDIT_TICKET': function (ticket) {
          return (!ticket.closedAt || isCanBeReOpened(ticket)) && !ticket.hasInvoice && PermissionsService.isAllowed('EDIT_TICKETS');
        }
      };

      function isTicketOpen(ticket) {
        return ticket.status !== 'COMPLETED' && !isSpamOrTrash(ticket);
      }

      function isSpamOrTrash(ticket) {
        return ticket.reportedAsSpamAt || ticket.markedAsSpamAt || ticket.trash;
      }

      function isBillable(ticket) {
        return ticket.isBillable && !ticket.hasInvoice;
      }

      function isCanBeReOpened(ticket) {

        var thirtyDaysInMs = 2592000000,
          now = new Date();

        return ticket.closedAt >= (now - thirtyDaysInMs);
      }

      function isUpdateAllowed(ticket) {
        if ($rootScope.currentUser && $rootScope.currentUser.isOwner && ticket.assignedUser && ticket.assignedUser.id && isTicketOpen(ticket)) {
          return true;
        }

        if (PermissionsService.isAllowed('EDIT_ANOTHER_USERS_TICKET') && ticket.assignedUser && ticket.assignedUser.id && isTicketOpen(ticket)) {

          // console.log('ACTION IS ALLOWEDDDD')
          return true;
        }

        return isTicketOpen(ticket) &&
          (($rootScope.currentUser && (ticket.assignedUser && ticket.assignedUser.id === $rootScope.currentUser.id)) ||
          (ticket.assignedUser && ticket.assignedUser.id === $rootScope.currentUser.id) ||
          isSharedToCurrentUser(ticket));
      }

      function editTicketUpdate(ticket, updateCreator) {
        if ($rootScope.currentUser && $rootScope.currentUser.isOwner && ticket.assignedUser && isTicketOpen(ticket)) {
          return true;
        }

        if (PermissionsService.isAllowed('EDIT_ANOTHER_USERS_TICKET') && ticket.assignedUser && isTicketOpen(ticket)) {
          // console.log('ACTION IS ALLOWEDDDD')
          return true;
        }

        return isTicketOpen(ticket) && updateCreator.id === $rootScope.currentUser.id;
      }

      function isSharedToCurrentUser(ticket) {
        return ticket.shares && ticket.shares.some(function (share) {
            return share.user && share.user.id === $rootScope.currentUser.id;
          });
      }

      return {
        isActionVisible: function (actions, tickets, option, additionalAction) {
          var arrActions = actions.split(','),
            result;

          for (var i = 0; i < arrActions.length; i++) {
            var action = arrActions[i].toUpperCase();

            if (Array.isArray(tickets)) {
              result = !!tickets.length;
              for (var j = 0; j < tickets.length; j++) {
                if (!ACTIONS[action](tickets[j], option, additionalAction)) {
                  result = false;
                  break;
                }
              }

              if (result) {
                return true;
              }

            } else if (tickets && ACTIONS[action](tickets, option, additionalAction)) {
              return true;
            }
          }

          return false;
        }
      };

    }]);

})(window, jQuery);
