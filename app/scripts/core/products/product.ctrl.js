'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', 'ProductsService', '$rootScope',
      function ($scope, ProductsService, $rootScope) {

        $scope.openEditProduct = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showEditProduct = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showEditProduct = false;
        });

        $scope.deleteProduct = function () {
          ProductsService.deleteProduct($scope.product.versionedId.id)
        };

      }]);

}());
