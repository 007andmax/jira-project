'use strict';

(function () {

  angular.module('quicktech.core.users').controller('quicktech.core.companies.TaxRateCtrl',
    ['$scope',
      function ($scope) {

        $scope.editCurrentlyTax = function () {
          $scope.isEditing = true;
        };

        $scope.saveCurrentlyTax = function (currentlyTaxType, currentlyTaxRate, index) {
          if (!(currentlyTaxType && currentlyTaxRate)) {
            return;
          }
          ;
          $scope.isEditing = false;
          $scope.editCompany.taxRates[index] = {"rate": currentlyTaxRate, "code": currentlyTaxType};
        };

        $scope.deleteCurrentlyTax = function (index) {
          $scope.editCompany.taxRates.splice(index, 1);
        };

        $scope.validateCompanyEmail = function (ngModelCtrl) {
          var validationResult = ContactsService.isEmailUnique(ngModelCtrl.$viewValue, $scope.editCompany.id || '', function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

      }]);

}());
