'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceCtrl',
    ['$scope', 'RecurringService', 'BillableService', 'CompaniesService', 'ServicesService', '$filter', 'ProductsService', 'EmailSettingsService', '$timeout',
      function ($scope, RecurringService, BillableService, CompaniesService, ServicesService, $filter, ProductsService, EmailSettingsService, $timeout) {

        var day = 1000 * 60 * 60 * 24;

        $scope.reInitEndDate = true;
        $scope.searchCompany = '';
        $scope.paymentTerms = '';
        $scope.repeatingInvoice = '';

        $scope.minSentOnDate = new Date(Date.now() + day);
        $scope.minEndDate = new Date(Date.now() + day);
        $scope.companies = CompaniesService.getClientCompanies();
        $scope.autocompleteData = ProductsService.getFullListForAutocomplete();


        if ($scope.invoice && $scope.invoice.id) {
          $scope.editInvoice = $scope.invoice.staticCopy()
        } else {

          $scope.actualInvoiceNumber = BillableService.getActualInvoiceNumber($scope, function (value) {
            $scope.actualInvoiceNumber = value;
          });

          $scope.editInvoice = {
            isRecurring: true,
            expenses: [],
            startDate: new Date(Date.now() + day),
            endDate: new Date(Date.now() + day)
          };

          EmailSettingsService.getTermsAndConditions(function (invoiceInfo) {
            $scope.paymentTerms = invoiceInfo.term + ' days';
            $scope.editInvoice.paymentTerms = parseInt(invoiceInfo.term)
          });

        }

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSaveInvoice || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.chooseCompany = function (company) {
          if (!company) {
            delete $scope.editInvoice.company;
            delete $scope.companyServices;
            for (var i = 0, len = $scope.editInvoice.expenses.length; i < len; i++) {
              if ($scope.editInvoice.expenses[i].type === 'service') {
                delete $scope.editInvoice.expenses[i].item;
              }
            }
            return;
          }

          $scope.searchCompany = company.name;
          $scope.editInvoice.company = {
            id: company.id
          };

          $scope.companyServices = ServicesService.getAllByCompany($scope, company.id);
        };

        $scope.$watch('searchCompany', function (val) {
          if (!val) {
            $scope.chooseCompany();
            return;
          }

          $scope.editInvoiceForm.customer && $scope.editInvoiceForm.customer.$pristine && $scope.editInvoiceForm.customer.$setDirty();

          for (var i = 0, len = $scope.companies.length; i < len; i++) {
            if (val.toLowerCase() === $scope.companies[i].name.toLowerCase()) {
              $scope.chooseCompany($scope.companies[i]);
              return;
            }
          }

          $scope.chooseCompany();
        });

        $scope.setPaymentTerms = function (value) {
          $scope.paymentTerms = value;
        };

        $scope.$watch('paymentTerms', function (val) {
          if (val && $scope.editInvoiceForm.paymentTerms && $scope.editInvoiceForm.paymentTerms.$pristine) {
            $scope.editInvoiceForm.paymentTerms.$setDirty();
          }
          $scope.editInvoice.paymentTerms = parseInt(val);
        });

        $scope.setRepeatingInvoice = function (value) {
          $scope.repeatingInvoice = value;
        };

        $scope.$watchGroup(['repeatingInvoice', 'editInvoice.startDate'], function (val) {
          if (!(val[0] && val[1])) {
            $scope.disabledEndAndNum = true;
            return;
          }
          $scope.disabledEndAndNum = false;

          var repeat = val[0];
          var startDay = val[1];
          var endDay = new Date(startDay);

          if ($scope.editInvoiceForm.repeatingInvoice && $scope.editInvoiceForm.repeatingInvoice.$pristine) {
            $scope.editInvoiceForm.repeatingInvoice.$setDirty();
          }

          if (repeat === 'Monthly') {
            $scope.repeatingInvoiceModel = true;
            endDay.setMonth(startDay.getMonth() + 1);
          } else if (repeat === 'Yearly') {
            $scope.repeatingInvoiceModel = true;
            endDay.setFullYear(startDay.getFullYear() + 1);
          } else if (parseInt(repeat) > 0) {
            $scope.repeatingInvoiceModel = true;
            endDay = +(new Date(startDay)) + (parseInt(repeat) * day);
          } else {
            $scope.repeatingInvoiceModel = undefined;
            endDay = undefined
          }

          endDay = $filter('date')(endDay, 'd MMM yyyy');

          $scope.minEndDate = endDay;
          $scope.editInvoice.endDate = endDay;
          reInitEndDate();

        });

        $scope.$watch('numToGenerate', function (val) {
          if (!(val && $scope.repeatingInvoice && $scope.editInvoice.startDate)) {
            return;
          }

          setEndAndNum('endDate');
        });

        $scope.$watch('editInvoice.endDate', function (val) {
          if(!val){
            $scope.numToGenerate = undefined;
            $scope.isNumInfinity = true;
            return
          }
          if (!($scope.repeatingInvoice && $scope.editInvoice.startDate)) {
            return;
          }

          setEndAndNum('num');
        });

        function setEndAndNum(option) {
          var repeat = $scope.repeatingInvoice;
          var startDate = new Date($filter('date')($scope.editInvoice.startDate, 'd MMM yyyy'));

          if (option === 'endDate') {
            var endDate = new Date(startDate);
            var num = parseInt($scope.numToGenerate);

            if (repeat === 'Monthly') {
              endDate.setMonth(startDate.getMonth() + num);
            } else if (repeat === 'Yearly') {
              endDate.setFullYear(startDate.getFullYear() + num);
            } else if (parseInt(repeat) > 0) {
              endDate = +(new Date(startDate)) + (parseInt(repeat) * day * num);
            } else {
              console.error('Unsupported Repeating Invoice every')
            }

            endDate = $filter('date')(endDate, 'd MMM yyyy');
            $scope.editInvoice.endDate = endDate;

          } else if (option === 'num') {
            var endDate = new Date($scope.editInvoice.endDate);
            var newNum;

            if (repeat === 'Monthly') {
              newNum = numOfMonth(startDate, endDate);
            } else if (repeat === 'Yearly') {
              newNum = numOfYear(startDate, endDate);
            } else if (parseInt(repeat) > 0) {
              newNum = Math.round((+endDate - +startDate) / (parseInt(repeat) * day));
            } else {
              console.error('Unsupported Repeating Invoice every')
            }

            $scope.numToGenerate = newNum;
          }
        }

        $scope.clearEndDate = function(){
          $scope.editInvoice.endDate = undefined;
        };

        $scope.clearInfinity = function(){
          $scope.isNumInfinity = false;
          $scope.numToGenerate = 1;
        };

        function numOfMonth(startDate, endDate){
          var startDate = new Date(startDate);
          var endDate = new Date(endDate);
          var count = 0;

          setCount();

          return count

          function setCount(){
            startDate = new Date(startDate.setMonth(startDate.getMonth() + 1));

            if(+startDate <= +endDate){
              count++;
              setCount();
            }
          }
        }

        function numOfYear(startDate, endDate){
          var startDate = new Date(startDate);
          var endDate = new Date(endDate);
          var count = 0;

          setCount();

          return count

          function setCount(){
            startDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));

            if(+startDate <= +endDate){
              count++;
              setCount();
            }
          }
        }

        function reInitEndDate(){
          $scope.reInitEndDate = false;
          $timeout(function(){
            $scope.reInitEndDate = true;
          }, 0);
        }

        $scope.saveInvoice = function (form) {
          if (form.$valid) {

            var editInvoice = angular.copy($scope.editInvoice);

            if($scope.repeatingInvoice === 'Monthly' || $scope.repeatingInvoice === 'Yearly'){
              editInvoice.frequency = $scope.repeatingInvoice === 'Monthly' ? 'MONTHLY' : 'YEARLY'
            } else {
              editInvoice.customFrequency = parseInt($scope.repeatingInvoice)
            }

            editInvoice.endDate = new Date(editInvoice.endDate);
            editInvoice.startDate = new Date(editInvoice.startDate);

            console.log($scope.editInvoice);
            if(editInvoice.isRecurring){
              RecurringService.saveRecurringOrder(editInvoice, function(resp){
                console.log(resp);
              })
            } else {
              BillableService.saveRegularOrder(editInvoice, function(resp){
                console.log(resp);
              })
            }
          } else {
            $scope.triedToSaveInvoice = true;
          }
        };

      }]);

}());
