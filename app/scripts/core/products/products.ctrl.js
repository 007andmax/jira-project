'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', 'ProductsService', 'VendorsService', 'CompaniesService',
      function ($scope, ProductsService, VendorsService, CompaniesService) {

        $scope.numberPattern = /^\+?[0-9]{0,19}$/;

        $scope.categories = ProductsService.getCategories($scope);

        $scope.vendors = VendorsService.getAllInCompanyForAutocomplete(CompaniesService.getCurrentCompany().id);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.addProduct = function () {
          $scope.showCreateProduct = true;
          $scope.createProduct = {};
          //$location.hash('createNewProduct');
          //$anchorScroll();
        };

        $scope.cancelCreateProduct = function () {
          $scope.showCreateProduct = false;
        };

        $scope.createNewProduct = function (form, categoryId) {
          $scope.createProduct.category = {id: categoryId};
          if (form.$valid) {
            $scope.disabledCreateProductButton = true;
            delete $scope.createProduct.vendor.name;
            ProductsService.saveProduct($scope.createProduct, function () {
              $scope.showCreateProduct = false;
              $scope.disabledCreateProductButton = false;
            });
          } else {
            console.log("tried to save product = true");
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.addCategory = function (form) {
          if (form.$valid) {
            ProductsService.saveCategory({name: $scope.newCategoryName});
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.isUniqueCategoryName = function (ngModelCtrl) {
          var uniqueNameCount = 0;
          for (var i = 0; i < $scope.categories.length; i++) {
            if (ngModelCtrl.$viewValue === $scope.categories[i].name) {
              uniqueNameCount++
            }
          }
          if (uniqueNameCount >= 1) {
            ngModelCtrl.$setValidity('unique', false);
          } else {
            ngModelCtrl.$setValidity('unique', true);
          }
        };

      }]);

}());
