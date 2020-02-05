'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.receivable.invoicePreviewCtrl',
    ['$scope', 'CompaniesService', 'ReceivableService', 'Downloader', '$timeout', '$rootScope',
      function ($scope, CompaniesService, ReceivableService, Downloader, $timeout, $rootScope) {

        $scope.receivablePreview = true;
        $scope.shoeInvoiceCreatedMessage = false;
        $scope.notificationMessage = 'Invoice has been sent';

        $scope.getLogo = $rootScope.getCompanyLogoUrl;


        $scope.stopCache = Math.floor(Math.random() * 100000);

        if ($rootScope.invoiceToShow) {
          $scope.readedAt = $rootScope.invoiceToShow.readedAt;
          $scope.paidOn = $rootScope.invoiceToShow.paidOn;
        }


        ReceivableService.getInvoiceDataForPreview($rootScope.invoiceToShow.id, function (resp) {
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
          var wnd = window.open('/invoice/show/' + $rootScope.invoiceToShow.id + '/pdf');
          wnd.print();
          //$scope.close();
        };

        $scope.download = function () {
          Downloader.downloadByUrl(
            '/invoice/show/' + $rootScope.invoiceToShow.id + '/pdf',
            CompaniesService.getOneById($rootScope.invoiceToShow.company.id).name + '-' + $rootScope.invoiceToShow.number + '.pdf'
          );
          //$scope.close();
        };

        $scope.sentInvoiceToMail = function () {
          var idInvoiceToSend = $rootScope.invoiceToShow.id;
          //$scope.sending[idInvoiceToSend] = true;

          ReceivableService.resendInvoice(idInvoiceToSend, function (resp) {
            //$scope.sending[idInvoiceToSend] = false;
            $scope.shoeInvoiceCreatedMessage = true;
          });
        };
      }]);

}());
