'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.companyCtrl',
    ['$scope',
      function ($scope) {

        $scope.toggleInvoices = function () {
          $scope.$emit('toggleReceivableInvoices');
        };

      }]);

}());
