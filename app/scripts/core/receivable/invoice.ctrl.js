'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.invoiceCtrl',
    ['$scope', 'ReceivableService', '$rootScope', 'CompaniesService', '$timeout',
      function ($scope, ReceivableService, $rootScope, CompaniesService, $timeout) {

        $scope.company = CompaniesService.getOneById($scope.invoice.company.id);

        if ($scope.invoice.dueDate <= Date.now()) {
          $scope.$emit('indicatorInvoice');
          $scope.dueDate = {
            over: true,
            value: $scope.invoice.dueDate
          }
        } else {
          $scope.dueDate = {
            over: false,
            value: $scope.invoice.dueDate
          }
        }

        $scope.sentInvoice = function () {
          var idInvoiceToSend = $scope.invoice.id;
          $scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            $scope.sending[idInvoiceToSend] = false;
          });
        };

        $scope.$watch('highlightInvoiceId', function (invoiceId) {
          if (invoiceId && invoiceId === $scope.invoice.id) {

            $scope.$broadcast('showInvoice-' + invoiceId);
            $timeout(function () {
              $scope.setHighlightInvoiceId();
            }, 3000)
          }
        });

        $scope.$on($scope.company.id + '-showInvoiceInList', function (event, invoiceId) {
          $scope.setHighlightInvoiceId(invoiceId);
        });

      }]);

}());
