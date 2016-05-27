'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.receivable.invoicePreviewCtrl',
    ['$scope', '$modalInstance', 'CompaniesService', 'ReceivableService', 'Downloader',
      function ($scope, $modalInstance, CompaniesService, ReceivableService, Downloader) {

        var invoice = $scope.invoice.invoices ? $scope.invoice.invoices[0] : $scope.invoice;

        $scope.receivablePreview = true;

        ReceivableService.getInvoiceDataForPreview(invoice.id, function (resp) {
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
        });

        $scope.close = function () {
          $modalInstance.dismiss();
        };

        $scope.print = function () {
          var wnd = window.open('/invoice/show/' + invoice.id + '/pdf');
          wnd.print();
        };

        $scope.download = function () {
          Downloader.downloadByUrl(
            '/invoice/show/' + invoice.id + '/pdf',
            CompaniesService.getOneById(invoice.company.id).name + '-' + invoice.number + '.pdf'
          );
        };
      }]);

}());
