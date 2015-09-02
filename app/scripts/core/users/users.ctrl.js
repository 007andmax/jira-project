'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', '$rootScope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService',
      function ($scope, $rootScope, UsersService, SubscriptionsService, CompaniesService, StatisticsService, SharedStateService) {

        $scope.editUser = undefined;

        var headerSharedState = SharedStateService.getSharedState('usersHeader');

        $scope.users = UsersService.getClientUsers();

        $scope.$watch('users.length', function (usersCount) {
          headerSharedState.count = usersCount;
        });

        $scope.subscriptions = SubscriptionsService.getAllClientUserSubscriptions($scope);
        $scope.submittedTickets = StatisticsService.getUserSubmittedTicketsByCompany(CompaniesService.getCurrentCompany().id, $scope)

        $scope.getUserCompanyName = function (user) {
          return CompaniesService.getOneById(user.company.id).name;
        };

        $scope.usersFilter = function (value) {
          if (headerSharedState.filter.keyword && headerSharedState.filter.keyword.length > 0) {
            return (value.firstName + ' ' + value.lastName).toLowerCase().indexOf(headerSharedState.filter.keyword.toLowerCase()) > -1;
          }
          return true;
        };

        $scope.getUserName = function (user) {
          return user.firstName + ' ' + user.lastName;
        };

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('usersHeader');
        });

        $scope.$on('cancelEditForm', function () {
          $scope.editUser = undefined;
        });

        $scope.changeUserRole = function (userId, userRole) {
          UsersService.changeUserRole(userId, userRole);
        };

        $scope.setEditUserId = function (userId) {

          $rootScope.$broadcast('cancelEditForm');

          if (userId) {
            var user = UsersService.getOneById(userId);
            var userSubscription = $scope.subscriptions[user.id];
            var avatar = user.avatar;

            userSubscription = userSubscription ? userSubscription.staticCopy() : {};
            avatar = avatar ? avatar.staticCopy() : {};

            $scope.editUser = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              designation: user.designation,
              role: user.role,
              primaryEmail: user.primaryEmail,
              phoneNumbers: user.phoneNumbers.staticCopy(),
              companyId: user.company.id,
              subscription: userSubscription,
              avatar: avatar
            };

          } else {
            $scope.editUser = undefined;
          }
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
