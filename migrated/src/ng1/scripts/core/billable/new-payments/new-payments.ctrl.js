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

        $scope.getStopScrollStatus = function() {
          return $scope.stopScroll;
        };
        $scope.myPagingFunction = function (data) {
          $scope.stopScroll = true;
          console.log($scope.stopScroll, '123512351235123512351235123');
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
                console.log($scope.filteredPayments, 'RES');
                $scope.filteredPayments.map(function(item) {
                  return $scope.showTooltipArray.push(false);
                });

                $scope.companies = $scope.filteredPayments.reduce(function(acc, el) {
                  if (acc.indexOf(el.clientCompanyName) === -1) {
                    acc.push(el.clientCompanyName);
                  }
                  return acc;
                }, []);
              } else {
                $scope.stopReqeust = true;
              }
            });
          }
          $scope.stopScroll = false;
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
          $scope.resetAllFilters();
          $scope.data = $scope.returnData();
          $scope.myPagingFunction($scope.data);
        };

        $scope.sortByValue = '';

        // $scope.$watch('sortByValue', function(val) {
        //   filterPayments();
        // })


        $scope.$watch('dateFilter', function(val) {
          $scope.resetAllFilters();
          $scope.data = $scope.returnData();
          $scope.myPagingFunction($scope.data);

        }, true);

        $scope.resetAllFilters = function() {
          $scope.dateFilter = {startDate: null, endDate: null};
          $scope.stopReqeust = false;
          $scope.filteredPayments = [];
          $scope.payments = [];
          $scope.offset = $scope.limitValue;
        };


        $scope.resetFilter = function() {
          $scope.wasFilterReset = true;
        };

        $scope.$watch('filterCompany', function(value, oldVal) {
          console.log(value, 'value');
          $scope.companyFilterName = value;
          $scope.resetAllFilters();
          $scope.data = $scope.returnData();
          if(value) { $scope.myPagingFunction($scope.data)}
        });

        $scope.returnData = function() {
          return ({
            limit: $scope.limitValue,
            offset: $scope.offset,
            startDate: $scope.dateFilter.startDate ? new Date($scope.dateFilter.startDate).getTime() : null,
            endDate: $scope.dateFilter.endDate ? new Date($scope.dateFilter.endDate).getTime() : null,
            companyName : $scope.companyFilterName ? $scope.companyFilterName : null,
            status: $scope.sortByValue ? $scope.sortByValue.toUpperCase() : null
          })
        }

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

        function filterPayments() {

          $scope.wasFilterReset = false;

          if (!$scope.payments) return;
          $scope.filteredPayments = $scope.payments.filter(function(el) {
            var date = moment(el.createdAt);
            var result = true;

            if ($scope.dateFilter.startDate && $scope.dateFilter.endDate) {
              result = result && date >= $scope.dateFilter.startDate && date <= $scope.dateFilter.endDate;
            }

            if ($scope.filterCompany && $scope.filterCompany !== '' && $scope.filterCompany !== ' ') {
              result = result && ((el.invoiceNumbers && el.invoiceNumbers.findIndex(function(el) { return el.includes($scope.filterCompany) }) > -1) || (el.partialPaidInvoice && el.partialPaidInvoice.indexOf($scope.filterCompany) > -1) || el.clientCompanyName.indexOf($scope.filterCompany) > -1)
            }

            if ($scope.sortByValue) {
              if ($scope.sortByValue === 'refund') {
                result = result && el.refundMethod;
              } else {
                result = result && !el.refundMethod;
              }
            }

            return result;
          });

          $scope.filteredPayments.map(function(item) {
            $scope.showTooltipArray.push(false);
          });
        }

        $scope.showTooltip = function(event, index, type) {
          event.stopPropagation();
          return type ? $scope.showTooltipArray[index] = true : $scope.showTooltipArray[index] = !$scope.showTooltipArray[index];
        };

        $scope.hideAllTooltiip = function(event) {
          event.preventDefault();
          $scope.showTooltipArray = [];
          $scope.filteredPayments.map(function(item) {
            return $scope.showTooltipArray.push(false);
          });
        };


        PaymentsService.getPaymentsData($scope.data, $scope, function(res) {

          $scope.payments = res;
          $scope.filteredPayments = res;
          $scope.filteredPayments.map(function(item) {
            return $scope.showTooltipArray.push(false);
          });

          $scope.companies = $scope.filteredPayments.reduce(function(acc, el) {
            if (acc.indexOf(el.clientCompanyName) === -1) {
              acc.push(el.clientCompanyName);
            }

            return acc;
          }, []);

        });
      }]);

}());
