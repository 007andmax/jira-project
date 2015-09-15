'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams',
      function ($scope, TicketsService, CompaniesService, UsersService, $state) {

        $scope.user = UsersService.getOneById($scope.ticket.createdUser.id);
        $scope.company = CompaniesService.getOneById($scope.ticket.company.id);

        $scope.srefToDetails = function(event){
          if(!event.originalEvent.notOpenTicketDetails){
            $state.go('tickets.details', {ticketId: $scope.ticket.id});
          }
        };

        $scope.doNotExpandTicket = function(event){
          event.originalEvent.notOpenTicketDetails = true;
        }

      }]);

}());
