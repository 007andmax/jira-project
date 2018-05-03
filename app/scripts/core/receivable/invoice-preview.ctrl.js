'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.receivable.invoicePreviewCtrl',
    ['$scope', '$uibModalInstance', 'CompaniesService', 'ReceivableService', 'Downloader', '$timeout',
      function ($scope, $uibModalInstance, CompaniesService, ReceivableService, Downloader, $timeout) {

        $scope.receivablePreview = true;

        ReceivableService.getInvoiceDataForPreview($scope.invoice.id, function (resp) {
          $scope.currentInvoice = resp;
          $scope.currentBillTo = {
            addressWithSuitNumberAndPostalCode: resp.billingAddress
          };
          $scope.currentShipTo = {
            addressWithSuitNumberAndPostalCode: resp.shippingAddress
          };

          if (!$scope.currentInvoice.tickets || !$scope.currentInvoice.tickets.length) {
            $scope.currentInvoice.tickets = [{
              productExpenses: $scope.currentInvoice.productExpenses,
              serviceExpenses: $scope.currentInvoice.serviceExpenses,
              totalSum: $scope.currentInvoice.productsSum + $scope.currentInvoice.servicesSum
            }];
          }

          $scope.locksInitialized = true;

          $timeout(function () {
            $scope.showHeader = true;
          }, 2000)
        });

        $scope.close = function () {
          $uibModalInstance.dismiss();
        };

        $scope.print = function () {
          var wnd = window.open('/invoice/show/' + $scope.invoice.id + '/pdf');
          wnd.print();
          //$scope.close();
        };

        $scope.download = function () {
          Downloader.downloadByUrl(
            '/invoice/show/' + $scope.invoice.id + '/pdf',
            CompaniesService.getOneById($scope.invoice.company.id).name + '-' + $scope.invoice.number + '.pdf'
          );
          //$scope.close();
        };

        $scope.sentInvoiceToMail = function () {
          var idInvoiceToSend = $scope.invoice.id;
          //$scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            //$scope.sending[idInvoiceToSend] = false;
          });
        };
      }]);

}());
