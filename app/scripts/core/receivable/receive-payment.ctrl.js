'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivePaymentCtrl',
    ['$scope', '$modalInstance',
      function ($scope, $modalInstance) {

        $scope.close = function () {
          $modalInstance.dismiss('cancel');
        };

      }]);

}());
