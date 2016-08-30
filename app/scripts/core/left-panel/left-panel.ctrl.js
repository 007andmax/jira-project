'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope', 'DevicesService',
      'quicktech.common.services.PermissionsService', 'TicketsService', 'CompaniesService', 'UsersService',
      function ($scope, SharedStateService, $state, $rootScope, DevicesService, PermissionsService, TicketsService,
                CompaniesService, UsersService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession'),
          globalSearch = SharedStateService.getSharedState('globalSearch');

        $scope.qSHistoryExpanded = false;

        $scope.clientCompanies = CompaniesService.getClientCompanies;
        $scope.clientUsers = UsersService.getClientUsers;

        $scope.$state = $state;
        $scope.ticketCounts = TicketsService.getCounts($scope);
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.qSHistory = DevicesService.getOneTimeHistory();

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
            globalSearch.searchValue = $scope.getUserName(user);
            globalSearch.preventClearing = true;
          });
        };

        $scope.toggleQSHistory = function ($event) {
          $scope.qSHistoryExpanded = !$scope.qSHistoryExpanded;
        };

        function getOpenedCategory(url) {
          if (url.indexOf('quickSupport') > -1) {
            return 'dashboard';
          } else if (url.indexOf('tickets') > -1) {
            return 'tickets';
          } else if (url.indexOf('companies') > -1 || url.indexOf('companyProfile') > -1) {
            return 'companies';
          } else if (url.indexOf('users') > -1) {
            return 'users';
          } else if (url.indexOf('accounting') > -1) {
            return 'accounting';
          } else if (url.indexOf('inventory') > -1) {
            return 'products';
          } else {
            return undefined;
          }
        }

      }]);

}());
