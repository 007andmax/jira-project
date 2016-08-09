'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope',
      'quicktech.common.services.PermissionsService', 'TicketsService', 'CompaniesService', 'UsersService',
      function ($scope, SharedStateService, $state, $rootScope, PermissionsService, TicketsService,
                CompaniesService, UsersService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.companiesExpanded = false;
        $scope.usersExpanded = false;

        $scope.clientCompanies = CompaniesService.getClientCompanies;
        $scope.clientUsers = UsersService.getClientUsers;

        $scope.$state = $state;
        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.$watch(function () {
          return $state.current.url + ' ' + $state.current.name;
        }, function (value) {
          if (value && value !== '^ ') {
            $scope.openedCategory = getOpenedCategory(value);

            if (!$scope.openedCategory) {
              $rootScope.isLeftPanelHidden = true;
            }
          }
        });

        $scope.$on('leftPanelClosedFromQTSidebar', function () {
          $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
        });

        $scope.toggleLeftPanel = function (section) {
          if ($scope.openedCategory === section && !$rootScope.isLeftPanelHidden) {
            $rootScope.isLeftPanelHidden = true;
            $scope.openedCategory = getOpenedCategory($state.current.url + ' ' + $state.current.name);
          } else {
            $scope.openedCategory = section;
            $rootScope.isLeftPanelHidden = false;
          }
        };

        $scope.addQuickSession = function () {
          sharedQuickSession.isCreateNew = true;
        };

        $scope.stateGo = function (event, state, stateParams) {
          if (event.button > 0) {
            var url = $state.href(state, stateParams, { absolute: true });
            window.open(url, '_blank');
          } else {
            $state.go(state, stateParams);
          }

        };

        $scope.goToCompany = function (company) {
          $state.go('companyProfile', { companyId: company.id });
        };

        $scope.goToUser = function (user) {
          $state.go('users').then(function () {
            SharedStateService.getSharedState('usersHeader').filter.userId = user.id;
            SharedStateService.getSharedState('globalSearch').searchValue = $scope.getUserName(user);
          });
        };

        $scope.toggleCompanies = function (oldValue, $event) {
          $scope.companiesExpanded = !oldValue;
          $scope.usersExpanded = false;
          $event.stopPropagation();
        };

        $scope.toggleUsers = function (oldValue, $event) {
          $scope.usersExpanded = !oldValue;
          $scope.companiesExpanded = false;
          $event.stopPropagation();
        };

        function getOpenedCategory(url) {
          if (url.indexOf('quickSupport') > -1) {
            return 'dashboard';
          } else if (url.indexOf('tickets') > -1) {
            return 'tickets';
          } else if (url.indexOf('clients') > -1 || url.indexOf('users') > -1) {
            return 'clients';
          } else if (url.indexOf('accounting') > -1) {
            return 'accounting';
          } else if (url.indexOf('inventry') > -1) {
            return 'products';
          } else {
            return undefined;
          }
        }

      }]);

}());
