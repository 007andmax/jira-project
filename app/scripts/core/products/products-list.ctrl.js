'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsListCtrl',
    ['$scope', function ($scope) {

      $scope.$on('showCategory', function (event, categoryId) {
        $scope.categoryId = categoryId ? categoryId : undefined;
      });

      $scope.filterByCategory = function (product) {
        if ($scope.categoryId) {
          return $scope.categoryId === product.category.id;
        } else {
          return true;
        }
      };
    }]);

}());
