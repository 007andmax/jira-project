'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.billableCtrl',
    ['$scope', 'BillableService', 'CompaniesService', 'quicktech.common.services.SharedStateService',
      function ($scope, BillableService, CompaniesService, SharedStateService) {

        var headerSharedState = SharedStateService.getSharedState('billableClientsHeader');

        $scope.loadingInProgress = true;
        $scope.ticketsSelection = {};

        $scope.totalBilledAmount = BillableService.getTotalBilledAmount($scope);

        $scope.billableData = BillableService.getBillablePageDto($scope, function (respData) {

          $scope.billableData = respData;

          var companies = [];
          $scope.totalbillables = 0;

          for (var companyId in $scope.billableData) {

            var company = CompaniesService.getOneById(companyId);
            $scope.totalbillables += $scope.billableData[companyId].totalSum || 0;

            companies.push(company);
          }

          headerSharedState.companies = companies;

          for (var companyId in $scope.ticketsSelection) {

            if(!$scope.billableData[companyId]){
              delete $scope.ticketsSelection[companyId];
              continue;
            }

            var tickets = $scope.ticketsSelection[companyId].tickets;

            for (var ticketId in  tickets) {

              for (var i = 0; i < $scope.billableData[companyId].tickets.length; i++) {
                if (ticketId === $scope.billableData[companyId].tickets[i].id) {
                  if ($scope.billableData[companyId].tickets[i].lockedBy) {
                    tickets[ticketId] = false;
                    $scope.ticketsSelection[companyId].checked = false;
                  }
                }
              }

            }
          }
        });

        $scope.loadingFinished = function () {
          $scope.loadingInProgress = false;
        };

        $scope.billableChartData = BillableService.getBillableChartData($scope, function () {

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
            var date = new Date(dateString);
            var dateCopy = new Date(dateString);

            dateCopy.setDate(date.getDate() - 1);
            return dateCopy;
          }
        });

        $scope.changeCompanyCheckbox = function (companyId) {

          var ticketsSelection = $scope.ticketsSelection[companyId];

          if (ticketsSelection.tickets !== undefined) {
            for (var ticketId in ticketsSelection.tickets) {

              var isticketLocked;

              for (var i = 0; i < $scope.billableData[companyId].tickets.length; i++) {
                if (ticketId === $scope.billableData[companyId].tickets[i].id) {
                  if ($scope.billableData[companyId].tickets[i].lockedBy) {
                    isticketLocked = true;
                  }
                  break;
                }
              }

              ticketsSelection.tickets[ticketId] = ticketsSelection.checked && !isticketLocked;
            }
          }

        };

        $scope.changeTicketCheckbox = function (companyId) {

          var countObj = 0,
            ticketsSelectionCompany = $scope.ticketsSelection[companyId];

          for (var ticketId in (ticketsSelectionCompany.tickets)) {
            if (ticketsSelectionCompany.tickets[ticketId]) {
              countObj++;
            }
          }

          ticketsSelectionCompany.checked = ($scope.billableData[companyId].tickets.length === countObj);
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

        $scope.$on('$destroy', function () {
          SharedStateService.clearState('billableClientsHeader');
        });

      }]);

}());
