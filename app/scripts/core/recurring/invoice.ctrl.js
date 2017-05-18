'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.invoiceCtrl',
    ['$scope', 'CompaniesService', 'RecurringService', '$timeout', 'quicktech.common.services.UserConfirmationsService',
      function ($scope, CompaniesService, RecurringService, $timeout, UserConfirmationsService) {

        $scope.disabledDelete = false;

        $scope.companyOfInvocie = CompaniesService.getOneById($scope.invoice.company.id);

        $scope.getTotal = function () {
          var total = 0;
          var expenses = $scope.invoice.services.concat($scope.invoice.products);
          for (var i = 0, len = expenses.length; i < len; i++) {
            var expense = expenses[i];
            total += expense.totalSum;
          }

          return total;
        };

        $scope.getSubTotal = function () {
          var subtotal = 0;
          var expenses = $scope.invoice.services.concat($scope.invoice.products);
          for (var i = 0, len = expenses.length; i < len; i++) {
            var expense = expenses[i];
            subtotal += expense.sum;
          }
          return subtotal;
        };

        $scope.deleteRecurringInvoice = function () {
          $scope.disabledDelete = true;
          var confirmMesage = 'Do you want to delete order?',
            confirmButton = 'Yes';

          UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
            RecurringService.deleteRecurringInvoice($scope.invoice.id);
          });
          $scope.disabledDelete = false;
        };

      }]);

}());
