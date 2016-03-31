'use strict';

(function () {

  angular.module('quicktech.core.recurring').controller('quicktech.core.recurring.editInvoiceCtrl',
    ['$scope', 'RecurringService', 'BillableService', 'CompaniesService', 'ServicesService', '$filter',
      'ProductsService', 'EmailSettingsService', '$timeout', 'TicketsService',
      function ($scope, RecurringService, BillableService, CompaniesService, ServicesService, $filter,
                ProductsService, EmailSettingsService, $timeout, TicketsService) {

        var day = 1000 * 60 * 60 * 24;
        var isEditOrderLoad;

        $scope.repeatingPattern = /^(\d?[0-9]{0,17})?(Monthly)?(Yearly)?$/;
        $scope.savedRepeatingInvoice = '';
        $scope.disabledSaveInvoice = true;
        $scope.reInitEndDate = true;
        $scope.searchCompany = '';
        $scope.paramInvocie = {
          paymentTerms: '',
          repeatingInvoice: '',
          numToGenerate: ''
        };
        $scope.tryAddExpense = {
          tryToAddProduct: false,
          tryToAddService: false
        };

        $scope.companies = CompaniesService.getClientCompanies();
        $scope.autocompleteData = ProductsService.getFullListForAutocomplete();

        if ($scope.invoice && $scope.invoice.id) {
          isEditOrderLoad = true;

          $scope.searchCompany = CompaniesService.getOneById($scope.invoice.company.id).name;
          $scope.actualInvoiceNumber = $scope.invoice.number;
          $scope.minSentOnDate = new Date($scope.invoice.sentOn);
          $scope.minEndDate = new Date($scope.invoice.endDate);

          $scope.editInvoice = {
            id: $scope.invoice.id,
            company: {
              id: $scope.invoice.company.id
            },
            title: $scope.invoice.title,
            isRecurring: true,
            purchaseOrder: $scope.invoice.purchaseOrder,
            paymentTerms: $scope.invoice.paymentTerms,
            memo: $scope.invoice.memo,
            sentOn: new Date($scope.invoice.sentOn),
            endDate: new Date($scope.invoice.endDate),
            products: angular.copy($scope.invoice.products),
            services: angular.copy($scope.invoice.services)
          };

          for(var i = 0, len = $scope.editInvoice.services.length; i < len; i++){
            $scope.editInvoice.services[i].quantity = ( $scope.editInvoice.services[i].quantity * 60);
            $scope.editInvoice.services[i].date =  $filter('date')($scope.editInvoice.services[i].date, 'd MMM yyyy');
          }

          $timeout(function () {
            if ($scope.invoice.frequency) {
              $scope.paramInvocie.repeatingInvoice = $scope.invoice.frequency === 'MONTHLY' ? 'Monthly' : 'Yearly';
            } else {
              $scope.paramInvocie.repeatingInvoice = $scope.invoice.customFrequency;
            }

            $scope.paramInvocie.paymentTerms = $scope.invoice.paymentTerms;
          }, 0)

        } else {

          $scope.minSentOnDate = new Date(Date.now() + day);
          $scope.minEndDate = new Date(Date.now() + day);

          TicketsService.getActualNumber($scope, function (number) {
            $scope.actualInvoiceNumber = number;
          });

          $scope.editInvoice = {
            isRecurring: true,
            products: [],
            services: [],
            sentOn: new Date(Date.now() + day),
            endDate: new Date(Date.now() + day)
          };

          EmailSettingsService.getTermsAndConditions(function (invoiceInfo) {
            $scope.paramInvocie.paymentTerms = invoiceInfo.term;
            $scope.editInvoice.paymentTerms = invoiceInfo.term;
          });

        }

        $scope.setDisabledSaveInvoice = function (value) {
          $scope.disabledSaveInvoice = !!value;
        };

        $scope.isShowingErrors = function (form, fieldName) {
          return form && form[fieldName] && ($scope.triedToSaveInvoice || form[fieldName].$dirty) && form[fieldName].$invalid;
        };

        $scope.getErrorMessage = function (form) {
          if (form && $scope.triedToSaveInvoice) {
            var error = Object.keys(form.$error);

            if (error.indexOf("required") !== -1) {

              for (var i = 0, len = form.$error.required.length; i < len; i++) {

                if (form.$error.required[i].$name.indexOf('updateInvoiceProduct') !== -1) {
                  if ($scope.tryAddExpense.tryToAddProduct) {
                    return 'Required fields cannot be left empty.';
                  }

                } else if (form.$error.required[i].$name.indexOf('updateInvoiceService') !== -1) {
                  if ($scope.tryAddExpense.tryToAddService) {
                    return 'Required fields cannot be left empty.';
                  }

                } else {
                  return 'Required fields cannot be left empty.';
                }
              }
            } else if (error && error.length > 0) {
              return 'Form is not valid.';
            }

            if ($scope.disabledSaveInvoice) {
              return 'Order must have expense.'
            }

          }
        };

        $scope.chooseCompany = function (company) {
          if (!company) {
            delete $scope.editInvoice.company;
            delete $scope.companyServices;
            for (var i = 0, len = $scope.editInvoice.services.length; i < len; i++) {
              if ($scope.editInvoice.services[i].type === 'service') {
                delete $scope.editInvoice.services[i].item;
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
          $scope.paramInvocie.paymentTerms = parseInt(value);
        };

        $scope.$watch('paramInvocie.paymentTerms', function (val) {
          if (val && $scope.editInvoiceForm.paymentTerms && $scope.editInvoiceForm.paymentTerms.$pristine) {
            $scope.editInvoiceForm.paymentTerms.$setDirty();
          }
          $scope.editInvoice.paymentTerms = parseInt(val);
        });

        $scope.changeRepeatInvoice = function () {
          changeRepeatAndStart();
        };

        $scope.changeStartDate = function () {
          if (isEditOrderLoad) {
            isEditOrderLoad = false;
            return;
          }
          changeRepeatAndStart();
        };

        $scope.setRepeatingInvoice = function (value) {
          var parsed = parseInt(value);
          if (parsed) {
            $scope.paramInvocie.repeatingInvoice = parsed;
          } else {
            $scope.paramInvocie.repeatingInvoice = value;
          }
          $scope.changeRepeatInvoice();
        };

        $scope.saveAndClear = function () {
          $scope.savedRepeatingInvoice = $scope.paramInvocie.repeatingInvoice;
          $scope.paramInvocie.repeatingInvoice = '';
        };

        $scope.isNumber = function (value) {
          return parseInt(value);
        };

        function changeRepeatAndStart() {
          var val = [$scope.paramInvocie.repeatingInvoice, $scope.editInvoice.sentOn];

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
        };

        $scope.changeNumToGenerate = function () {
          var val = $scope.paramInvocie.numToGenerate;

          if (!(val && $scope.paramInvocie.repeatingInvoice && $scope.editInvoice.sentOn)) {
            return;
          }

          if (+val === 0) {
            $scope.clearEndDate();
            return;
          }

          setEndAndNum('endDate');
        };

        $scope.changeEndDate = function () {
          var val = $scope.editInvoice.endDate;

          if (!val) {
            $scope.paramInvocie.numToGenerate = undefined;
            $scope.isNumInfinity = true;
            return
          }
          if (!($scope.paramInvocie.repeatingInvoice && $scope.editInvoice.sentOn)) {
            return;
          }

          setEndAndNum('num');
        };

        function setEndAndNum(option) {
          var repeat = $scope.paramInvocie.repeatingInvoice;
          var sentOn = new Date($filter('date')($scope.editInvoice.sentOn, 'd MMM yyyy'));

          if (option === 'endDate') {
            var endDate = new Date(sentOn);
            var num = parseInt($scope.paramInvocie.numToGenerate);

            if (repeat === 'Monthly') {
              endDate.setMonth(sentOn.getMonth() + num);
            } else if (repeat === 'Yearly') {
              endDate.setFullYear(sentOn.getFullYear() + num);
            } else if (parseInt(repeat) > 0) {
              endDate = +(new Date(sentOn)) + (parseInt(repeat) * day * num);
            } else {
              console.error('Unsupported Repeating Invoice every')
            }

            endDate = $filter('date')(endDate, 'd MMM yyyy');
            $scope.editInvoice.endDate = endDate;

          } else if (option === 'num') {
            var endDate = new Date($scope.editInvoice.endDate);
            var newNum;

            if (repeat === 'Monthly') {
              newNum = numOfMonth(sentOn, endDate);
            } else if (repeat === 'Yearly') {
              newNum = numOfYear(sentOn, endDate);
            } else if (parseInt(repeat) > 0) {
              newNum = Math.floor((+endDate - +sentOn) / (parseInt(repeat) * day));
            } else {
              console.error('Unsupported Repeating Invoice every')
            }

            $scope.paramInvocie.numToGenerate = newNum;
          }
        }

        $scope.clearEndDate = function () {
          $scope.editInvoice.endDate = undefined;
          $scope.changeEndDate();
        };

        $scope.clearInfinity = function () {
          $scope.isNumInfinity = false;
          $scope.paramInvocie.numToGenerate = 1;
          $scope.changeNumToGenerate();
        };

        function numOfMonth(sentOn, endDate) {
          var sentOn = new Date(sentOn);
          var endDate = new Date(endDate);
          var count = 0;

          setCount();

          return count

          function setCount() {
            sentOn = new Date(sentOn.setMonth(sentOn.getMonth() + 1));

            if (+sentOn <= +endDate) {
              count++;
              setCount();
            }
          }
        }

        function numOfYear(sentOn, endDate) {
          var sentOn = new Date(sentOn);
          var endDate = new Date(endDate);
          var count = 0;

          setCount();

          return count

          function setCount() {
            sentOn = new Date(sentOn.setFullYear(sentOn.getFullYear() + 1));

            if (+sentOn <= +endDate) {
              count++;
              setCount();
            }
          }
        }

        function reInitEndDate() {
          $scope.reInitEndDate = false;
          $timeout(function () {
            $scope.reInitEndDate = true;
          }, 0);
        }

        $scope.saveInvoice = function (form) {
          if (form.$valid && !$scope.disabledSaveInvoice) {
            $scope.hardDisabledSave = true;

            var editInvoice = angular.copy($scope.editInvoice);

            if (!$scope.paramInvocie.repeatingInvoice && $scope.savedRepeatingInvoice) {
              $scope.paramInvocie.repeatingInvoice = $scope.savedRepeatingInvoice;
            }

            if ($scope.paramInvocie.repeatingInvoice === 'Monthly' || $scope.paramInvocie.repeatingInvoice === 'Yearly') {
              editInvoice.frequency = $scope.paramInvocie.repeatingInvoice === 'Monthly' ? 'MONTHLY' : 'YEARLY'
            } else {
              editInvoice.customFrequency = parseInt($scope.paramInvocie.repeatingInvoice)
            }

            editInvoice.endDate = new Date(editInvoice.endDate);
            editInvoice.sentOn = new Date(editInvoice.sentOn);

            if (editInvoice.isRecurring) {
              RecurringService.saveRecurringOrder(editInvoice, function () {
                $scope.toogleEditForm();
                $scope.hardDisabledSave = false;
              })
            } else {
              BillableService.saveRegularOrder(editInvoice, function () {
                $scope.toogleEditForm();
                $scope.hardDisabledSave = false;
              })
            }
          } else {
            $scope.tryAddExpense.tryToAddProduct = true;
            $scope.tryAddExpense.tryToAddService = true;
            $scope.triedToSaveInvoice = true;
          }
        };

      }]);

}());
