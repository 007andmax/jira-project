'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.createTicketCtrl',
    ['$scope', '$modalInstance', 'TicketsService', function ($scope, $modalInstance, TicketsService) {

      $scope.ticket = {};

      TicketsService.getActualNumber($scope, function (number) {
          $scope.ticketNumber = number;
        }
      );

    }]);

}());
