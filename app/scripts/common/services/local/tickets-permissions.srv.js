'use strict';

(function (window, $, undefined) {

  angular.module('quicktech.common.services').factory('quicktech.common.services.TicketsPermissionsService',
    ['$rootScope', 'UsersService', function ($rootScope, UsersService) {

      var USER_ROLES = {
        USER: 'USER',
        ADMIN: 'ADMIN',
        SUPER_ADMIN: 'SUPER_TECH_ADMIN'
      };

      var ACTIONS = {
        'CLAIM_TICKET': function (ticket) {
          return isTicketOpen && !ticket.assignedUser;
        },
        'CHANGE_STATUS': isTicketOpenAndAssigned,
        'CHANGE_PRIORITY': isTicketOpen,
        'SEND_TO_SPAM': isTicketOpen,
        'SEND_TO_TRASH': function (ticket) {
          return !isSpamOrTrash(ticket) && !isBillable(ticket);
        },
        'ASSIGN': function (ticket) {
          var techUsers = UsersService.getTechUsers();
          return techUsers && techUsers.length > 1 && $rootScope.currentUser.role !== USER_ROLES.USER && isTicketOpen(ticket);
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
            return ticket.isBillable && !ticket.hasInvoice;

          } else if (option === 'shared_for_admin') {
            return ticket.sharedToCurrentUserAt && $rootScope.currentUser.role !== USER_ROLES.USER;

          } else if (option === 'shared_for_user') {
            return ticket.sharedToCurrentUserAt && $rootScope.currentUser.role === USER_ROLES.USER;

          } else {
            return true;
          }
        },
        'RESTORE': function (ticket, option, action) {
          if (!isSpamOrTrash(ticket)) {
            return false;
          }

          if (option === 'from_spam') {
            switch (action) {
              case 'user_spam':
                return $rootScope.currentUser.role === USER_ROLES.USER && ticket.reportedAsSpamAt;
              case 'admin_spam':
                return $rootScope.currentUser.role !== USER_ROLES.USER && ticket.markedAsSpamAt;
              case 'admin_delete':
                return $rootScope.currentUser.role !== USER_ROLES.USER && !ticket.markedAsSpamAt && ticket.reportedAsSpamAt;
              default:
                return ticket.markedAsSpamAt || ticket.reportedAsSpamAt;
            }
          } else if (option === 'from_trash') {
            return ticket.trash;
          }
        },
        'DELETE_FOREVER': function (ticket) {
          return isSpamOrTrash(ticket) && !isBillable(ticket);
        },
        'USER_TIP': function (ticket, type) {

          if (!ticket.assignedUser) {
            return false
          }

          if (ticket && ticket.assignPerformer && ticket.assignPerformer.id && ticket.assignedUser && ticket.assignedUser.id) {

            var user = $rootScope.currentUser,
              isUserAdminOrSAdmin = user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPER_ADMIN,
              otherAPerformerAndAUser = ticket.assignPerformer.id !== ticket.assignedUser.id;

            switch (type) {
              case 'ASSIGNED_TO_ME':
                return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser.id === user.id) && !ticket.isReassigned;

              case 'RE-ASSIGNED_TO_ME':
                return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser.id === user.id) && ticket.isReassigned;

              case 'I_ASSIGNED_TO_USER':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser.id !== user.id) && !ticket.isReassigned && isUserAdminOrSAdmin;

              case 'I_RE-ASSIGNED_TO_USER':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser.id !== user.id) && ticket.isReassigned && isUserAdminOrSAdmin;

              case 'USER_CLAIMED':
                return (ticket.assignPerformer.id !== user.id) && (ticket.assignedUser.id === ticket.assignPerformer.id);

              case 'USER_RE-ASSIGNED_USER':
                return ticket.assignPerformer.id !== user.id && ticket.assignedUser.id !== user.id && otherAPerformerAndAUser && ticket.isReassigned && isUserAdminOrSAdmin;

              case 'USER_ASSIGNED_USER':
                return ticket.assignPerformer.id !== user.id && ticket.assignedUser.id !== user.id && otherAPerformerAndAUser && !ticket.isReassigned && isUserAdminOrSAdmin;

              case 'MY_TICKET':
                return (ticket.assignPerformer.id === user.id) && (ticket.assignedUser.id === user.id);
            }
          }
        },
        'STATUS_VISIBLE': function (ticket) {
          return !isSpamOrTrash(ticket) && ticket.status;
        },
        'UPDATE': isUpdateVisible,
        'UPDATE_AND_CLOSE': isForCurrentUser,
        'DELETE_UPDATE': function (ticket, updateCreator) {
          var user = $rootScope.currentUser;

          if (!isUpdateVisible(ticket)) {
            return false;
          }

          return user.role !== USER_ROLES.USER || updateCreator.id === user.id;
        },
        'EDIT_UPDATE': function (ticket) {
          return isUpdateVisible(ticket) && $rootScope.user.role !== USER_ROLES.USER;
        },
        'ADD_EXPENSE': function (ticket) {
          return $rootScope.currentUser.role !== USER_ROLES.USER || isForCurrentUser(ticket);
        }
      };

      function isTicketOpen(ticket) {
        return ticket.status !== 'COMPLETED' && !isSpamOrTrash(ticket);
      }

      function isTicketOpenAndAssigned(ticket) {
        return ticket.assignedUser && isTicketOpen(ticket);
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

      function isUpdateVisible(ticket) {
        return isTicketOpenAndAssigned(ticket) && (ticket.assignedUser.id === $rootScope.currentUser.id || ticket.sharedToCurrentUserAt);
      }

      function isForCurrentUser(ticket) {
        return isTicketOpenAndAssigned(ticket) && ticket.assignedUser.id === $rootScope.currentUser.id || ticket.sharedToCurrentUserAt;
      }

      return {
        isActionVisible: function (actions, ticket, option, additionalAction) {
          var arrActions = actions.split(',');

          for (var i = 0; i < arrActions.length; i++) {
            var action = arrActions[i];

            if (ACTIONS[action.toUpperCase()](ticket, option, additionalAction)) {
              return true;
            }
          }

          return false;
        }
      };

    }]);

})(window, jQuery);


