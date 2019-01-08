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
        $scope.openModal = function(modalType) {
          var template = '/html/scripts/core/billable/new-billable-modals/' + modalType + '.tpl.html';
          console.log("openModal")
          console.log(template, 'template')
          var modalInstance = $uibModal.open({
            templateUrl: template,
            animation: true,
            backdrop: true,
            controller: 'quicktech.core.billable.newModalsCtlr',
            windowClass: 'modal-receive-payment margin-top-modal-dialog',
            resolve: {

            }

          });

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


        $scope.$watch('dateFilter', function(val) {
          console.log(moment(val.startDate).format('ll'))

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
              result = result && ((el.invoiceNumbers && el.invoiceNumbers.indexOf($scope.filterCompany) > -1) || (el.partialPaidInvoice && el.partialPaidInvoice.indexOf($scope.filterCompany) > -1) || el.clientCompanyName.indexOf($scope.filterCompany) > -1)
            }

            return result;
          })
        }


        PaymentsService.getPaymentsData($scope, function(res) {

          console.log(res, 'RES')
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
