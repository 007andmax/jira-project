'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.receiptArchiveCtrl',
    ['$scope', '$state', '$stateParams', 'ReceiptArchiveService', 'quicktech.common.services.SharedStateService',
      function ($scope, $state, $stateParams, ReceiptArchiveService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('receiptArchiveInvoicesHeader');

        var availableMods = ['group-by-company', 'list'];

        $scope.totalCompanySum = {};

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
        });

        $scope.receiptArchiveData = ReceiptArchiveService.getReceiptArchiveData($scope, function () {
          if ($stateParams.mode === 'group-by-company') {
            $scope.receiptArchiveCompanies = [];
            angular.forEach($scope.receiptArchiveData.companies, function (value, key) {
              if (key !== 'staticCopy') {
                $scope.receiptArchiveCompanies.push({
                  id: key,
                  invoices: value
                });
              }
            }, $scope.receiptArchiveCompanies);
          }
          $scope.$watch('receiptArchiveData', function () {
            var companies = $scope.receiptArchiveCompanies;
            if ($stateParams.mode === 'group-by-company') {
              for (var i = 0; i < companies.length; i++) {
                $scope.totalCompanySum[companies[i].id] = 0;
                for (var j = 0; j < companies[i].invoices.length; j++) {
                  $scope.totalCompanySum[companies[i].id] += companies[i].invoices[j].sum;
                }
              }
            }
          }, true);

          headerSharedState.invoices = $scope.receiptArchiveData.list

        });

        $scope.setHighlightInvoiceId = function (invoiceId) {
          $scope.highlightInvoiceId = invoiceId;
        };

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('receiptArchiveInvoicesHeader');
        });

      }]);

}());
