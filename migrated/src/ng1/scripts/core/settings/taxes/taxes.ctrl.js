'use strict';

(function () {

  angular.module('quicktech.core.settings').controller('quicktech.core.settings.taxesCtrl',
    ['$scope', 'TaxesService', '$rootScope',
      function ($scope, TaxesService, $rootScope) {

        $scope.taxes = TaxesService.getAll();

        $scope.newTax = {
          name: '',
          rate: '',
          isDefault: false
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

        $scope.saveNewTax = function (form, dropdown) {
        
          if (form.$valid) {
            TaxesService.save($scope.newTax, function (resp) {
              if (dropdown) {
                $rootScope.newTaxIsSaved = resp;
              }

              $scope.newTax = {
                name: '',
                rate: '',
                isDefault: false
              };
              form.$setPristine();
            });
          }
        };

      }
    ]);

}());
