'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('usersHeader');

        $scope.users = UsersService.getClientUsers();

        $scope.$watch('users.length', function (usersCount) {
          headerSharedState.count = usersCount;
        });

        //TODO fix data loading
        UsersService._addInitListener(function () {
          $scope.subscriptions = SubscriptionsService.getAllClientUserSubscriptions($scope);
          $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany(CompaniesService.getCurrentCompany().id, $scope)
        });

        $scope.getUserCompanyName = function (user) {
          return CompaniesService.getOneById(user.company.id).legalName;
        };

        $scope.usersFilter = function (value) {
          if (value && value.length > 0) {
            return (value.firstName + ' ' + value.lastName).indexOf(headerSharedState.filter) > -1;
          }
          return true;
        };

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('usersHeader');
        });

      }]);

}());
