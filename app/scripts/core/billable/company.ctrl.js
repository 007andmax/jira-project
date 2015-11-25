'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyCtrl',
    ['$scope', 'BillableService', 'CompaniesService', '$timeout', 'quicktech.common.services.SharedStateService',
      function ($scope, BillableService, CompaniesService, $timeout, SharedStateService) {

        $scope.company = CompaniesService.getOneById($scope.billableCompany.company.id);

        $scope.ifCompanyLocked = function(){
          //TODO get from service
          return false;
        };

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

        $scope.setHighlightTicketId = function (ticketId) {
          $scope.highlightProductId = ticketId;
        };

        $scope.$on($scope.company.id + '-showCompany', function (event, companyId) {
          $scope.$broadcast('showCompany-' + companyId);
        });

        $scope.$on($scope.company.id + '-showTicket', function (event, ticketId) {
          if (!$scope.showTickets) {
            $scope.toggleBillableTickets();
          }

          $scope.setHighlightTicketId(ticketId);
        });

      }]);

}());
