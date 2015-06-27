'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.companiesCtrl',
    ['$scope', 'quicktech.common.services.SharedStateService',
      function ($scope, SharedStateService) {

        $scope.sharedState = SharedStateService.getSharedState('companiesHeader');

      }]);

}());
