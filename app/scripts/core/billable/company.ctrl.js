'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyCtrl',
    ['$scope',
      function ($scope) {

        $scope.toggleInvoices = function () {
          $scope.$emit('toggleBillableInvoices');
        };

      }]);

}());
