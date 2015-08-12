'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.recurring.invoiceCtrl',
    ['$scope', 'RecurringService', '$rootScope',
      function ($scope, RecurringService, $rootScope) {

        $scope.$watch('invoice', function () {
          $scope.totalInvoiceSum = calculateTotalInvoiceSum($scope.invoice.products) + calculateTotalInvoiceSum($scope.invoice.services);

          var date = new Date($scope.invoice.sentOn);

          if ($scope.invoice.frequency === 'WEEKLY') {
            $scope.nextDueDate = date.setDate(date.getDate() + 7);
          } else if ($scope.invoice.frequency === 'MONTHLY') {
            $scope.nextDueDate = date.setMonth(date.getMonth() + 1);
          } else {
            $scope.nextDueDate = date.setFullYear(date.getFullYear() + 1);
          }
        }, true);

        function calculateTotalInvoiceSum(calculateArray) {

          var totalTicketSum = 0;
          for (var i = 0; i < calculateArray.length; i++) {
            totalTicketSum += calculateArray[i].sum;
          }
          return totalTicketSum;
        }

        $scope.deleteRecurringInvoice = function () {
          RecurringService.deleteRecurringInvoice($scope.invoice.id);
        };

        $scope.showCreateServiceInvoice = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateService = true;
        };

        $scope.showCreateProductInvoice = function () {
          $rootScope.$broadcast('cancelEditForm');
          $scope.showCreateProduct = true;
        };

        $scope.$on('cancelEditForm', function () {
          $scope.showCreateService = false;
          $scope.showCreateProduct = false;
        });

      }]);

}());
