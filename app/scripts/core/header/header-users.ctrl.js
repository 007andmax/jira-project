'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.usersCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      function ($scope, SharedStateService) {

        $scope.sharedState = SharedStateService.getSharedState('usersHeader');

      }]);

}());
