'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.quickSupportCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      function ($scope, SharedStateService) {

        $scope.sharedQuickSession = SharedStateService.getSharedState('quickSession');

      }]);

}());
