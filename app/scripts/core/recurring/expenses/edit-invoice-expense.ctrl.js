'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpenseCtrl',
    ['$scope',
      function ($scope) {

        $scope.selectProduct = function (product) {
          $scope.product.item = angular.copy(product);
        };

        $scope.deleteProduct = function () {
          $scope.editInvoice.products.splice($scope.$index, 1);
        };

        $scope.setNewService = function (service) {
          $scope.service.item = angular.copy(service);
        };

        $scope.deleteService = function () {
          $scope.editInvoice.services.splice($scope.$index, 1);
        }

      }]);

}());
