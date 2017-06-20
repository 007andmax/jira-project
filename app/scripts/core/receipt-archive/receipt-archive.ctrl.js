'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.receiptArchiveCtrl',
    ['$scope', '$state', '$stateParams', 'ReceiptArchiveService', 'quicktech.common.services.SharedStateService',
      'CompaniesService', 'Utils',
      function ($scope, $state, $stateParams, ReceiptArchiveService, SharedStateService, CompaniesService, Utils) {

        var availableMods = ['group-by-company', 'list'];

        $scope.mode = availableMods[0];
        $scope.receiptArchiveCompanies = [];
        $scope.totalCompanySum = {};
        $scope.orderInvoices = {
          field: 'paidOn',
          reverse: true
        };
        $scope.loadingInProgress = true;

        $scope.$watch(function () {
          return $stateParams.mode;
        }, function (mode) {
          if (availableMods.indexOf(mode) < 0) {
            $state.go('receipt-archive', {
              mode: availableMods[0]
            });
          } else {
            $scope.mode = mode;
          }

          $scope.headerSharedState = SharedStateService.getSharedState('receiptArchiveHeader');
        });

        ReceiptArchiveService.getReceiptArchiveData($scope, function (resp) {
          $scope.receiptArchiveData = resp;
          $scope.invoiceToSent = {};

          var invoicesByCompany = $scope.receiptArchiveData.companies;

          for (var companyId in invoicesByCompany) {

            if (companyId !== 'staticCopy') {
              if (!Utils.findById($scope.receiptArchiveCompanies, companyId) && invoicesByCompany[companyId]) {
                $scope.receiptArchiveCompanies.push({
                  id: companyId,
                  name: CompaniesService.getOneById(companyId).name
                });
              }
            }
          }

          if ($stateParams.mode === 'group-by-company') {

            for (var i = 0; i < $scope.receiptArchiveCompanies.length; i++) {

              var companyId = $scope.receiptArchiveCompanies[i].id,
                invoices = invoicesByCompany[companyId],
                sumByCompany = 0;

              for (var j = 0; j < invoices.length; j++) {
                var invoice = invoices[j];
                if (!invoice.deletedAt) {
                  sumByCompany += invoice.sum;
                }
              }

              $scope.totalCompanySum[companyId] = sumByCompany;
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
                for (var invoiceId in invoices) {
                  if (invoices[invoiceId]) {
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

            for (var invoiceId in invoices) {
              if (invoices[invoiceId]) {
                $scope.selectedInvoiceCount++;
                disabledCount++;
                for (var i = 0; i < $scope.receivableInvoicesData.list.length; i++) {
                  if (invoiceId === $scope.receivableInvoicesData.list[i].id) {
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
            return parseInt(item.number) || 0;
          } else if ($scope.orderInvoices.field === 'company') {
            return CompaniesService.getOneById(item.company.id).name;
          } else if ($scope.orderInvoices.field === 'date') {
            return item.date;
          } else if ($scope.orderInvoices.field === 'paidOn') {
            return item.paidOn;
          } else if ($scope.orderInvoices.field === 'amount') {
            return item.sum;
          }
        };

        $scope.hideLoadingIndicator = function () {
          $scope.loadingInProgress = false;
        };

        $scope.filterByCompany = function (invoice) {
          return !$scope.headerSharedState.filter.companyId || invoice.company.id === $scope.headerSharedState.filter.companyId;
        };

        $scope.changeCompanyCheckbox = function (companyId) {

          var invoiceToSentData = $scope.invoiceToSent[companyId];

          if (invoiceToSentData) {

            var invoices = $scope.receiptArchiveData.companies[companyId];

            for (var j = 0; j < invoices.length; j++) {
              invoiceToSentData.invoices[invoices[j].id] = invoiceToSentData.checked;
            }
          }
        };

        $scope.resendSelectedInvoices = function () {
          var invoiceIds = getSelectedInvoices($scope.invoiceToSent);

          $scope.sendingInvoices = true;
          ReceiptArchiveService.resendInvoices(invoiceIds, function () {
            $scope.sendingInvoices = false;
          });
        };

        $scope.deleteSelectedInvoices = function () {
          var invoiceIds = getSelectedInvoices($scope.invoiceToSent);
          ReceiptArchiveService.deleteInvoices(invoiceIds);
        };

        function getSelectedInvoices(invoiceToSent) {
          var invoiceIds = [];
          if ($stateParams.mode === 'list') {
            for (var invoiceId in invoiceToSent.invoices) {
              if (invoiceToSent.invoices[invoiceId]) {
                invoiceIds.push(invoiceId);
                invoiceToSent.invoices[invoiceId] = false;
              }
            }
          } else {
            for (var companyId in invoiceToSent) {
              var invoices = invoiceToSent[companyId].invoices;

              for (var invoiceId in invoices) {
                if (invoices[invoiceId]) {
                  invoiceIds.push(invoiceId);
                  invoices[invoiceId] = false;
                }
              }
            }
          }
          return invoiceIds;
        }

      }]);

}());
