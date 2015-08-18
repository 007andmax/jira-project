'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivableCtrl',
    ['$scope', '$state', '$stateParams', 'ReceivableService', 'CompaniesService',
      function ($scope, $state, $stateParams, ReceivableService, CompaniesService) {

        var availableMods = ['group-by-company', 'list'];

        $scope.invoiceToSent = {};

        $scope.totalSum = {
          companies: {},
          invoices: {}
        };

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

          $scope.$watch('receivableInvoicesData', function () {
            $scope.totalReceivables = 0;
            angular.forEach(invoicesData.companies, function (value, key) {
              if (key !== 'staticCopy') {
                var companyInvoices = invoicesData.companies[key];
                this.companies[key] = 0;
                for (var i = 0; i < companyInvoices.length; i++) {
                  this.invoices[companyInvoices[i].id] = 0;
                  if (companyInvoices[i].isRecurring) {
                    for (var j = 0; j < companyInvoices[i].invoices.length; j++) {
                      this.invoices[companyInvoices[i].id] += companyInvoices[i].invoices[j].sum;
                    }
                  } else {
                    this.invoices[companyInvoices[i].id] += companyInvoices[i].sum;
                  }
                  this.companies[key] += this.invoices[companyInvoices[i].id];
                }
                $scope.totalReceivables += this.companies[key];
              }
            }, $scope.totalSum);
          })

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
        });

        $scope.changeCompanyCheckbox = function (companyId) {
          for (var i = 0; i < $scope.receivableInvoicesCompanies.length; i++) {
            var company = $scope.receivableInvoicesCompanies[i];
            if (companyId === company.id) {
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

        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
        };

        $scope.chooseAllCheckbox = function () {
          for (var invoice in $scope.invoiceToSent.invoices) {
            $scope.invoiceToSent.invoices[invoice] = $scope.invoiceToSent.chooseAll;
          }
        };

        $scope.$watch('invoiceToSent', function () {

          $scope.countInvoice = 0;

          if ($stateParams.mode === 'group-by-company') {
            for (var id in $scope.invoiceToSent) {
              if ($scope.invoiceToSent[id].invoices) {
                for (var invoiceId in $scope.invoiceToSent[id].invoices) {
                  if ($scope.invoiceToSent[id].invoices[invoiceId]) {
                    $scope.countInvoice++;
                  }
                }
              }
            }
          } else {
            var countObj = 0,
              invoices = $scope.invoiceToSent.invoices;

            for (var invoiceId in invoices) {
              if (invoices[invoiceId]) {
                countObj++;
              }
            }
            $scope.invoiceToSent.chooseAll = ($scope.receivableInvoicesData.list.length === countObj );

            if ($scope.invoiceToSent.chooseAll) {
              $scope.countInvoice++;
            } else {
              for (var id in $scope.invoiceToSent.invoices) {
                if ($scope.invoiceToSent.invoices[id]) {
                  $scope.countInvoice++;
                }
              }
            }
          }
        }, true);

      }]);

}());
