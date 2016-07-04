'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.receiptArchiveCtrl',
    ['$scope', '$state', '$stateParams', 'ReceiptArchiveService', 'quicktech.common.services.SharedStateService',
      'CompaniesService', 'Utils', '$timeout',
      function ($scope, $state, $stateParams, ReceiptArchiveService, SharedStateService, CompaniesService, Utils, $timeout) {

        var globalSearch = SharedStateService.getSharedState('globalSearch');
        var headerSharedState;

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

          headerSharedState = SharedStateService.getSharedState('receiptArchiveInvoicesHeader');
        });

        ReceiptArchiveService.getReceiptArchiveData($scope, function (resp) {
          $scope.receiptArchiveData = resp;

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
                sumByCompany += invoices[j].sum;
              }

              $scope.totalCompanySum[companyId] = sumByCompany;
            }
          }

          headerSharedState.companies = $scope.receiptArchiveCompanies;
          headerSharedState.invoices = $scope.receiptArchiveData.list;

          if (!resp.list.length) {
            $scope.loadingInProgress = false;
          }
        });

        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
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
          if (globalSearch.archivedByCompanyFilter) {
            $timeout(function () {
              $scope.$broadcast(globalSearch.archivedByCompanyFilter + '-showReceiptArchiveCompany');
              globalSearch.archivedByCompanyFilter = undefined;
            });
          }
        };

        $scope.filterByCompany = function (invoice) {
          return !headerSharedState.filter.companyId || invoice.company.id === headerSharedState.filter.companyId;
        };

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('receiptArchiveInvoicesHeader');
        });

      }]);

}());
