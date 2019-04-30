'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivePaymentCtrl',
    ['$scope', '$uibModalInstance', '$stateParams', 'ReceivableService', 'CompaniesService', '$timeout', '$rootScope', '$filter',
      function ($scope, $uibModalInstance, $stateParams, ReceivableService, CompaniesService, $timeout, $rootScope, $filter) {

        var invoiceList = $rootScope.allInvoices;


        $scope.invoiceToReceive = {
          invoices: {},
          method: 'CHEQUE',
          isSendNotification: true
        };

        $scope.noteError = false;


        $scope.maxDate = new Date();

        $scope.receivePaymentInvoices = [];

        $scope.allInvoicesList = $rootScope.allInvoices;

        $scope.partialPaymentAmount = 0;
        if (!$scope.invoiceToSent) {
          $scope.invoiceToSent = { invoices: [] }
        }

        $scope.companies = Object.keys(($scope.receivableInvoicesData || $rootScope.uploadedReceivable).companies).map(function(id) {
          return CompaniesService.getOneById(id);
        });


        $scope.availableInvoiceCompanies = [];

        $scope.setCompany = function(company) {
          $scope.invoiceCompany = company;
        };

        $scope.setInvoice = function(invoice) {
          $scope.selectedInvoice = invoice;
        }

        $scope.maxDate = new Date();
        $scope.date = $filter('date')(new Date(), 'dd MMM yyyy');



        var isNumberKey = $rootScope.isNumberKey



        $scope.setIsMultiple = function(val) {
          $scope.isMultiple = val;
        };

        function checkNoteError() {
          if ($scope.note && $scope.note.length > 255) {
            return true;
          } else {
            return false;
          }
        }

        $scope.isShowingErrors = function (form, fieldName) {
          return $scope.triedToSaveService && form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && form[fieldName].$invalid;
        };


        $scope.countCheckedInvoices = function() {
          var invoices = $scope.invoiceToReceive.invoices;
          var keys = Object.keys(invoices);

          return keys.reduce(function(acc, key) {
            return acc + invoices[key]
          }, 0)
        };

        $scope.isSinglePayment = false;
        var invoicesToReceive = $scope.invoiceToReceive.invoices;

        $scope.$watch('invoiceCompany', function(val) {

          if (val) {
            $scope.availableInvoiceCompanies = $scope.allInvoicesList.filter(function(el) {
              return el.company.id === val.id && !el.paidOn;
            })

            $scope.invoiceToReceive.invoices = {};

            $scope.receivePaymentInvoices = [];


            $scope.selectedInvoice = null;
            // $scope.partialPaymentAmount = null;

            for (var i = 0; i < invoiceList.length; i++) {
              var invoice = invoiceList[i];

              if (invoice.company.id === $scope.invoiceCompany.id && !invoice.paidOn) {
                $scope.receivePaymentInvoices.push(invoice);

                if (invoicesToReceive[invoice.id]) {
                  $scope.invoiceToReceive.invoices[invoice.id] = true;
                } else {
                  $scope.invoiceToReceive.invoices[invoice.id] = false;
                }
              }



            }


          }
        }, true);


        var invoicesKeys = Object.keys($scope.invoiceToSent.invoices);
        var invoiceNum;

        for (var i = 0; i < invoicesKeys.length; i++) {
          var key = invoicesKeys[i];

          if ($scope.invoiceToSent.invoices[key]) {
            invoiceNum = key;
            break;
          }

        }


        // var invoiceNum = Object.keys($scope.invoiceToSent.invoices)[0];

        if (invoiceNum) {
          var invoice = $scope.allInvoicesList.find(function(el) {
            return el.number == invoiceNum;
          });
          $scope.setCompany(CompaniesService.getOneById(invoice.company.id));

        }

        $scope.$watch('partialPaymentAmount', function(val, oldVal) {


          if (val === undefined || (Number(val) != val && val !== null)) {
            $scope.partialPaymentAmount = oldVal;
          }

          if (val  && val >= $scope.receivePaymentSum) {
            $scope.partialPaymentAmount = $scope.receivePaymentSum;
          }
          if ((val && val >= ($scope.balance)) || (val === undefined) || (val === 0)) {
            $scope.partialPaymentAmount = $scope.balance;
          } else {
            $scope.partialPaymentAmount = val;
          }
        });


        $scope.paymentMethod = {
          CASH: 'Cash',
          CHEQUE: 'Cheque',
          DEBIT_CARD: 'Debit Card',
          CREDIT_CARD: 'Credit Card',
          WIRE_TRANSFER: 'Wire Transfer'
        };

        $scope.close = function () {
          $uibModalInstance.dismiss('cancel');
        };


        if ($scope.mode === 'list') {
          for (var i = 0; i < invoiceList.length; i++) {
            if ($scope.invoiceToSent.invoices[invoiceList[i].number]) {
              $scope.receivePaymentInvoices.push(invoiceList[i]);
            }
          }
        } else {
          for (var companyId in $scope.invoiceToSent) {
            var invoices = $scope.invoiceToSent[companyId].invoices || {};
            for (var i = 0; i < invoiceList.length; i++) {
              if (invoices[invoiceList[i].number]) {
                $scope.receivePaymentInvoices.push(invoiceList[i]);
              }
            }
          }
        }

        for (var i = 0; i < $scope.receivePaymentInvoices.length; i++) {
          $scope.invoiceToReceive.invoices[$scope.receivePaymentInvoices[i].id] = true;
        }

        if ($scope.receivePaymentInvoices[0] && $scope.receivePaymentInvoices[0].company) {
          var company = CompaniesService.getOneById($scope.receivePaymentInvoices[0].company.id);
          if (company.defaultPaymentMethod) {
            $scope.invoiceToReceive.method = company.defaultPaymentMethod;
          }
        }



        $scope.$watch('invoiceToReceive.invoices', function () {

          var counter = 0,
            invoices = $scope.invoiceToReceive.invoices;

          for (var invoiceId in invoices) {
            if (invoices[invoiceId]) {
              counter++;
            }
          }

          $scope.countReceiveInvoice = counter;
          $scope.invoiceToReceive.chooseAll = ($scope.receivePaymentInvoices.length === counter);
          $scope.receivePaymentSum = 0;
          $scope.balance = 0;

          for (var i = 0, len = $scope.receivePaymentInvoices.length; i < len; i++) {
            var invoice = $scope.receivePaymentInvoices[i];
            if (invoices[invoice.id]) {
              $scope.receivePaymentSum += invoice.sum;

              $scope.balance += (invoice.sum - invoice.paidSum);
            }
          }

        }, true);

        $scope.changeChooseAll = function () {
          var invoices = $scope.invoiceToReceive.invoices;
          for (var invoice in invoices) {
            invoices[invoice] = $scope.invoiceToReceive.chooseAll;
          }
        };

        $scope.receivePayment = function (form) {
          if (checkNoteError()) {
            $scope.noteError = true;
            return false;
          } else {
            $scope.noteError = false;
          }
          if ($scope.countCheckedInvoices() === 1 && !$scope.partialPaymentAmount && $scope.partialPaymentAmount !== 0) {
            $scope.triedToSaveService = true;
            return;
          }
          var diff = moment($scope.date).diff(moment(new Date()), 'day');
          if (diff === 0) {
            $scope.date = new Date();
          }
          var data = {
            date: moment($scope.date).format('x'),
            reference: $scope.reference,
          };
          if ($scope.partialPaymentAmount && $scope.countCheckedInvoices() === 1) {
            data.partialPaymentAmount = $scope.partialPaymentAmount
          }
          var invoiceIdPayment = [],
            invoices = $scope.invoiceToReceive.invoices;

          var singlePayment = $scope.selectedInvoiceCount <= 1;

          if (singlePayment && !$scope.isMultiple) {
            invoiceIdPayment = [$scope.selectedInvoice.id];
          } else {
            for (var id in invoices) {
              if (invoices[id]) {
                invoiceIdPayment.push(id);
              }
            }
          }
          $scope.disableReceiveButton = true;

          ReceivableService.receivePayment(
            $scope.invoiceToReceive.method, invoiceIdPayment, !!$scope.invoiceToReceive.isSendNotification, $scope.note,
            function () {
              $uibModalInstance.dismiss('cancel');
              $scope.disableReceiveButton = false;
              $scope.invoiceToSent.invoices = {};
            }, data
          );
        };

      }]);

}());
