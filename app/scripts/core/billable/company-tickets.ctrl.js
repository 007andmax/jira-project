'use strict';

(function () {

  angular.module('quicktech.core.billable').controller('quicktech.core.billable.companyTicketsCtrl',
    ['$scope', 'BillableService', '$timeout', 'UsersService', 'Utils',
      function ($scope, BillableService, $timeout, UsersService, Utils) {

        $scope.$emit('toggleBillableTickets');

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

        function setTicketsCheckboxes() {

          var companyId = $scope.billableCompany.companyId,
            companyTicketSelection = $scope.ticketsSelection[$scope.billableCompany.companyId];

          //reset tickets selection
          if (companyTicketSelection) {
            companyTicketSelection.tickets = {};
          } else {
            companyTicketSelection = $scope.ticketsSelection[$scope.billableCompany.companyId] = {tickets: {}};
          }

          //fill in ticket selection
          for (var i = 0; i < $scope.billableCompany.tickets.length; i++) {

            var ticketId = $scope.billableCompany.tickets[i].id,
              ticketsData = $scope.billableData[companyId].tickets,
              ticketData = Utils.findById(ticketsData, ticketId);

            companyTicketSelection.tickets[ticketId] = !!companyTicketSelection.checked && !ticketData.lockedBy;
          }
        }

        $scope.disabledTicket = function (ticketId) {
          return $scope.lockedTicketIds.indexOf(ticketId) >= 0;
        };

        $scope.getTooltipName = function (userId) {
          var user = UsersService.getOneById(userId);
          return $scope.getUserName(user);
        };

        $scope.$watch('billableData[billableCompany.companyId].tickets.length', setTicketsCheckboxes)

      }]);

}());
