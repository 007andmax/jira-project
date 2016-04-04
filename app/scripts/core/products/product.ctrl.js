'use strict';

(function () {

  angular.module('quicktech.core.products').controller('quicktech.core.products.productCtrl',
    ['$scope', 'ProductsService', '$rootScope', 'quicktech.common.services.UserNotificationService',
      function ($scope, ProductsService, $rootScope, UserNotificationService) {

        $scope.openEditProduct = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showEditProduct = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showEditProduct = false;
        });

        $scope.deleteProduct = function () {
          ProductsService.deleteProduct($scope.product.versionedId.id);
          $rootScope.$broadcast('productDeleted', $scope.product.versionedId.id);
        };

        $scope.moveToCategory = function (category) {
          UserNotificationService.show('Moving ' + $scope.product.description + ' to ' + category.name);
          ProductsService.moveProducts(category.id, $scope.product.versionedId.id, function () {
            UserNotificationService.show($scope.product.description + ' has been moved to ' + category.name, true);
          });
        };

        $scope.onChangeTaxable = function () {
          $scope.disabledCheckbox = true;
          ProductsService.changeTaxableStatus($scope.product.versionedId.id, !$scope.product.taxable, function () {
            $scope.disabledCheckbox = false;
          })
        };

      }]);

}());
