'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketsListCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      function ($scope, TicketsService) {

        $scope.tickets = TicketsService.getList($scope, {filter: $scope.listType.toUpperCase()});

      }]);

}());
