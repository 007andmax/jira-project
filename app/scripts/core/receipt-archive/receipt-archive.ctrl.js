'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.receiptArchiveCtrl',
    ['$scope', '$state', '$stateParams', 'ReceiptArchiveService', 'quicktech.common.services.SharedStateService', 'CompaniesService',
      function ($scope, $state, $stateParams, ReceiptArchiveService, SharedStateService, CompaniesService) {

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
          $scope.$watch('receiptArchiveData', function () {

            $scope.receiptArchiveCompanies = [];

            for(var companyId in $scope.receiptArchiveData.companies){
              if (companyId !== 'staticCopy') {

                $scope.receiptArchiveCompanies.push({
                  id: companyId,
                  name: CompaniesService.getOneById(companyId).name
                });
              }
            }

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
