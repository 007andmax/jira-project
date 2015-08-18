'use strict';

(function () {

  angular.module('quicktech').controller('quicktech.core.header.receivableCtrl',
    ['$scope', '$rootScope', 'ReceivableService', '$stateParams',
      function ($scope, $rootScope, ReceivableService, $stateParams) {

        $scope.searchInvoice = ReceivableService.search;

        $scope.showInvoice = function (invoice) {
          if ($stateParams.mode === 'group-by-company') {
            $rootScope.$broadcast(invoice.company.id + '-showInvoiceInCompany', invoice.id)
          } else {
            $rootScope.$broadcast(invoice.company.id + '-showInvoiceInList', invoice.id)
          }
        }

      }]);

}());
