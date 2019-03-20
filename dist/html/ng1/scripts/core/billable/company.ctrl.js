'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyCtrl',
    ['$scope', 'BillableService', 'CompaniesService', '$timeout',
      function ($scope, BillableService, CompaniesService, $timeout) {

        $scope.company = CompaniesService.getOneById($scope.billableCompany.companyId);

        $scope.toggleBillableTickets = function () {

          if ($scope.showTickets) {
            $scope.$broadcast('toggleBillableTickets');

            $timeout(function () {
              $scope.showTickets = false;
            }, 200);
          } else {
            $scope.showTickets = true;
          }
        };

        $scope.$watch('headerSharedState.filter.companyId', function (value) {
          if (value && !$scope.showTickets) {
            $scope.toggleBillableTickets();
          }
        });

        $scope.setHighlightTicketId = function (ticketId) {
          $scope.highlightProductId = ticketId;
        };

        $scope.$on($scope.billableCompany.companyId + '-showCompany', function (event) {
          $scope.$broadcast('showCompany-' + $scope.billableCompany.companyId);
          if (!$scope.showTickets) {
            $scope.toggleBillableTickets();
          }
        });

        $scope.$on($scope.billableCompany.companyId + '-showTicket', function (event, ticketId) {
          if (!$scope.showTickets) {
            $scope.toggleBillableTickets();
          }

          $scope.setHighlightTicketId(ticketId);
        });

      }]);

}());
