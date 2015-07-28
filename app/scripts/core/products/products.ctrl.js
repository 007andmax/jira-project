'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', 'ProductsService', 'VendorsService', 'CompaniesService',
      function ($scope, ProductsService, VendorsService, CompaniesService) {

        $scope.numberPattern = /^\+?[0-9]{0,19}$/;

        $scope.categories = ProductsService.getCategories($scope);

        $scope.vendors = VendorsService.getAllInCompanyForAutocomplete(CompaniesService.getCurrentCompany().id);


        //$scope.openCreateCategory = function() {
        //  $scope.showCreateCategory = true;
        //};

        $scope.status = {
          isopen: false
        };

        //$scope.newCategory = {};

        $scope.addCategory = function (form) {
          if (form.$valid) {
            ProductsService.saveCategory($scope.newCategory, function () {
              $scope.status.isopen = false;
              $scope.newCategory = {};
              form.$setPristine()
            });
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.validateProductName = function (ngModelCtrl, modelId) {
          var validationResult = ProductsService.isProductNameUnique(ngModelCtrl.$viewValue, modelId || '', CompaniesService.getCurrentCompany().id, function () {
            ngModelCtrl.$setValidity('unique', validationResult.value);
          });
        };

      }]);

}());
