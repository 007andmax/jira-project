'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.newPaymentsCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      'quicktech.common.services.PermissionsService', 'TicketsService', 'TaxesService', '$uibModal', '$rootScope', 'PaymentsService',
      function ($scope,
                BillableService,
                CompaniesService,
                SharedStateService,
                PermissionsService,
                TicketsService,
                TaxesService,
                $uibModal,
                $rootScope,
                PaymentsService) {
        $scope.showTooltipArray = [];
        $scope.payments = [];
        $scope.filteredPayments = [];
        $scope.limitValue = 20;
        $scope.offset = 0;
        $scope.companyName = '';
        $scope.invoiceNumber = '';
        $scope.startDate = '';
        $scope.endDate = '';
        $scope.status = '';
        $scope.sortBy = '';
        $scope.stopReqeust = false;
        $scope.stopScroll = false;
        $scope.sortByItem = null;

        $scope.getStopScrollStatus = function() {
          return $scope.stopScroll;
        };

        $scope.companies = getCompaniesNames(CompaniesService.getClientCompanies());

        function getCompaniesNames(list) {
          const filteredArray = [];
          list.map((item) => {
            filteredArray.push(item.name);
          });
          return filteredArray;
        }
        console.log($scope.companiesitem, '$scope.companiesitem');

        $scope.myPagingFunction = function (data) {
          $scope.stopScroll = true;
          if (!$scope.stopReqeust) {
            $scope.offset = $scope.offset + $scope.limitValue;
            if (data) {
              $scope.data = data;
            } else {
              $scope.data = $scope.returnData();
            }
            PaymentsService.getPaymentsData($scope.data, $scope, function(res) {
              if (res.length > 0 && Array.isArray(res)) {
                $scope.payments = [...$scope.payments, ...res];
                $scope.filteredPayments = [...$scope.filteredPayments, ...res];
                $scope.filteredPayments.map(function(item) {
                  return $scope.showTooltipArray.push(false);
                });
              } else {
                $scope.stopReqeust = true;
              }
              return new Promise(() => {
                $scope.stopScroll = false;
              });
            });
          }
          console.log($scope.stopScroll, '123512351235123512351235123');
        };


        $scope.openModal = function(modalType, payment) {
          var template = '/ng1/scripts/core/billable/new-billable-modals/' + modalType + '.tpl.html';

          $scope.editedPayment = payment;

          var modalInstance = $uibModal.open({
            templateUrl: template,
            animation: true,
            backdrop: true,
            controller: 'quicktech.core.billable.newModalsCtlr',
            windowClass: 'modal-receive-payment margin-top-modal-dialog',
            resolve: {
              editedPayment: function() { return payment }
            }

          });
        };


        $scope.parsePaymentMethod = function(method) {
          return method.split('_').map(function(el) {
            return el[0].toUpperCase() + el.slice(1).toLowerCase();
          }).join(' ');
        };

        $scope.showInvoice = function(invoice, goBack) {

          if (typeof invoice === 'string') {
            invoice = $rootScope.allInvoices.find(function(el) {
              return el.number === invoice;
            });
          }
          $scope.isInvoiceShown = goBack ? false : true;

          if (goBack) {

            setTimeout(function() {
              window.scrollTo(0, 10);
              window.scrollTo(0, 0);
            }, 0)

          }
          $rootScope.invoiceToShow = invoice;
        };

        $scope.orderPayments = {
          field: 'date',
          reverse: true
        };


        $scope.orderByForPayments = function (item) {
          //$scope.stateComparator= false;
          if ($scope.orderPayments.field === 'number') {
            return parseInt(item.partialPaidInvoice || (item.invoiceNumbers && item.invoiceNumbers[0])) || 0;
          } else if ($scope.orderPayments.field === 'name') {
            return item.clientCompanyName
          } else if ($scope.orderPayments.field === 'readedAt') {
            if($scope.sortForReadedAtReverse) {
              return item.readedAtInMillisecondsReverse;
            } else {
              return -item.readedAtInMilliseconds;
            }
          } else if ($scope.orderPayments.field === 'date') {
            return new Date(item.createdAt);
          } else if ($scope.orderPayments.field === 'dueDate') {
            return  item.daysDueDateForSorting;
          } else if ($scope.orderPayments.field === 'amount') {
            return item.partialPaidAmount || item.totalSum
          } else if ($scope.orderPayments.field === 'sum') {
            return item.sum
          } else if ($scope.orderPayments.field === 'status') {
            return item.refundMethod ? 'Refund' : 'Paid';
          } else {
            return item[$scope.orderPayments.field]
          }
        };

        $scope.setOrderByPayments = function (option) {
          console.log('sfdsfdsfdsfd', option);
          switch(option) {
            case 'date':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'PAYMENT_DATE_ASC' ? 'PAYMENT_DATE_ASC' : 'PAYMENT_DATE_DESC';

              $scope.data = $scope.returnData();
              $scope.myPagingFunction($scope.data);
              break;
            // case 'number': TODO: when back will be done
            //   console.log('number');
            //   $scope.resetAllFiltersForSort();
            //   $scope.sortByItem = $scope.sortByItem !== 'INVOICE_NUMBER_ASC' ? 'INVOICE_NUMBER_ASC' : 'INVOICE_NUMBER_DESC';
            //   $scope.data = $scope.returnData();
            //   $scope.myPagingFunction($scope.data);
            //   break;
            case 'name':
              console.log('name');
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'COMPANY_NAME_ASC'? 'COMPANY_NAME_ASC' : 'COMPANY_NAME_DESC';
              $scope.data = $scope.returnData();
              $scope.myPagingFunction($scope.data);
              break;
            case 'paymentMethod':
              console.log('paymentMethod');
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'PAYMENT_METHOD_ASC' ? 'PAYMENT_METHOD_ASC' : 'PAYMENT_METHOD_DESC';
              $scope.data = $scope.returnData();
              $scope.myPagingFunction($scope.data);
              break;
            case 'amount':
              console.log('amount');
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'AMOUNT_ASC' ? 'AMOUNT_ASC' : 'AMOUNT_DESC';
              $scope.data = $scope.returnData();
              $scope.myPagingFunction($scope.data);
              break;
            case 'status':
              console.log('status');
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'STATUS_ASC' ? 'STATUS_ASC' : 'STATUS_DESC';
              $scope.data = $scope.returnData();
              $scope.myPagingFunction($scope.data);
              break;
            default:
              $scope.resetAllFiltersForSort();
              $scope.data = $scope.returnData();
              $scope.myPagingFunction($scope.data);
              break;
          }

        };

        $scope.returnData = function() {
          return ({
            limit: $scope.limitValue,
            offset: $scope.offset,
            startDate: $scope.dateFilter.startDate ? new Date($scope.dateFilter.startDate).getTime() : null,
            endDate: $scope.dateFilter.endDate ? new Date($scope.dateFilter.endDate).getTime() : null,
            companyName : $scope.companyFilterName ? $scope.companyFilterName : null,
            status: $scope.sortByValue ? $scope.sortByValue.toUpperCase() : null,
            sortBy: $scope.sortByItem ? $scope.sortByItem : null
          })
        };


        $scope.dateFilterOptions = {
          'autoApply': true,
          "cancelClass": "btn-secondary",
          locale: {
            "format": 'D MMM YYYY'
          }
        };

        $scope.dateFilter = {startDate: null, endDate: null};

        $scope.clearDateFilter = function() {
          console.log('clear');
          $scope.data = $scope.returnData();
          $scope.resetAllFilters();
          $scope.myPagingFunction();
        };

        $scope.sortBy = function(criteria) {
          $scope.sortByValue = criteria;
          console.log('value');
          $scope.resetAllFiltersForSort();
          $scope.data = $scope.returnData();
          $scope.myPagingFunction($scope.data);
        };

        $scope.sortByValue = '';

        // $scope.$watch('sortByValue', function(val) {
        //   filterPayments();
        // })


        $scope.$watch('dateFilter', function(val) {
          console.log(val, '1235');
          $scope.resetAllFiltersForSort();
          $scope.data = $scope.returnData();
          $scope.myPagingFunction($scope.data);

        }, true);

        $scope.$watch('stopScroll', function(val) {
          console.log(val, '1235');
        }, true);

        $scope.resetAllFilters = function(dateFilterClear) {
          $scope.dateFilter = !dateFilterClear ? {startDate: null, endDate: null} : $scope.dateFilter;
          $scope.stopReqeust = false;
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.sortByItem = null;
          $scope.offset = 0;
        };

        $scope.resetAllFiltersForSort = function() {
          $scope.stopReqeust = false;
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.offset = 0;
        };


        $scope.resetFilter = function() {
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.companyFilterName = null;
          $scope.offset = 0;
          $scope.data = $scope.returnData();
          $scope.myPagingFunction($scope.data)
        };

        $scope.$watch('filterCompany', function(value, oldVal) {
          $scope.companyFilterName = value;

          if(value && value.length > 1) {
            $scope.resetAllFiltersForSort();
            $scope.stopReqeust = false;
            $scope.offset = 0;
            $scope.data = $scope.returnData();
            console.log('51235123');
            $scope.filteredPayments = [];
            $scope.payments = [];
            $scope.myPagingFunction($scope.data)
          }
        });


        $scope.onFilterClick = function() {
          console.log('3215235§');
          $scope.filterWasClicked = true;
        };

        $scope.onFilterPress = function(evt) {
          console.log('111111');
          if (evt.keyCode == 8) {
            console.log('2222222');
            $scope.wasFilterReset = true;
          }
        };

        $scope.deletePayment = function(id) {
          PaymentsService.deletePayment(id, function(res) {
          })
        };

        $scope.showTooltip = function(event, index, type) {
          event.stopPropagation();
          return type ? $scope.showTooltipArray[index] = true : $scope.showTooltipArray[index] = !$scope.showTooltipArray[index];
        };

        $scope.hideAllTooltiip = function(event) {
          event.preventDefault();
          $scope.showTooltipArray = [];
          // $scope.filteredPayments.map(function(item) {
          //   return $scope.showTooltipArray.push(false);
          // });
        };


        PaymentsService.getPaymentsData($scope.data, $scope, function(res) {

          $scope.payments = res;
          $scope.filteredPayments = res;
          $scope.filteredPayments.map(function(item) {
            return $scope.showTooltipArray.push(false);
          });

        });
      }]);

}());
