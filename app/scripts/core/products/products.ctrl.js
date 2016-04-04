'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', '$rootScope', 'ProductsService', 'VendorsService', 'CompaniesService',
      function ($scope, $rootScope, ProductsService, VendorsService, CompaniesService) {

        $scope.isCreateCategoryShow = false;
        $scope.newCategory = {};
        $scope.categories = ProductsService.getCategories($scope);
        $scope.vendors = VendorsService.getAllInCompanyForAutocomplete(CompaniesService.getCurrentCompany().id);
        $scope.showCategory = '';

        $scope.status = {
          isopen: false
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

        $scope.closeCreateCategoryForm = function(){
          $scope.isCreateCategoryShow = false;
        }

      }]);

}());
