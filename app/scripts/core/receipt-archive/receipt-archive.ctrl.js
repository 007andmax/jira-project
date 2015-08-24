'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.receiptArchiveCtrl',
    ['$scope', '$state', '$stateParams', 'ReceiptArchiveService', 'quicktech.common.services.SharedStateService', 'CompaniesService', 'Utils',
      function ($scope, $state, $stateParams, ReceiptArchiveService, SharedStateService, CompaniesService, Utils) {

        var headerSharedState = SharedStateService.getSharedState('receiptArchiveInvoicesHeader');

        var availableMods = ['group-by-company', 'list'];

        $scope.receiptArchiveCompanies = [];
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
          $scope.$watch('receiptArchiveData', function () {

            for (var companyId in $scope.receiptArchiveData.companies) {
              if (companyId !== 'staticCopy' && !Utils.findById($scope.receiptArchiveCompanies, companyId)) {

                $scope.receiptArchiveCompanies.push({
                  id: companyId,
                  name: CompaniesService.getOneById(companyId).name
                });
              }
            }

            for (var i = $scope.receiptArchiveCompanies - 1; i >= 0; i--) {
              if (!$scope.receiptArchiveData.companies[$scope.receiptArchiveCompanies[i]]) {
                $scope.receiptArchiveCompanies.splice(i, 1);
              }
            }

            if ($stateParams.mode === 'group-by-company') {

              for (var i = 0; i < $scope.receiptArchiveCompanies.length; i++) {

                var companyId = $scope.receiptArchiveCompanies[i].id,
                  invoices = $scope.receiptArchiveData.companies[companyId];

                $scope.totalCompanySum[companyId] = 0;

                for (var j = 0; j < invoices.length; j++) {
                  $scope.totalCompanySum[companyId] += invoices[j].sum;
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
