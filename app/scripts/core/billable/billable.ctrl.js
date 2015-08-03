'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService',
      function ($scope, BillableService) {

        $scope.ticketsSelection = {};

        $scope.totalBilledAmount = BillableService.getTotalBilledAmount($scope);

        $scope.billableChartData = BillableService.getBillableChartData($scope, function () {
          $scope.$watch('billableChartData', function () {
            $scope.billedAmountLast30Days = 0;
            for (var i = 0; i < $scope.billableChartData.length; i++) {
              $scope.billedAmountLast30Days += $scope.billableChartData[i].sum;
            }
          });
        });

        $scope.billableCompanies = BillableService.getBillableCompanies($scope, function () {
          $scope.$watch('billableCompanies', function () {
            $scope.totalbillables = 0;
            for (var i = 0; i < $scope.billableCompanies.length; i++) {
              $scope.totalbillables += $scope.billableCompanies[i].total;
            }
          })
        });

        $scope.changeCompanyCheckbox = function (companyId) {

          var ticketsSelection = $scope.ticketsSelection[companyId];

          if (ticketsSelection.tickets !== undefined) {
            for (var ticketId in ticketsSelection.tickets) {
              ticketsSelection.tickets[ticketId] = ticketsSelection.checked;
            }
          }

        };

        $scope.changeTicketCheckbox = function (billabledCompany) {

          var countObj = 0,
            ticketsSelectionCompany = $scope.ticketsSelection[billabledCompany.company.id];

          for (var ticketId in (ticketsSelectionCompany.tickets)) {
            if (ticketsSelectionCompany.tickets[ticketId]) {
              countObj++;
            }
          }

          ticketsSelectionCompany.checked = (billabledCompany.ticketsCount === countObj);
        };

        $scope.createInvoice = function () {
          console.log('create invoice');
        };

      }]);

}());
