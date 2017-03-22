'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxesCtrl',
    ['$scope', 'TaxesService',
      function ($scope, TaxesService) {

        $scope.taxes = TaxesService.getAll();

        $scope.newTax = {
          name: '',
          rate: ''
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && form[fieldName].$dirty && form[fieldName].$invalid;
        };

        $scope.isUniqueName = function (modelCtrl, taxId, callback) {
          TaxesService.isUniqueName(modelCtrl.$viewValue, taxId, function (resp) {
            modelCtrl.$setValidity('unique', resp.valid);
            callback();
          })
        };

        $scope.saveNewTax = function (form) {
          if (form.$valid) {
            TaxesService.save($scope.newTax, function () {
              $scope.newTax = {};
              form.$setPristine();
            });
          }
        };

      }
    ]);

}());
