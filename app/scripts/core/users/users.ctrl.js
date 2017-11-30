'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.users.usersCtrl',
    ['$scope', '$rootScope', 'UsersService', 'SubscriptionsService', 'CompaniesService', '$timeout',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService', '$state',
      'localStorageService', 'ColorsService', 'TagsService',
      function ($scope, $rootScope, UsersService, SubscriptionsService, CompaniesService, $timeout,
                SharedStateService, PermissionsService, $state, localStorageService, ColorsService, TagsService) {

        if (!PermissionsService.isAllowed('VIEW_USERS')) {
          $state.go('tickets');
        }

        var headerSharedState = SharedStateService.getSharedState('usersHeader');
        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var availableViews = ['list', 'grid'];

        $scope.usersCtrl = {};

        $scope.usersView = localStorageService.get('users-view') || 'grid';
        $scope.orderUsers = {
          field: 'name',
          reverse: false
        };

        $scope.PermissionsService = PermissionsService;
        $scope.users = UsersService.getClientUsers();
        $scope.archivedUsers = UsersService.getArchivedUsers();

        $scope.tagColors = TagsService.getColors();

        ColorsService.getUserColors($scope, function(resp) {
          $scope.usersColors = resp;
        });

        $scope.changeView = function (view) {
          if (availableViews.indexOf(view) !== -1) {
            $scope.usersView = view;
            localStorageService.set('users-view', view);
          }
        };

        $scope.$watch('usersCtrl.shownUsers.length', function (usersCount) {
          globalSearch.count = usersCount;
        });

        $scope.getUserCompanyName = function (user) {
          return user.company.isDefault ? '' : CompaniesService.getOneById(user.company.id).name;
        };

        $scope.getUserType = function(user) {
          var filter = headerSharedState.filter;
          if(user.role === 'ADMIN') {
            return 'MANAGER';
          }else {
            // var company = CompaniesService.getOneById(user.company.id);
            // var type = company.clientType;
            // return type;
            return 'CLIENT'
          }

        };

        $scope.usersFilter = function (value) {
          var filter = headerSharedState.filter;
          var company = CompaniesService.getOneById(value.company.id);
          var clientType = company.clientType;
          var isUserDeleted = value.deletedAt || company.deletedAt;
          var result = !isUserDeleted && !$rootScope.showArchivedUsers || $rootScope.showArchivedUsers && isUserDeleted;

          if (value.isDefault || value.default || value.accountType === 'TECH') {
            return false;
          }

          if (filter.userId) {
            result = result && filter.userId === value.id;
          }

          if (filter.companyId) {
            result = result && filter.companyId === value.company.id;
          }

          if (filter.isContact) {
            result = result && value.isContact;
          }

          if(filter.isStandard) {
            result = result && !value.isContact;
          }

          if (filter.isLead) {
            result = result && clientType && clientType.toLowerCase() === 'lead';
          }

          if (filter.isClient) {
            result = result && clientType && clientType.toLowerCase() === 'client';
          }

          // if(filter.isArchived) {
          //   result = result && !value.userEnabled;
          //   console.log(result && !value.userEnabled);
          // }

          if (filter.industry) {
            var industryName = company.clientIndustry ? (company.clientIndustry.name || '') : '';
            result = result && industryName.toLowerCase() === filter.industry.toLowerCase();
          }
          return result;
        };

        $scope.getUserName = function (user) {
          return user.firstName + ' ' + user.lastName;
        };

        $scope.$on('$destroy', function () {
          headerSharedState.filter = {};
        });

        $scope.changeUserRole = function (userId, userRole) {
          UsersService.changeUserRole(userId, userRole);
        };

        $scope.subscribeUser = function (user, nameSubscription) {
          if ($scope.disabledCheckbox || (nameSubscription === 'invoice' && $scope.isLastUserWithInvoiceSubscription(user))) {
            return;
          }

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

        $scope.goToUserTickets = function (user) {
          globalSearch.searchValue = '';
          $timeout(function () {
            $state.go('tickets', { listType: 'all' }).then(function () {
              $scope.sharedState = SharedStateService.getSharedState('ticketsHeader');
              $scope.sharedState.searchFilter.companyId = '';
              $scope.sharedState.searchFilter.userId = user.id;
              globalSearch.preventClearing = true;
              globalSearch.searchValue = $scope.getUserName(user);
            });
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

        $scope.isLastUserWithInvoiceSubscription = function (targetUser) {
          var users = UsersService.getAllByCompanyId(targetUser.company.id);

          for (var id in users) {
            var user = users[id];
            if (user.id === targetUser.id) {
              continue;
            }

            if (user.subscription && user.subscription.invoice) {
              return false;
            }
          }
          return true;
        };

      }]);

}());
