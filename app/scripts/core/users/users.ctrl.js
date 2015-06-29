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

          $scope.getUserCompanyName = function (user) {
            return CompaniesService.getOneById(user.company.id).name;
          };
        });

        $scope.usersFilter = function (value) {
          if (headerSharedState.filter.keyword && headerSharedState.filter.keyword.length > 0) {
            return (value.firstName + ' ' + value.lastName).toLowerCase().indexOf(headerSharedState.filter.keyword.toLowerCase()) > -1;
          }
          return true;
        };

        $scope.getUserName = function (user) {
          return user.firstName + ' ' + user.lastName;
        };

        $scope.setEditUserId = function (userId) {
          $scope.editUserId = userId;
        };

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('usersHeader');
        });

        $scope.changeUserRole = function (userId, userRole) {
          UsersService.changeUserRole(userId, userRole);
        };

        $scope.subscribeUser = function (userId, nameSubscription) {
          var subscription = $scope.subscriptions[userId];

          if (subscription) {
            subscription = subscription.staticCopy()
          } else {
            subscription = {
              user: {id: userId}
            }
          }

          subscription[nameSubscription] = !subscription[nameSubscription];
          SubscriptionsService.saveUserSubscription(subscription);
        };

      }]);

}());
