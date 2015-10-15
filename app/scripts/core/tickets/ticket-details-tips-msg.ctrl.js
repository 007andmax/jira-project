'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsTipsMsgCtrl',
    ['$scope', 'TicketsService', '$state', '$stateParams', 'quicktech.common.services.UserNotificationService',
      function ($scope, TicketsService, $state, $stateParams, UserNotificationService) {

        calculateDays();

        $scope.markAsOpen = function () {
          TicketsService.changeStatus($scope.ticketDetails.id, 'IN_PROGRESS', function () {
            UserNotificationService.show('The ticket “' + $scope.ticketDetails.number + '” has been marked as open', true);
            $state.go('tickets', {listType: $stateParams.listType});
          });
        };

        function calculateDays (){
          var now = new Date(),
            msToDaysCof = 86400000;

          var isWithinThirtyDays = (now - $scope.ticketDetails.closedAt)/msToDaysCof;

          $scope.daysLeftToOpen = Math.ceil(30 -isWithinThirtyDays);
        }

      }]);

}());
