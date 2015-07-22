'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        $scope.numberPattern = /^\+?[0-9]{0,19}$/;

        $scope.categories = ProductsService.getCategories($scope);

        $scope.isShowingErrors = function (form, fieldName) {
          return form[fieldName] && ($scope.triedToSaveProduct || form[fieldName].$dirty) && !form[fieldName].$valid;
        };

        $scope.addCategory = function (form) {
          if (form.$valid) {
            //ProductsService.saveCategory({name: $scope.newCategoryName});
          }
        };

        $scope.isUniqueCategoryName = function (form) {
          var uniqueNameCount = 0;
          for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.newCategoryName === $scope.categories[i].name) {
              console.log(uniqueNameCount);
              uniqueNameCount++
            }
          }
          if (uniqueNameCount >= 1) {
            form.newCategoryName.$setValidity('unique', false);
          } else {
            form.newCategoryName.$setValidity('unique', true);
          }
        };

      }]);

}());
