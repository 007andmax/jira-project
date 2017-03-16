'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxesCtrl',
    ['$scope', 'TaxesService',
      function ($scope, TaxesService) {

        TaxesService.getAll($scope, function (resp) {
          $scope.taxes = angular.copy(resp);
        });

        $scope.newTax = {
          name: '',
          rate: ''
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

        $scope.saveNewTax = function (form) {
          if (form.$valid) {
            TaxesService.save($scope.newTax, function () {
              $scope.newTaxRate = {};
              form.$setPristine();
            });
          }
        };

      }
    ]);

}());
