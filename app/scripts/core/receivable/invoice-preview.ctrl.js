'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.receivable.invoicePreviewCtrl',
    ['$scope', '$uibModalInstance', 'CompaniesService', 'ReceivableService', 'Downloader',
      function ($scope, $uibModalInstance, CompaniesService, ReceivableService, Downloader) {

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
              discountSum: $scope.currentInvoice.discountSum,
              totalSum: $scope.currentInvoice.productsSum + $scope.currentInvoice.servicesSum
            }];
          }

          $scope.locksInitialized = true;
        });

        $scope.close = function () {
          $uibModalInstance.dismiss();
        };

        $scope.print = function () {
          var wnd = window.open('/invoice/show/' + $scope.invoice.id + '/pdf');
          wnd.print();
          $scope.close();
        };

        $scope.download = function () {
          Downloader.downloadByUrl(
            '/invoice/show/' + $scope.invoice.id + '/pdf',
            CompaniesService.getOneById($scope.invoice.company.id).name + '-' + $scope.invoice.number + '.pdf'
          );
          $scope.close();
        };
      }]);

}());
