'use strict';

(function () {

  angular.module('quicktech.core.companies').controller('quicktech.core.companies.confirmModal',
    ['$scope', '$uibModalInstance', 'action',
      function ($scope, $uibModalInstance, action) {
        $scope.close = $uibModalInstance.dismiss;

        $scope.delete = function() {
          action($scope.close);
        }

      }]);
}());
