'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', 'ProductsService',
      function ($scope, ProductsService) {

        $scope.vendors = []; // ProductsService.getAllInCompanyForAutocomplete(companyId, callback)

        $scope.openEditProduct = function () {
          $scope.showEditProduct = true;
          $scope.editProduct = {
            name: $scope.product.name,
            cost: $scope.product.cost,
            sale: $scope.product.sale,
            description: $scope.product.description
          };
        };

        $scope.cancelEditProduct = function () {
          $scope.showEditProduct = false;
        };

        $scope.saveChangeProduct = function (form) {
          $scope.editProduct.versionedId = $scope.product.versionedId;
          $scope.editProduct.category = {
            id: $scope.category.id
          };
          if (form.$valid) {
            $scope.disabledSaveChangeButton = true;
            //ProductsService.saveProduct($scope.editProduct, function() {
            //  $scope.showEditProduct = false;
            //  $scope.disabledSaveChangeButton = false;
            //})
          } else {
            $scope.triedToSaveProduct = true;
          }
        };

        $scope.deleteProduct = function () {
          //ProductsService.deleteProduct($scope.product.versionedId.id)
        };

      }]);

}());
