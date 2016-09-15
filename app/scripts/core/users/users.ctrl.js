'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', '$rootScope', 'UsersService', 'SubscriptionsService', 'CompaniesService', 'StatisticsService',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService', '$state',
      'localStorageService', 'Utils',
      function ($scope, $rootScope, UsersService, SubscriptionsService, CompaniesService, StatisticsService,
                SharedStateService, PermissionsService, $state, localStorageService, Utils) {

        if (!PermissionsService.isAllowed('VIEW_USERS')) {
          $state.go('tickets');
        }

        var headerSharedState = SharedStateService.getSharedState('usersHeader');
        var globalSearch = SharedStateService.getSharedState('globalSearch'),
          availableViews = ['list', 'grid'];

        $scope.usersCtrl = {};

        $scope.usersView = localStorageService.get('users-view') || 'grid';
        $scope.editUser = undefined;
        $scope.orderUsers = {
          field: 'name',
          reverse: false
        };

        $scope.PermissionsService = PermissionsService;
        $scope.users = UsersService.getClientUsers();
        Utils.deleteById($scope.users, UsersService.getUnassignedUser(CompaniesService.getUnassignedCompany().id).id);

        $scope.changeView = function (view) {
          if (availableViews.indexOf(view) !== -1) {
            $scope.usersView = view;
            localStorageService.set('users-view', view);
          }
        };

        $scope.$on('createNewUser', function () {
          $scope.usersView = 'grid';
        });

        $scope.$watch('usersCtrl.shownUsers.length', function (usersCount) {
          globalSearch.count = usersCount;
        });

        $scope.getUserCompanyName = function (user) {
          return user.company.isDefault ? '' : CompaniesService.getOneById(user.company.id).name;
        };

        $scope.usersFilter = function (value) {
          if (headerSharedState.filter.userId) {
            return headerSharedState.filter.userId === value.id;
          }

          if (headerSharedState.filter.companyId) {
            return headerSharedState.filter.companyId === value.company.id;
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

            $scope.isLastInvoiceSubsciption = userSubscription.invoice &&
              UsersService.getAllByCompanyId(user.company.id).filter(function (user) {
                return user.subscription.invoice;
              }).length <= 1;

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
              user: { id: user.id }
            }
          }

          subscription[nameSubscription] = !subscription[nameSubscription];
          SubscriptionsService.saveUserSubscription(subscription, function () {
            $scope.disabledCheckbox = false;
          });
        };

        $scope.setOrderByUsers = function (option) {
          if (option === $scope.orderUsers.field) {
            $scope.orderUsers.reverse = !$scope.orderUsers.reverse;
          } else {
            $scope.orderUsers.field = option;
            $scope.orderUsers.reverse = false;
          }
        };

        $scope.orderByForUsers = function (item) {
          if ($scope.orderUsers.field === 'name') {
            return item.firstName + ' ' + item.lastName;
          } else if ($scope.orderUsers.field === 'type') {
            return item.role || '';
          } else if ($scope.orderUsers.field === 'company') {
            return CompaniesService.getOneById(item.company.id).name;
          } else if ($scope.orderUsers.field === 'phone') {
            var phoneNumbers = item.phoneNumbers;
            if (phoneNumbers && phoneNumbers.length) {
              return phoneNumbers[0].number || '';
            }
          } else if ($scope.orderUsers.field === 'ticket') {
            return item.userStatistic ? item.userStatistic.ticketsSubmitted : false;
          }

        };

        $scope.setEditedUser = function (user) {
          $scope.editedUser = angular.copy(user);
        };

        $scope.isLastUserWithInvoiceSubscription = function (targetUser) {
          var users = UsersService.getAllByCompanyId(targetUser.company.id);

          for (var id in users) {
            var user = users[id];
            if (user.id === targetUser.id) {
              continue;
            }

            if (user.subscription.invoice) {
              return false;
            }
          }
          return true;
        };

      }]);

}());
