'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      function ($scope, UsersService, SubscriptionsService, CompaniesService, StatisticsService) {

        $scope.users = UsersService.getClientUsers();
        //TODO fiz data loading
        UsersService._addInitListener(function () {
          $scope.subscriptions = SubscriptionsService.getUserSubscriptionsByCompanyId(CompaniesService.getCurrentCompany().id, $scope);
          $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany(CompaniesService.getCurrentCompany().id, $scope)
        })

        $scope.getUserCompanyName = function (user) {
          return CompaniesService.getOneById(user.company.id).legalName;
        };

      }]);

}());
