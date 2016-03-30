'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpenseCtrl',
    ['$scope',
      function ($scope) {

        $scope.setNewService = function (service) {
          $scope.expense.item = angular.copy(service);
        };

        $scope.selectProduct = function (product) {
          $scope.expense.item = angular.copy(product);
        };

        $scope.deleteExpense = function () {
          $scope.editInvoice.expenses.splice($scope.$index, 1);
        }

      }]);

}());
