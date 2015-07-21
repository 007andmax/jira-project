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

        $scope.addCategory = function () {
          console.log("add category");
          console.log($scope.newCategoryName);
          $scope.newCategory = {
            name: $scope.newCategoryName
          };
          //ProductsService.saveCategory($scope.newCategory);
        };

    }]);

}());
