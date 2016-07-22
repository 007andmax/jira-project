'use strict';

(function () {

  angular.module('quicktech.core.leftPanel').controller('quicktech.core.leftPanel.leftPanelCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService', '$state', '$rootScope',
      'quicktech.common.services.PermissionsService',
      function ($scope, SharedStateService, $state, $rootScope, PermissionsService) {

        var sharedQuickSession = SharedStateService.getSharedState('quickSession');

        $scope.$state = $state;
        $scope.PermissionsService = PermissionsService;
        $rootScope.isLeftPanelHidden = false;

        $scope.$watch(function () {
          return $state.current.url + ' ' + $state.current.name;
        }, function (value) {
          if (value && value !== '^ ') {
            $scope.openedCategory = getOpenedCategory(value);
          }
        });

        $scope.toggleLeftPanel = function (section) {
          if ($scope.openedCategory === section && !$rootScope.isLeftPanelHidden) {
            $rootScope.isLeftPanelHidden = true;
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
