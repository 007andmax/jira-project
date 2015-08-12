'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      function ($scope, BillableService, CompaniesService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('billableClientsHeader');

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
            var companies = [];
            $scope.totalbillables = 0;

            for (var i = 0; i < $scope.billableCompanies.length; i++) {

              var companyTotal = $scope.billableCompanies[i],
                company = CompaniesService.getOneById(companyTotal.company.id);

              $scope.totalbillables += companyTotal.total;
              companies.push(company);
            }

            headerSharedState.companies = companies;
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

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('billableClientsHeader');
        });

      }]);

}());
