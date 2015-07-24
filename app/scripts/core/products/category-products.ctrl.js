'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.categoryProductsCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        $scope.products = ProductsService.getAllByCategory($scope, $scope.category.id, function () {
          $scope.$emit('toggleProducts');
        }, true);


      }]);

}());
