'use strict';

(function () {

  angular.module('quicktech.core.receiptArchive').controller('quicktech.core.receiptArchive.invoiceCtrl',
    ['$scope', 'CompaniesService', '$timeout',
      function ($scope, CompaniesService, $timeout) {

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);

        $scope.$watch('highlightInvoiceId', function (invoiceId) {
          if (invoiceId) {

            $scope.$broadcast('showInvoice-' + invoiceId);

            $timeout(function () {
              $scope.setHighlightInvoiceId();
            }, 3000)
          }
        });

        $scope.$on($scope.invoice.company.id + '-showInvoiceInList', function (event, invoiceId) {
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
