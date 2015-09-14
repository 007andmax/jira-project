'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.TicketsListCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams) {

        $scope.tickets = TicketsService.getList($scope, {filter: $scope.listType.toUpperCase()});

      }]);

}());
