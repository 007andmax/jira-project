'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', '$rootScope', 'ProductsService', 'VendorsService', 'CompaniesService',
      function ($scope, $rootScope, ProductsService, VendorsService, CompaniesService) {

        ProductsService.getAllProducts($scope, function (resp) {
          $scope.productsList = resp;
        });

        $scope.orderProducts = {
          field: 'description',
          reverse: false
        };

        $scope.pageTab = 'group';
        $scope.isCreateCategoryShow = false;
        $scope.newCategory = {};
        $scope.categories = ProductsService.getCategories($scope);
        $scope.vendors = VendorsService.getAllInCompanyForAutocomplete(CompaniesService.getCurrentCompany().id);
        $scope.showCategory = '';

        $scope.status = {
          isopen: false
        };

        $scope.openCreationCategory = function () {
          $scope.isCreateCategoryShow = true;
        };

        $scope.setPageTab = function (tab) {
          if (tab !== $scope.pageTab) {
            if (tab === 'group' && $scope.orderProducts.field === 'category') {
              $scope.orderProducts = {
                field: 'description',
                reverse: false
              };
            }

            $scope.pageTab = tab;
          }
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveCategory || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.addCategory = function (form) {
          if (form.$valid) {
            ProductsService.saveCategory($scope.newCategory, function () {
              $scope.isCreateCategoryShow = false;
              $scope.newCategory = {};
              form.$setPristine();
            });
          } else {
            $scope.triedToSaveCategory = true;
          }
        };

        $scope.isUniqueCategoryName = function (ngModelCtrl, modelId) {
          var uniqueNameCount = 0;
          for (var i = 0; i < $scope.categories.length; i++) {
            if ((ngModelCtrl.$viewValue.toLowerCase() === $scope.categories[i].name.toLowerCase()) && (modelId !== $scope.categories[i].id)) {
              uniqueNameCount++;
            }
          }
          ngModelCtrl.$setValidity('unique', uniqueNameCount < 1);
        };

        $scope.cancelEditForms = function () {
          $rootScope.$broadcast('cancelEditForm');
        };

        $scope.closeCreateCategoryForm = function () {
          $scope.isCreateCategoryShow = false;
        };

        $scope.setOrderForProducts = function (option) {
          if (option === $scope.orderProducts.field) {
            $scope.orderProducts.reverse = !$scope.orderProducts.reverse;
          } else {
            $scope.orderProducts.field = option;
            $scope.orderProducts.reverse = false;
          }
        };

        $scope.orderByForProducts = function (item) {
          if ($scope.orderProducts.field === 'ilc') {
            return item.ilc;
          } else if ($scope.orderProducts.field === 'manufacture') {
            return item.manufacture;
          } else if ($scope.orderProducts.field === 'category') {
            return item.category.name;
          } else if ($scope.orderProducts.field === 'description') {
            return item.description;
          } else if ($scope.orderProducts.field === 'vendor') {
            return item.vendor.name;
          } else if ($scope.orderProducts.field === 'cost') {
            return item.cost;
          } else if ($scope.orderProducts.field === 'sale') {
            return item.sale;
          } else if ($scope.orderProducts.field === 'taxable') {
            return item.taxable;
          }

        };

      }]);

}());
