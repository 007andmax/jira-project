'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceExpenseCtrl',
    ['$scope', 'RecurringService', 'BillableService', 'CompaniesService', 'ServicesService', '$filter',
      function ($scope, RecurringService, BillableService, CompaniesService, ServicesService, $filter) {

        $scope.setNewService = function(service){
          $scope.expense.item = angular.copy(service);
        };

        $scope.selectProduct = function (product) {
          $scope.expense.item = angular.copy(product);
        };

        $scope.deleteExpense = function(){
          $scope.editInvoice.expenses.splice($scope.$index, 1);
        }

      }]);

}());
