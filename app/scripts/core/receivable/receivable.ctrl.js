'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivableCtrl',
    ['$scope', '$state', '$stateParams', 'ReceivableService', 'CompaniesService',
      function ($scope, $state, $stateParams, ReceivableService, CompaniesService) {

        var availableMods = ['group-by-company', 'list'];

        $scope.totalSum = {
          companies: {},
          invoices: {}
        };

        $scope.receivedAmountAllTime = ReceivableService.getReceivedPaymentsSumByCompany(CompaniesService.getCurrentCompany().id, $scope);

        $scope.receivableGraphData = ReceivableService.getReceivableGraphData($scope, function () {
          $scope.totalCollectedLast30Days = 0;
          for (var i = 0; i < $scope.receivableGraphData.length; i++) {
            $scope.totalCollectedLast30Days += $scope.receivableGraphData[i].receivedOnDay;
          }
        });

        $scope.receivableInvoicesData = ReceivableService.getReceivableInvoicesData($scope, function () {

          var invoicesData = $scope.receivableInvoicesData;

          $scope.$watch('receivableInvoicesData', function () {
            $scope.totalReceivables = 0;
            $scope.receivableCompanies = [];
            $scope.invoiceToSent = {};

            angular.forEach(invoicesData.companies, function (value, key) {

              if (key === 'staticCopy') {
                return
              }

              var companyInvoices = invoicesData.companies[key];
              this.companies[key] = 0;

              for (var i = 0; i < companyInvoices.length; i++) {

                var invoice = companyInvoices[i],
                  invoiceSum = 0;

                if (invoice.isRecurring) {
                  for (var j = 0; j < invoice.invoices.length; j++) {
                    invoiceSum += invoice.invoices[j].sum;
                  }
                } else {
                  invoiceSum += invoice.sum;
                }

                this.invoices[invoice.id] = invoiceSum;
                this.companies[key] += invoiceSum;
              }

              $scope.totalReceivables += this.companies[key];

            }, $scope.totalSum);

            angular.forEach($scope.receivableInvoicesData.companies, function (val, key) {
              if (key !== 'staticCopy') {
                $scope.receivableCompanies.push(CompaniesService.getOneById(key));
              }
            });

            if ($stateParams.mode === 'group-by-company') {

              for (var companyId in invoicesData.companies) {
                if (companyId !== 'staticCopy') {
                  $scope.invoiceToSent[companyId] = {
                    checked: false,
                    invoices: {}
                  };
                }
              }
            } else {
              $scope.invoiceToSent.invoices = {};
              for (var i = 0; i < invoicesData.list.length; i++) {
                $scope.invoiceToSent.invoices[invoicesData.list[i].id] = false;
              }
            }

          }, true);


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

          var invoiceToSentData = $scope.invoiceToSent[companyId];

          if (invoiceToSentData) {

            var invoices = $scope.receivableInvoicesData.companies[companyId];

            for (var j = 0; j < invoices.length; j++) {
              invoiceToSentData.invoices[invoices[j].id] = invoiceToSentData.checked
            }
          }
        };

        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
        };

        $scope.getInvoicesCount = function (company) {
          return $scope.receivableInvoicesData.companies[company.id].length;
        };

        $scope.$watch('invoiceToSent', function () {

          $scope.countInvoice = 0;
          var disabledCount = 0;

          if ($stateParams.mode === 'group-by-company') {
            for (var companyId in $scope.invoiceToSent) {
              if ($scope.invoiceToSent[companyId].invoices) {
                for (var invoiceId in $scope.invoiceToSent[companyId].invoices) {
                  if ($scope.invoiceToSent[companyId].invoices[invoiceId]) {
                    $scope.countInvoice++;
                  }
                }
              }

              if ($scope.invoiceToSent[companyId].checked) {
                disabledCount++;
                $scope.selectableCompanyId = companyId;
              }
              else {
                for (var invoiceId in $scope.invoiceToSent[companyId].invoices) {
                  if ($scope.invoiceToSent[companyId].invoices[invoiceId]) {
                    disabledCount++;
                    $scope.selectableCompanyId = companyId;
                  }
                }
              }
            }

            if (disabledCount === 0) {
              $scope.selectableCompanyId = undefined;
            }
          } else {
            if (!$scope.invoiceToSent) {
              return;
            }

            for (var invoiceId in $scope.invoiceToSent.invoices) {
              if ($scope.invoiceToSent.invoices[invoiceId]) {
                $scope.countInvoice++;
                disabledCount++;
                for (var i = 0; i < $scope.receivableInvoicesData.list.length; i++) {
                  if (invoiceId === $scope.receivableInvoicesData.list[i].id) {
                    $scope.selectableCompanyId = $scope.receivableInvoicesData.list[i].company.id
                  }
                }
              }
            }
            if (disabledCount === 0) {
              $scope.selectableCompanyId = undefined;
            }
          }
        }, true);

      }]);

}());
