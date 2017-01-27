'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpenseCtrl',
    ['$scope', '$filter',
      function ($scope, $filter) {
        var today = $filter('date')(new Date(), 'dd MMM yyyy');

        $scope.selectProduct = function (product) {
          $scope.product.item = angular.copy(product);
        };

        $scope.deleteProduct = function () {
          if ($scope.editInvoice.products.length > 1) {
            $scope.editInvoice.products.splice($scope.$index, 1);
          } else {
            $scope.editInvoice.products = [{}];
          }
        };

        $scope.setNewService = function (service) {
          $scope.service.item = angular.copy(service);
        };

        $scope.deleteService = function () {
          if ($scope.editInvoice.services.length > 1) {
            $scope.editInvoice.services.splice($scope.$index, 1);
          } else {
            $scope.editInvoice.services = [{ date: today }];
          }
        }

      }]);

}());
