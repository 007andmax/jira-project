'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivableCtrl',
    ['$scope', '$state', '$stateParams', 'ReceivableService', 'CompaniesService',
      'quicktech.common.services.SharedStateService',
      function ($scope, $state, $stateParams, ReceivableService, CompaniesService, SharedStateService) {

        var availableMods = ['group-by-company', 'list'];

        $scope.mode = availableMods[0];
        $scope.orderInvoices = {
          field: 'number',
          reverse: false
        };
        $scope.totalSum = {
          companies: {},
          invoices: {}
        };
        $scope.loadingInProgress = true;
        $scope.sending = [];

        $scope.receivedAmountAllTime = ReceivableService.getReceivedPaymentsSumByCompany(CompaniesService.getCurrentCompany().id, $scope);

        $scope.receivableGraphData = ReceivableService.getReceivableGraphData($scope, function () {
          $scope.totalCollectedLast30Days = 0;
          for (var i = 0; i < $scope.receivableGraphData.length; i++) {
            $scope.totalCollectedLast30Days += $scope.receivableGraphData[i].receivedOnDay;
          }
        });

        ReceivableService.getReceivableInvoicesData($scope, function (resp) {

          var invoicesData = $scope.receivableInvoicesData = resp;

          $scope.totalReceivables = 0;
          $scope.receivableCompanies = [];
          $scope.invoiceToSent = {};

          for (var id in invoicesData.companies) {
            var invoices = invoicesData.companies[id];
            $scope.totalSum.companies[id] = 0;

            for (var i = 0; i < invoices.length; i++) {
              var invoice = invoices[i];

              $scope.totalSum.invoices[invoice.id] = invoice.sum;
              $scope.totalSum.companies[id] += invoice.sum;
            }

            $scope.totalReceivables += $scope.totalSum.companies[id];
            $scope.receivableCompanies.push(CompaniesService.getOneById(id));
          }

          if ($stateParams.mode === 'group-by-company') {

            for (var companyId in invoicesData.companies) {
              $scope.invoiceToSent[companyId] = {
                checked: false,
                invoices: {}
              };
            }
          } else {
            $scope.invoiceToSent.invoices = {};
          }

          if (!resp.list.length) {
            $scope.loadingInProgress = false;
          }

        });

        $scope.$watch(function () {
          return $stateParams.mode;
        }, function (mode) {
          if (availableMods.indexOf(mode) < 0) {
            $state.go('receivable', {
              mode: availableMods[0]
            });
          } else {
            $scope.mode = mode;
          }

          $scope.headerSharedState = SharedStateService.getSharedState('receivableHeader');
        });

        $scope.changeCompanyCheckbox = function (companyId) {

          var invoiceToSentData = $scope.invoiceToSent[companyId];

          if (invoiceToSentData) {

            var invoices = $scope.receivableInvoicesData.companies[companyId];

            for (var j = 0; j < invoices.length; j++) {
              invoiceToSentData.invoices[invoices[j].number] = invoiceToSentData.checked;
            }
          }
        };

        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
        };

        $scope.$watch('invoiceToSent', function () {

          $scope.selectedInvoiceCount = 0;
          var disabledCount = 0,
            invoices;

          if ($stateParams.mode === 'group-by-company') {

            for (var companyId in $scope.invoiceToSent) {
              var invoiceToSent = $scope.invoiceToSent[companyId],
                companyChecked = invoiceToSent.checked;

              invoices = invoiceToSent.invoices;

              if (invoices) {
                for (var invoiceNumber in invoices) {
                  if (invoices[invoiceNumber]) {
                    $scope.selectedInvoiceCount++;
                    if (!companyChecked) {
                      disabledCount++;
                      $scope.selectableCompanyId = companyId;
                    }
                  }
                }
              }

              if (companyChecked) {
                disabledCount++;
                $scope.selectableCompanyId = companyId;
              }
            }

          } else {

            if (!$scope.invoiceToSent) {
              return;
            }

            invoices = $scope.invoiceToSent.invoices;

            for (var invoiceNumber in invoices) {
              if (invoices[invoiceNumber]) {
                $scope.selectedInvoiceCount++;
                disabledCount++;
                for (var i = 0; i < $scope.receivableInvoicesData.list.length; i++) {
                  if (invoiceNumber === $scope.receivableInvoicesData.list[i].number) {
                    $scope.selectableCompanyId = $scope.receivableInvoicesData.list[i].company.id;
                    break;
                  }
                }
              }
            }

          }

          if (disabledCount === 0) {
            $scope.selectableCompanyId = undefined;
          }
        }, true);

        $scope.hideLoadingIndicator = function () {
          $scope.loadingInProgress = false;
        };

        $scope.filterByCompany = function (invoice) {
          return !$scope.headerSharedState.filter.companyId || invoice.company.id === $scope.headerSharedState.filter.companyId;
        };

        $scope.setOrderForInvoices = function (option) {
          if (option === $scope.orderInvoices.field) {
            $scope.orderInvoices.reverse = !$scope.orderInvoices.reverse;
          } else {
            $scope.orderInvoices.field = option;
            $scope.orderInvoices.reverse = false;
          }
        };

        $scope.orderByForInvoices = function (item) {
          if ($scope.orderInvoices.field === 'number') {
            return item.number;
          } else if ($scope.orderInvoices.field === 'company') {
            return CompaniesService.getOneById(item.company.id).name;
          } else if ($scope.orderInvoices.field === 'readedAt') {
            return item.readedAt;
          } else if ($scope.orderInvoices.field === 'date') {
            return item.date;
          } else if ($scope.orderInvoices.field === 'dueDate') {
            return item.dueDate.value;
          } else if ($scope.orderInvoices.field === 'amount') {
            return $scope.totalSum.invoices[item.id];
          }
        };

      }]);

}());
