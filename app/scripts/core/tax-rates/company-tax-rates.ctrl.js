'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.companyTaxRatesCtrl',
    ['$scope',
      function ($scope) {

        var showTax = false;

        $scope.$watch('clientCompanyTax', function (val) {
          if (val) {
            $scope.taxRates = val[$scope.company.id];
          }
        }, true);

        $scope.companyService = true;

        $scope.toggleTax = function () {
          $scope.$emit('toggleTax');
          showTax = !showTax;
        };

      }]);

}());
