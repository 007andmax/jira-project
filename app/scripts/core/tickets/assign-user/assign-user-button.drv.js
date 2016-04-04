'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('assignUserButton', function () {
      return {
        restrict: 'A',
        templateUrl: '/html/scripts/core/tickets/assign-user/assign-user.tpl.html',
        controller: 'quicktech.core.tickets.assignUserCtrl',
        scope: {
          ticketId: "=aubTicketId",
          ticketNumber: "=aubTicketNumber",
          ticketAssignedUserId: "=ticketAssignedUserId",
          currentUser: '=aubCurrentUser',
          usersCurrentCompany: "=users",
          isBulkOperation: '=aubIsBulkOperation'
        }
      };
    });

})();
