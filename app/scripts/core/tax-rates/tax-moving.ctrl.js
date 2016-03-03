'use strict';

(function () {

  angular.module('quicktech.core.taxRates').controller('quicktech.core.taxRates.taxMovingCtrl',
    ['$scope', 'ServicesService', 'CompaniesService', 'TaxRatesService',
      function ($scope, ServicesService, CompaniesService, TaxRatesService) {

        var startCompanyMapping;

        $scope.moveMaping = {};
        $scope.searchCompany = '';
        $scope.clientCompanies = CompaniesService.getClientCompanies();

        $scope.openDropdown = function () {

          var selectTax = [];
          $scope.companyMapping = {};

          for (var taxId in $scope.checkedTax) {
            if ($scope.checkedTax[taxId]) {
              selectTax.push(taxId)
            }
          }

          for (var i = 0; i < $scope.clientCompanies.length; i++) {
            $scope.companyMapping[$scope.clientCompanies[i].id] = {checked: false, notAll: false};

            if ($scope.clientCompanyTax[$scope.clientCompanies[i].id]) {
              var count = 0;

              for (var j = 0; j < $scope.clientCompanyTax[$scope.clientCompanies[i].id].length; j++) {
                if (selectTax.indexOf($scope.clientCompanyTax[$scope.clientCompanies[i].id][j].originalTaxRate.versionedId.id) !== -1) {
                  count++;
                  $scope.companyMapping[$scope.clientCompanies[i].id] = {checked: true}
                }
              }

              if (count > 0 && count !== selectTax.length) {
                $scope.companyMapping[$scope.clientCompanies[i].id].notAll = true;
              }

            }
          }

          startCompanyMapping = angular.copy($scope.companyMapping)

        };

        $scope.changeCompanyMapping = function (companyId) {
          if ($scope.companyMapping[companyId].checked && $scope.companyMapping[companyId].notAll) {
            $scope.companyMapping[companyId].notAll = false;
            $scope.companyMapping[companyId].checked = true;
          } else {
            $scope.companyMapping[companyId].checked = !$scope.companyMapping[companyId].checked;
          }
        };

        $scope.moveTax = function () {
          var moveObj = {};

          for (var taxId in $scope.checkedTax) {
            if ($scope.checkedTax[taxId]) {
              moveObj[taxId] = getSelectCompaniesArray()
            }
          }

          TaxRatesService.move(moveObj);

          function getSelectCompaniesArray() {
            var arr = [];

            for (var i = 0; i < $scope.clientCompanies.length; i++) {
              if ($scope.companyMapping[$scope.clientCompanies[i].id].checked && !$scope.companyMapping[$scope.clientCompanies[i].id].notAll) {
                arr.push($scope.clientCompanies[i].id)
              }
            }
            return arr;
          }

        };

        $scope.isDisabledMove = function () {
          return angular.equals($scope.companyMapping, startCompanyMapping);
        }

      }]);

}());
