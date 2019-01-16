'use strict';

(function () {

  angular.module('quicktech.core.receivable').controller('quicktech.core.receivable.receivePaymentCtrl',
    ['$scope', '$uibModalInstance', '$stateParams', 'ReceivableService', 'CompaniesService', '$timeout', '$rootScope',
      function ($scope, $uibModalInstance, $stateParams, ReceivableService, CompaniesService, $timeout, $rootScope) {

        var invoiceList = ($scope.receivableInvoicesData && $scope.receivableInvoicesData.list) || $rootScope.uploadedReceivable.list;


        $scope.invoiceToReceive = {
          invoices: {},
          method: 'CHEQUE',
          isSendNotification: true
        };
        $scope.receivePaymentInvoices = [];

        $scope.allInvoicesList = ($scope.receivableInvoicesData && $scope.receivableInvoicesData.list) || $rootScope.uploadedReceivable.list;
        $scope.partialPaymentAmount = 0;
        if (!$scope.invoiceToSent) {
          $scope.invoiceToSent = { invoices: [] }
        }

        $scope.companies = Object.keys(($scope.receivableInvoicesData || $rootScope.uploadedReceivable).companies).map(function(id) {
          return CompaniesService.getOneById(id);
        })


        $scope.availableInvoiceCompanies = [];

        $scope.setCompany = function(company) {
          $scope.invoiceCompany = company;
        }

        $scope.setInvoice = function(invoice) {
          $scope.selectedInvoice = invoice;
        }

        $scope.maxDate = new Date();

        console.log(Object.assign({}, $scope.invoiceToSent), "PAYMENT")

        var isNumberKey = $rootScope.isNumberKey

        console.log($scope.isMultiple, 'SSSS')


        $scope.setIsMultiple = function(val) {
          $scope.isMultiple = val;
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
        }

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


            console.log($scope.invoiceToReceive.invoices, 'ddd')
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
          })

          $scope.setCompany(CompaniesService.getOneById(invoice.company.id));

        }

        $scope.$watch('partialPaymentAmount', function(val, oldVal) {


          if (val === undefined || (Number(val) != val && val !== null)) {
            $scope.partialPaymentAmount = oldVal;
          }

          if (val  && val >= $scope.receivePaymentSum) {
            $scope.partialPaymentAmount = $scope.receivePaymentSum;
          }
        })

        // $scope.$watch('isMultiple', function(val) {
        //   console.log('is multiple, is multipleeee')
        //   if (val === false) {
        //     $scope.isSinglePayment = true;
        //
        //     $scope.$watch('invoiceCompany', function(val) {
        //       if (val) {
        //         $scope.availableInvoiceCompanies = $scope.allInvoicesList.filter(function(el) {
        //           return el.company.id === val.id && !el.paidOn;
        //         })
        //
        //         $scope.selectedInvoice = null;
        //         $scope.partialPaymentAmount = null;
        //       }
        //     }, true);
        //
        //     $scope.$watch('selectedInvoice', function(val) {
        //       if (val) {
        //         $scope.invoiceDescription = "Invoice #" + val.number + ' Amount: ' + '$' + (val.sum).toFixed(2);
        //       } else {
        //         $scope.invoiceDescription = '';
        //       }
        //     }, true);
        //
        //     $scope.$watch('partialPaymentAmount', function(val) {
        //       if (val && $scope.selectedInvoice && val >= $scope.selectedInvoice.sum) {
        //         $scope.partialPaymentAmount = $scope.selectedInvoice.sum;
        //       }
        //     })
        //
        //
        //
        //     if ($scope.selectedInvoiceCount === 1) {
        //       var invoiceNum = Object.keys($scope.invoiceToSent.invoices)[0];
        //       var invoice = $scope.allInvoicesList.find(function(el) {
        //         return el.number == invoiceNum;
        //       })
        //
        //       $scope.setCompany(CompaniesService.getOneById(invoice.company.id));
        //
        //       $timeout($scope.setInvoice.bind(this, invoice), 100)
        //       // $scope.setInvoice(invoice);
        //     }
        //
        //   } else if (val === true) {
        //
        //   }
        // })


        // if ($scope.selectedInvoiceCount <= 1) {
        //
        // } else {
        //
        //
        //
        //
        // }

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

        console.log($scope.invoiceToSent, 'sssss!!!!')

        if ($scope.mode === 'list') {
          for (var i = 0; i < invoiceList.length; i++) {
            if ($scope.invoiceToSent.invoices[invoiceList[i].number]) {
              $scope.receivePaymentInvoices.push(invoiceList[i]);
            }
          }
        } else {
          for (var companyId in $scope.invoiceToSent) {
            var invoices = $scope.invoiceToSent[companyId].invoices || {};
            console.log(invoices, 'INVOICES', invoiceList, 'sfsdsfsfsfsfsfssdfsfs')
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

          for (var i = 0, len = $scope.receivePaymentInvoices.length; i < len; i++) {
            var invoice = $scope.receivePaymentInvoices[i];
            if (invoices[invoice.id]) {
              $scope.receivePaymentSum += invoice.sum;
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



          if ($scope.countCheckedInvoices() === 1 && !$scope.partialPaymentAmount && $scope.partialPaymentAmount !== 0) {
            $scope.triedToSaveService = true;
            return;
          }


          var data = {
            date: moment($scope.date).format('x'),
            reference: $scope.reference,

          }



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
                invoiceIdPayment.push(id)
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
