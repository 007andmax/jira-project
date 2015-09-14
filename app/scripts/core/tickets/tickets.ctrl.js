'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.TicketsCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams) {

        var availableTypes = ['unassigned', 'user', 'shared', 'spam'];

        if ($scope.currentUser.role === 'ADMIN' || $scope.currentUser.role === 'SUPER_TECH_ADMIN') {
          availableTypes.push('open');
          availableTypes.push('closed');
          availableTypes.push('trash');
        }

        $scope.$watch(function () {
          return $stateParams.listType;
        }, function (listType) {

          if (availableTypes.indexOf(listType) < 0) {
            $state.go('tickets', {
              listType: availableTypes[0]
            });
          } else {
            $scope.listType = listType;
          }
        });

      }]);

}());
