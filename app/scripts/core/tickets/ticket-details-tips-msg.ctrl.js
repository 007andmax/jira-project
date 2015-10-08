'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsTipsMsgCtrl',
    ['$scope', 'TicketsService', '$state', '$stateParams', 'quicktech.common.services.UserNotificationService', '$timeout',
      function ($scope, TicketsService, $state, $stateParams, UserNotificationService, $timeout) {

        $scope.markAsOpen = function () {
          TicketsService.changeStatus($scope.ticketDetails.id, 'IN_PROGRESS', function () {
            UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as open', true);
            $state.go('tickets', {listType: $stateParams.listType});
          });
        };

      }]);

}());
