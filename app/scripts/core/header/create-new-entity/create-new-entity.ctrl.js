'use strict';

(function () {

  angular.module("quicktech").controller("createNewEntityCtrl",
    ['$scope', 'resolvedExistedItem', 'sessionId', 'sessionTime', 'resolvedDeviceId', 'resolvedCompanyId', 'resolvedOpenedTab',
      '$uibModalInstance', 'quicktech.common.services.PermissionsService',
      function ($scope, resolvedExistedItem, sessionId, sessionTime, resolvedDeviceId, resolvedCompanyId, resolvedOpenedTab,
                $uibModalInstance, PermissionsService) {

        $scope.openedTab = resolvedOpenedTab || 'ticket';

        if (resolvedExistedItem) {
          $scope.savedState = { types: [$scope.openedTab], items: [angular.copy(resolvedExistedItem)] };
        } else {
          $scope.savedState = { types: [], items: [] };
        }

        if ($scope.openedTab === 'categories') {
          $scope.openedTab = 'product';
        }

        $scope.sessionId = sessionId;
        $scope.sessionTime = sessionTime;
        $scope.resolvedDeviceId = resolvedDeviceId;
        $scope.resolvedCompanyId = resolvedCompanyId;

        $scope.closeWindow = $uibModalInstance.dismiss;

        $scope.setOpenedTab = function (tabName) {
          $scope.openedTab = tabName;
        };

        $scope.getLastSavedState = function (type) {
          if (type !== $scope.savedState.types[0]) {
            return {};
          }

          return {
            type: $scope.savedState.types.length > 0 ? $scope.savedState.types.shift() : undefined,
            item: $scope.savedState.items.length > 0 ? $scope.savedState.items.shift() : undefined
          }
        };

        $scope.PermissionsService = PermissionsService;

        $scope.$on('createNewEntity', function (event, type) {
          var unsubscribe = $scope.$on('new' + type.charAt(0).toUpperCase() + type.slice(1) + 'HasBeenCreated',
            function (e, id) {
              var savedState = $scope.savedState;
              var savedItem = savedState.items[0];

              if (savedState.types[0] === 'ticket') {
                if (type === 'user') {
                  $scope.resolvedCreatedUserId = id;
                } else if (type === 'company') {
                  $scope.resolvedCompanyId = id;
                }
              } else if ((savedState.types[0] === 'user' || savedState.types[0] === 'product') && type === 'company') {
                savedItem.company = { id: id };
              }

              $scope.setOpenedTab(savedState.types[0]);

              unsubscribe();
            });
        });
      }]);
})();
