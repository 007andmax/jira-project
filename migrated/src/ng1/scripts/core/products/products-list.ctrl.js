'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsListCtrl',
    ['$scope', function ($scope) {

      $scope.showCategory = true;

      $scope.filterByCategory = function (product) {
        if ($scope.categoryId) {
          return $scope.categoryId === product.category.id;
        } else {
          return true;
        }
      };
    }]);

}());
