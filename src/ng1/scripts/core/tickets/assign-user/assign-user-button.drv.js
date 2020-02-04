'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('assignUserButton', ['$rootScope',
    function ($rootScope) {
      return {
        restrict: 'A',
        templateUrl: '/ng1/scripts/core/tickets/assign-user/assign-user.tpl.html',
        controller: 'quicktech.core.tickets.assignUserCtrl',
        scope: {
          ticketId: "=aubTicketId",
          ticketNumber: "=aubTicketNumber",
          ticketAssignedUserId: "=ticketAssignedUserId",
          currentUser: '=aubCurrentUser',
          usersCurrentCompany: "=users",
          isBulkOperation: '=aubIsBulkOperation',
          onUserAssign: '&onUserAssign',
          createTicket: '<aubCreateTicket'
        },
        link: function (scope) {
          scope.getUserName = $rootScope.getUserName;
          scope.getUserAvatarUrl = $rootScope.getUserAvatarUrl;
        }
      };
    }]);

})();
