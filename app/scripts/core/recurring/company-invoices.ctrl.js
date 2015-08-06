'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.companyInvoicesCtrl',
    ['$scope', 'RecurringService',
      function ($scope, RecurringService) {

        $scope.companyRecurringInvoices = RecurringService.getCompanyRecurringInvoices($scope.company.id, $scope, function () {

          $scope.totalInvoiceSum = {};

          $scope.nextDueDate = {};

          for (var i = 0; i < $scope.companyRecurringInvoices.length; i++) {
            var products = $scope.companyRecurringInvoices[i].products,
              services = $scope.companyRecurringInvoices[i].services,
              invoiceId = $scope.companyRecurringInvoices[i].id,
              date = new Date($scope.companyRecurringInvoices[i].sentOn);

            if ($scope.companyRecurringInvoices[i].frequency === 'WEEKLY') {
              $scope.nextDueDate[invoiceId] = date.setDate(date.getDate() + 7);
            } else if ($scope.companyRecurringInvoices[i].frequency === 'MONTHLY') {
              $scope.nextDueDate[invoiceId] = date.setMonth(date.getMonth() + 1);
            } else {
              $scope.nextDueDate[invoiceId] = date.setFullYear(date.getFullYear() + 1);
            }

            $scope.totalInvoiceSum[invoiceId] = calculateTotalInvoiceSum(products) + calculateTotalInvoiceSum(services);
          }
        });

        $scope.$watch()

        function calculateTotalInvoiceSum(calculateArray) {

          var totalTicketSum = 0;
          for (var i = 0; i < calculateArray.length; i++) {
            totalTicketSum += calculateArray[i].sum;
          }
          return totalTicketSum;
        }

      }]);

}());
