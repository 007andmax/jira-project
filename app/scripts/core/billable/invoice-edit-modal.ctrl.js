'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.invoiceEditModalCtrl',
    ['$scope', '$uibModalInstance', '$timeout',
      function ($scope, $uibModalInstance, $timeout) {
        $scope.close = function () {
          $uibModalInstance.dismiss();
        };
      }]);

}());
