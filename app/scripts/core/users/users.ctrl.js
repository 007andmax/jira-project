'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', '$rootScope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService',
      function ($scope, $rootScope, UsersService, SubscriptionsService, CompaniesService, StatisticsService,
                SharedStateService, PermissionsService) {

        $scope.editUser = undefined;

        var headerSharedState = SharedStateService.getSharedState('usersHeader');

        $scope.users = UsersService.getClientUsers();

        $scope.$watch('users.length', function (usersCount) {
          headerSharedState.count = usersCount;
        });

        $scope.getUserCompanyName = function (user) {
          return CompaniesService.getOneById(user.company.id).name;
        };

        $scope.usersFilter = function (value) {
          if (value.isDefault) {
            return false
          }

          if (headerSharedState.filter.companyId && headerSharedState.filter.companyId.length > 0) {
            return headerSharedState.filter.companyId === value.company.id;
          }

          if (headerSharedState.filter.keyword && headerSharedState.filter.keyword.length > 0) {
            var email = (value.primaryEmail && value.primaryEmail.length) > 0 ? value.primaryEmail : '';
            var searchText = (value.firstName + ' ' + value.lastName + ' ' + email).toLowerCase();
            return searchText.indexOf(headerSharedState.filter.keyword.toLowerCase()) > -1;
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

            var clientCompanies = CompaniesService.getClientCompanies();

            if (!clientCompanies || clientCompanies.length < 1) {
              alert('Create at list one company before adding users');
              return;
            }

            var user = UsersService.getOneById(userId);
            var userSubscription = user.subscription;
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
              avatar: avatar,
              userEnabled: user.userEnabled
            };

          } else {
            $scope.editUser = undefined;
          }
        };

        $scope.subscribeUser = function (user, nameSubscription) {

          $scope.disabledCheckbox = true;

          var subscription = user.subscription;

          if (subscription) {
            subscription = subscription.staticCopy()
          } else {
            subscription = {
              user: {id: user.id}
            }
          }

          subscription[nameSubscription] = !subscription[nameSubscription];
          SubscriptionsService.saveUserSubscription(subscription, function () {
            $scope.disabledCheckbox = false;
          });
        };

      }]);

}());
