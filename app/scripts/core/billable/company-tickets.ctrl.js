'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyTicketsCtrl',
    ['$scope', 'BillableService', '$timeout', 'UsersService',
      function ($scope, BillableService, $timeout, UsersService) {

        $scope.$emit('toggleBillableTickets');

        var companyTicketSelection = $scope.ticketsSelection[$scope.billableCompany.companyId];

        if (companyTicketSelection !== undefined && companyTicketSelection.checked) {
          $scope.ticketsSelection[$scope.billableCompany.companyId].tickets = {};
          setTicketsCheckboxes(true);
        } else if (companyTicketSelection === undefined) {
          $scope.ticketsSelection[$scope.billableCompany.companyId] = {tickets: {}};
          setTicketsCheckboxes(false);
        }

        $scope.$watch('highlightProductId', function (idTicket) {
          if (idTicket) {

            $timeout(function () {
              $scope.$broadcast('showTicket-' + idTicket);
            }, 100);

            $timeout(function () {
              $scope.setHighlightTicketId();
            }, 3000)
          }
        });

        function setTicketsCheckboxes(val) {

          var companyId = $scope.billableCompany.companyId;

          $scope.ticketsSelection[companyId].tickets = {};

          for (var i = 0; i < $scope.billableCompany.tickets.length; i++) {
            var ticketId = $scope.billableCompany.tickets[i].id;

            var isticketLocked;

            for(var i = 0; i < $scope.billableData[companyId].tickets.length; i++){
              if(ticketId === $scope.billableData[companyId].tickets[i].id){
                if($scope.billableData[companyId].tickets[i].lockedBy){
                  isticketLocked = true;
                }
                break;
              }
            }

            $scope.ticketsSelection[companyId].tickets[ticketId] = val && !isticketLocked;
          }
        }

        $scope.disabledTicket = function (ticketId) {
          return $scope.lockedTicketIds.indexOf(ticketId) >= 0;
        };

        $scope.getTooltipName = function(userId){
          var user = UsersService.getOneById(userId);
          return $scope.getUserName(user);
        }

      }]);

}());
