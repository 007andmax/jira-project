'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    [
      '$scope', 'RecurringService', 'CompaniesService',
      function ($scope, RecurringService, CompaniesService) {

        $scope.editInvoiceId = '';
        $scope.frequency = {
          sevenDays: '7 days',
          fifteenDays: '15 days',
          thirtyDays: '30 days',
          MONTHLY: 'Monthly',
          YEARLY: 'Yearly'
        };
        $scope.orderInvoices = {
          field: 'company',
          reverse: false
        };

        RecurringService.getAll($scope, function (resp) {
          $scope.invoices = resp;
        });

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope, function () {
          $scope.last30DaysValue = 0;

          for (var i = 0; i < $scope.recurringGraphData.length; i++) {
            $scope.last30DaysValue += $scope.recurringGraphData[i].sum;
          }
        });

        $scope.toogleEditForm = function (value) {
          if (!value) {
            $scope.editInvoiceId = '';
          } else if (value === 'new-invoice') {
            $scope.editInvoiceId = 'new-invoice';
          } else {
            $scope.editInvoiceId = value;
          }

        };

        $scope.setOrderForProducts = function (option) {
          if (option === $scope.orderInvoices.field) {
            $scope.orderInvoices.reverse = !$scope.orderInvoices.reverse;
          } else {
            $scope.orderInvoices.field = option;
            $scope.orderInvoices.reverse = false;
          }
        };

        $scope.orderByForInvoices = function (item) {
          if ($scope.orderInvoices.field === 'company' && item.company && item.company.id) {
            var company = CompaniesService.getOneById(item.company.id);
            return company.name
          } else if ($scope.orderInvoices.field === 'startDate') {
            return item.sentOn;
          } else if ($scope.orderInvoices.field === 'recurring') {
            return item.customFrequency || item.frequency;
          } else if ($scope.orderInvoices.field === 'endDate') {
            return item.endDate;
          } else if ($scope.orderInvoices.field === 'totalCreated') {
            return item.generatedCount;
          } else if ($scope.orderInvoices.field === 'amount') {
            return item.total;
          }

        };

        $scope.$on('showInvoice', function(e, companyId){
          $scope.showCompanyId = companyId ? companyId : '';
        })

      }
    ]);

}());
