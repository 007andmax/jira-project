'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      function ($scope, BillableService, CompaniesService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('billableClientsHeader');

        $scope.ticketsSelection = {};

        $scope.lockedTicketIds = BillableService.getLockedTicketIds($scope);

        $scope.totalBilledAmount = BillableService.getTotalBilledAmount($scope);

        $scope.billableChartDataAA = BillableService.getBillableChartData($scope, function () {

          $scope.billableChartData = [{"id":null,"date":"2015-10-28","sum":95079.33},{"id":null,"date":"2015-10-29","sum":79657.35},{"id":null,"date":"2015-10-30","sum":35999.01},{"id":null,"date":"2015-10-31","sum":37930.05},{"id":null,"date":"2015-11-01","sum":88056.79},{"id":null,"date":"2015-11-02","sum":37017.88},{"id":null,"date":"2015-11-03","sum":34971.88},{"id":null,"date":"2015-11-04","sum":51563.73},{"id":null,"date":"2015-11-05","sum":55506.28},{"id":null,"date":"2015-11-06","sum":18984.4},{"id":null,"date":1446854400000,"sum":0},{"id":null,"date":1446940800000,"sum":0},{"id":null,"date":1447027200000,"sum":0}]

          if ($scope.billableChartData.length < 30) {
            var quantityMissingDays = 30 - $scope.billableChartData.length;

            for (var j = 0; j < quantityMissingDays; j++) {
              $scope.billableChartData.unshift({
                sum: undefined,
                date: getOneDateAgo($scope.billableChartData[0].date)
              })
            }
          }

          $scope.$watch('billableChartData', function () {
            $scope.billedAmountLast30Days = 0;
            for (var i = 0; i < $scope.billableChartData.length; i++) {
              $scope.billedAmountLast30Days += $scope.billableChartData[i].sum || 0;
            }
          });

          function getOneDateAgo(dateString) {
            var date = new Date(dateString)
            var dateCopy = new Date(dateString);

            dateCopy.setDate(date.getDate() - 1);
            return dateCopy;
          }
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
