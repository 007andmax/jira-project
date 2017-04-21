'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productsListCtrl',
    ['$scope', function ($scope) {

      var unsubscribe = $scope.$on('showCategory', function (event, categoryId) {
        $scope.categoryId = categoryId ? categoryId : undefined;
      });

      var unsubscribeDestroy = $scope.$on('$destroy', function (info) {
        if (info.targetScope && info.targetScope.$id === $scope.$id) {
          unsubscribe();
          unsubscribeDestroy();
        }
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
