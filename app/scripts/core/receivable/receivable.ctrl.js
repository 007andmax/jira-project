'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivableCtrl',
    ['$scope', '$state', '$stateParams', 'ReceivableService', 'CompaniesService', '$rootScope', '$timeout',
      function ($scope, $state, $stateParams, ReceivableService, CompaniesService, $rootScope, $timeout) {

        $scope.invoiceToSent = {};

        $scope.totalReceivables = 0;

        $scope.allInvoicesId = [];

        $scope.receivedAmountAllTime = ReceivableService.getReceivedPaymentsSumByCompany(CompaniesService.getCurrentCompany().id, $scope);

        $scope.receivableGraphData = ReceivableService.getReceivableGraphData($scope, function () {
          $scope.totalCollectedLast30Days = 0;
          for (var i = 0; i < $scope.receivableGraphData.length; i++) {
            $scope.totalCollectedLast30Days += $scope.receivableGraphData[i].total;
          }
        });

        $scope.receivableInvoicesData = ReceivableService.getReceivableInvoicesData($scope, function () {

          var invoicesData = $scope.receivableInvoicesData;

          if ($stateParams.mode === 'group-by-company') {
            $scope.receivableInvoicesCompanies = [];
            angular.forEach(invoicesData.companies, function (value, key) {
              if (key !== 'staticCopy') {
                $scope.invoiceToSent[key] = {};
                this.push({
                  id: key,
                  invoices: value
                });
              }
            }, $scope.receivableInvoicesCompanies);
          } else {
            $scope.invoiceToSent.invoices = {};
            for (var i = 0; i < invoicesData.list.length; i++) {
              $scope.invoiceToSent.invoices[invoicesData.list[i].id] = true;
            }
          }

          for (var i = 0; i < invoicesData.list.length; i++) {
            if (invoicesData.list[i].isRecurring) {
              for (var j = 0; j < invoicesData.list[i].invoices.length; j++) {
                $scope.totalReceivables += invoicesData.list[i].invoices[j].sum;
              }
            } else {
              $scope.totalReceivables += invoicesData.list[i].sum;
            }

            $scope.allInvoicesId.push(invoicesData.list[i].id);

          }

        });

        var availableMods = ['group-by-company', 'list'];

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
        });

        $scope.changeCompanyCheckbox = function (companyId) {
          for (var i = 0; i < $scope.receivableInvoicesCompanies.length; i++) {
            if (companyId === $scope.receivableInvoicesCompanies[i].id) {
              var company = $scope.receivableInvoicesCompanies[i];
              $scope.invoiceToSent[companyId] = {
                checked: $scope.invoiceToSent[companyId].checked,
                invoices: {}
              };
              for (var j = 0; j < company.invoices.length; j++) {
                $scope.invoiceToSent[companyId].invoices[company.invoices[j].id] = $scope.invoiceToSent[companyId].checked
              }
            }
          }
        };

        $scope.chooseAllCheckbox = function () {
          for (var invoice in $scope.invoiceToSent.invoices) {
            $scope.invoiceToSent.invoices[invoice] = $scope.invoiceToSent.chooseAll;
          }
        };

        $scope.calculateTotalInvoiceSum = function (invoice) {
          $scope.totalInvoiceSum = 0;
          if (invoice.sum !== undefined) {
            $scope.totalInvoiceSum = invoice.sum;
          } else {
            for (var i = 0; i < invoice.invoices.length; i++) {
              $scope.totalInvoiceSum += invoice.invoices[i].sum;
            }
          }
          return $scope.totalInvoiceSum;
        }

      }]);

}());
