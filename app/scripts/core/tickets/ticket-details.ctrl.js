'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketDetailsCtrl',
    ['$scope', '$rootScope', 'TicketsService', '$stateParams', 'UsersService', 'CompaniesService',
      function ($scope, $rootScope, TicketsService, $stateParams, UsersService, CompaniesService) {

        $scope.ticketDetails = TicketsService.getOne($stateParams.ticketId, $scope, true, function(){

          $scope.$broadcast('ticketDetailsLoad');

          $scope.user = UsersService.getOneById($scope.ticketDetails.createdUser.id);
          $scope.company = CompaniesService.getOneById($scope.ticketDetails.company.id);

        });

        $scope.renderDateTime = function (time) {

          var data = new Date(time);

          if (Object.prototype.toString.call(data) === "[object Date]" && !isNaN(data.getTime())) {
            return data.toUTCString();
          }
        };

      }]);

}());
