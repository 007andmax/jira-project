'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.newModalsCtlr',
    ['$scope', '$uibModalInstance',
      function ($scope, $uibModalInstance) {
        $scope.close = $uibModalInstance.dismiss;



      }]);
}());
