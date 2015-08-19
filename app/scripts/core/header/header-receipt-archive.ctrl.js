'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.receiptArchiveCtrl',
    ['$scope', '$rootScope', 'ReceiptArchiveService', '$stateParams', 'quicktech.common.services.SharedStateService',
      function ($scope, $rootScope, ReceiptArchiveService, $stateParams, SharedStateService) {

        $scope.sharedState = SharedStateService.getSharedState('receiptArchiveInvoicesHeader');

        $scope.showInvoice = function (invoice) {
          if ($stateParams.mode === 'group-by-company') {
            $rootScope.$broadcast(invoice.companyId + '-showInvoiceInCompany', invoice.id)
          } else {
            $rootScope.$broadcast(invoice.companyId + '-showInvoiceInList', invoice.id)
          }
        }

      }]);

}());
