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
        $scope.invoiceNumber = null;
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

        $scope.getPaymentsList = function (data) {
          console.log($scope.stopScroll, '$scope.stopScroll');
          $scope.stopScroll = true;
          console.log($scope.stopScroll, '$scope.stopScroll');
          console.log($scope.stopReqeust, '$scope.stopScroll');
          if (!$scope.stopReqeust) {
            $scope.stopReqeust = true;
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
                $scope.offset = $scope.offset + $scope.limitValue;
                $scope.stopScroll = false;
                $scope.stopReqeust = false;
              });
            });
          }
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

        $scope.setOrderByPayments = function (option) {
          switch(option) {
            case 'date':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'PAYMENT_DATE_ASC' ? 'PAYMENT_DATE_ASC' : 'PAYMENT_DATE_DESC';
              $scope.data = $scope.returnData();
              $scope.getPaymentsList($scope.data);
              break;
            // case 'number': TODO: when back will be done
            //   console.log('number');
            //   $scope.resetAllFiltersForSort();
            //   $scope.sortByItem = $scope.sortByItem !== 'INVOICE_NUMBER_ASC' ? 'INVOICE_NUMBER_ASC' : 'INVOICE_NUMBER_DESC';
            //   $scope.data = $scope.returnData();
            //   $scope.getPaymentsList($scope.data);
            //   break;
            case 'name':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'COMPANY_NAME_ASC'? 'COMPANY_NAME_ASC' : 'COMPANY_NAME_DESC';
              $scope.data = $scope.returnData();
              $scope.getPaymentsList($scope.data);
              break;
            case 'paymentMethod':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'PAYMENT_METHOD_ASC' ? 'PAYMENT_METHOD_ASC' : 'PAYMENT_METHOD_DESC';
              $scope.data = $scope.returnData();
              $scope.getPaymentsList($scope.data);
              break;
            case 'amount':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'AMOUNT_ASC' ? 'AMOUNT_ASC' : 'AMOUNT_DESC';
              $scope.data = $scope.returnData();
              $scope.getPaymentsList($scope.data);
              break;
            case 'status':
              $scope.resetAllFiltersForSort();
              $scope.sortByItem = $scope.sortByItem !== 'STATUS_ASC' ? 'STATUS_ASC' : 'STATUS_DESC';
              $scope.data = $scope.returnData();
              $scope.getPaymentsList($scope.data);
              break;
            default:
              break;
          }

        };

        $scope.returnData = function() {
          return ({
            limit: $scope.limitValue,
            offset: $scope.offset,
            invoiceNumber: $scope.invoiceNumber ? $scope.invoiceNumber : null,
            startDate: $scope.dateFilter.startDate ? new Date($scope.dateFilter.startDate).getTime() : null,
            endDate: $scope.dateFilter.endDate ? new Date($scope.dateFilter.endDate).getTime() : null,
            companyName : $scope.companyFilterName ? $scope.companyFilterName : null,
            status: $scope.sortByValue ? $scope.sortByValue.toUpperCase() : null,
            sortBy: $scope.sortByItem ? $scope.sortByItem : null
          });
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
          $scope.dateFilter =  {startDate: null, endDate: null};
          $scope.stopReqeust = false;
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.sortByItem = null;
          $scope.offset = 0;
          $scope.data = $scope.returnData();
          $scope.getPaymentsList();
        };

        $scope.sortBy = function(criteria) {
          $scope.sortByValue = criteria;
          $scope.resetAllFiltersForSort();
          $scope.data = $scope.returnData();
          $scope.getPaymentsList($scope.data);
        };

        $scope.sortByValue = '';

        $scope.$watch('invoiceNumberFilter', function(val) {
        });


        $scope.$watch('dateFilter', function(val) {
          $scope.resetAllFiltersForSort();
          $scope.data = $scope.returnData();
          $scope.getPaymentsList($scope.data);

        }, true);

        $scope.$watch('stopScroll', function(val) {
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
          $scope.stopReqeust = false;
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.companyFilterName = null;
          $scope.offset = 0;
          $scope.data = $scope.returnData();
          $scope.getPaymentsList($scope.data)
        };

        $scope.$watch('filterCompany', function(value, oldVal) {
          $scope.companyFilterName = value;

          if(value && value.length > 1) {
            $scope.resetAllFiltersForSort();
            $scope.stopReqeust = false;
            $scope.offset = 0;
            $scope.data = $scope.returnData();
            $scope.filteredPayments = [];
            $scope.payments = [];
            $scope.getPaymentsList($scope.data)
          }
        });


        $scope.onFilterPress = function(evt) {
        };

        $scope.onBlurInvoice = function(invoiceNumber) {
          $scope.resetAllFiltersForSort();
          $scope.stopReqeust = false;
          $scope.offset = 0;
          $scope.invoiceNumber = invoiceNumber;
          $scope.data = $scope.returnData();
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.getPaymentsList($scope.data);
        };

        $scope.onKeyPressInvoice = function($event) {
          if ($event.keyCode === 13) {
            $scope.onBlurInvoice($scope.invoiceNumber);
          }
        };

        $scope.deletePayment = function(id) {
          PaymentsService.deletePayment(id, function(res) {
          });
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
