'use strict';

(function () {

  angular.module("quicktech.core.tickets").directive('assignUserButton',['$rootScope',
    function ($rootScope) {
      return {
        restrict: 'A',
        templateUrl: '/html/scripts/core/tickets/assign-user/assign-user.tpl.html',
        controller: 'quicktech.core.tickets.assignUserCtrl',
        scope: {
          ticketId: "=aubTicketId",
          currentUser: '=aubCurrentUser',
          usersCurrentCompany: "=users"
        },
        link: function (scope) {
          scope.getUserName = $rootScope.getUserName;
          scope.getUserAvatarUrl = $rootScope.getUserAvatarUrl;
        }
      };
    }]);

})();
