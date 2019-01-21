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
        $scope.openModal = function(modalType, payment) {
          var template = '/html/scripts/core/billable/new-billable-modals/' + modalType + '.tpl.html';

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

        }


        $scope.parsePaymentMethod = function(method) {
          return method.split('_').map(function(el) {
            return el[0].toUpperCase() + el.slice(1).toLowerCase();
          }).join(' ');
        }


        $scope.dateFilterOptions = {
          'autoApply': true,
          "cancelClass": "btn-secondary",
          locale: {
            "format": 'D MMM YYYY'
          }
        };

        $scope.dateFilter = {startDate: null, endDate: null};


        $scope.clearDateFilter = function() {
          // console.log('clear')
          $scope.dateFilter = {startDate: null, endDate: null};
        };

        $scope.sortBy = function(criteria) {
          $scope.sortByValue = criteria;
        }

        $scope.sortByValue = '';

        $scope.$watch('sortByValue', function(val) {
          filterPayments();
        })


        $scope.$watch('dateFilter', function(val) {

          filterPayments();
        }, true);


        $scope.resetFilter = function() {
          $scope.wasFilterReset = true;
        }

        $scope.$watch('filterCompany', function(value, oldVal) {

          // setTimeout(function() {
          //   if ($scope.filterWasClicked) {
          //     $scope.filterWasClicked = false;
          //
          //     $scope.filterCompany = oldVal;
          //   } else {
          //     filterPayments();
          //   }
          // }, 100)
          if((value && value !== '' && value !== ' ') || $scope.wasFilterReset) {
            filterPayments();
          }

        })

        $scope.onFilterClick = function() {
          $scope.filterWasClicked = true;
        };

        $scope.onFilterPress = function(evt) {

          if (evt.keyCode == 8) {
            $scope.wasFilterReset = true;
          }
        }

        $scope.deletePayment = function(id) {
          PaymentsService.deletePayment(id, function(res) {
          })
        }






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
          })
        }


        PaymentsService.getPaymentsData($scope, function(res) {

          $scope.payments = res;
          $scope.filteredPayments = res;

          $scope.companies = $scope.filteredPayments.reduce(function(acc, el) {
            if (acc.indexOf(el.clientCompanyName) === -1) {
              acc.push(el.clientCompanyName);
            }

            return acc;
          }, [])


        });



        // $scope.$watch('filteredPayments', function(val) {
        //   if (val) {
        //
        //   }
        //
        // })





      }]);

}());
