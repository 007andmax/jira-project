'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      function ($scope, BillableService, CompaniesService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('billableClientsHeader');

        $scope.ticketsSelection = {};

        $scope.lockedTicketIds = BillableService.getLockedTicketIds($scope);

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
          }, true)
        });

        $scope.changeCompanyCheckbox = function (companyId) {

          var ticketsSelection = $scope.ticketsSelection[companyId];

          if (ticketsSelection.tickets !== undefined) {
            for (var ticketId in ticketsSelection.tickets) {
              ticketsSelection.tickets[ticketId] = ticketsSelection.checked && !($scope.lockedTicketIds.indexOf(ticketId) >= 0);
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

        $scope.$watch('ticketsSelection', function () {
          $scope.countTicket = 0;
          for (var key in $scope.ticketsSelection) {
            if ($scope.ticketsSelection[key].checked) {
              $scope.countTicket++;
            } else {
              for (var id in $scope.ticketsSelection[key].tickets) {
                if ($scope.ticketsSelection[key].tickets[id]) {
                  $scope.countTicket++;
                }
              }
            }
          }
        }, true);

        $scope.$watch('lockedTicketIds', function () {

          for (var companyId in $scope.ticketsSelection) {

            var tickets = $scope.ticketsSelection[companyId].tickets;

            for (var ticketId in  tickets) {
              if (tickets[ticketId] && $scope.lockedTicketIds.indexOf(ticketId) > -1) {
                tickets[ticketId] = false;
              }
            }
          }
        }, true);

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('billableClientsHeader');
        });

      }]);

}());
