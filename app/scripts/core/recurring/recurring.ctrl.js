'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.recurringCtrl',
    ['$scope', 'RecurringService', 'CompaniesService', 'quicktech.common.services.UserNotificationService',
      'quicktech.common.services.SharedStateService', 'quicktech.common.services.PermissionsService',
      function ($scope, RecurringService, CompaniesService, UserNotificationService, SharedStateService, PermissionsService) {

        var headerSharedState = SharedStateService.getSharedState('recurringHeader');

        $scope.companyData = CompaniesService.getCompanyForSettingPage(function () {
          $scope.$watch('companyData.addresses[0].address', function (address) {
            $scope.isCurrentCompanyAddressEmpty = !address;
          });
        });

        $scope.PermissionsService = PermissionsService;
        $scope.loadingInProgress = true;
        $scope.forceCreating = [];
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

          if (resp && !resp.length) {
            $scope.loadingInProgress = false;
          }
        });

        $scope.recurringGraphData = RecurringService.getRecurringGraphData($scope, function () {
          $scope.last30DaysValue = 0;

          for (var i = 0; i < $scope.recurringGraphData.length; i++) {
            $scope.last30DaysValue += $scope.recurringGraphData[i].sum;
          }
        });

        $scope.loadingFinished = function () {
          $scope.loadingInProgress = false;
        };

        $scope.toogleEditForm = function (value) {
          if (!value) {
            $scope.editInvoiceId = '';
          } else if (value === 'new-invoice') {
            $scope.editInvoiceId = 'new-invoice';
          } else {
            $scope.editInvoiceId = value;
          }

        };

        $scope.forceCreate = function (id) {
          $scope.forceCreating[id] = true;
          RecurringService.forceCreate(id, function () {
            $scope.forceCreating[id] = false;
            UserNotificationService.show('Invoice sent', true);
          });
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

        $scope.filterInvoicesByCompany = function (invoice) {
          return !headerSharedState.filter.companyId || invoice.company.id === headerSharedState.filter.companyId;
        };

      }]);

}());
