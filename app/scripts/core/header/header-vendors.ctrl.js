'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.vendorsCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      function ($scope, SharedStateService) {

        $scope.sharedState = SharedStateService.getSharedState('vendorsHeader');

      }]);

}());
