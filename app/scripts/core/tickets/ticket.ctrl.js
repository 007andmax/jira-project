'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketCtrl',
    ['$scope', 'TicketsService', 'CompaniesService', 'UsersService', '$state', '$stateParams', '$timeout',
      'quicktech.common.services.UserConfirmationsService', 'quicktech.common.services.UserNotificationService',
      'DevicesService', '$rootScope', 'AgreementsService',
      function ($scope, TicketsService, CompaniesService, UsersService, $state, $stateParams, $timeout,
                UserConfirmationsService, UserNotificationService, DevicesService, $rootScope, AgreementsService) {

        $scope.user = UsersService.getOneById($scope.ticket.createdUserId);
        $scope.getUserById = UsersService.getOneById;
        $scope.company = CompaniesService.getOneById($scope.ticket.companyId);

        $scope.$watch(function() {
          return $rootScope.changeTicketCompany;
        }, function(val) {
          if (val && val.id === $scope.ticket.id) {
            $scope.company = CompaniesService.getOneById(val.companyId);
          }
        })

        console.log($scope.ticket, 'SCOPETICKET')

        DevicesService.getAgentsByCompany($scope, $scope.company.id, function (resp) {
          $scope.agentList = resp;
        });

        $scope.getTicketStatus = function(ticket) {
          var status;
          if(ticket.assignedUserId === null) {
            status = 'unassigned';
          } else if(ticket.status === 'COMPLETED') {
            status = 'completed';
          } else if(ticket.status === 'IN_PROGRESS') {
            status = 'inProgress';
          } else if(ticket.status === 'ON_HOLD') {
            status = 'onHold';
          }
          return status;
        };

        $scope.changeTicketPriority = function (priority, dropdowns) {
          TicketsService.changePriority($scope.ticket.id, priority, function () {
            UserNotificationService.show('The ticket “' + $scope.ticket.number + '” priority has been changed to ' + priority, true);
          });
          dropdowns[$scope.ticket.id]['priority'] = false;
        };

        $scope.changeTicketStatus = function (status, dropdowns) {
          TicketsService.changeStatus($scope.ticket.id, status, function () {
            UserNotificationService.show('The ticket “' + $scope.ticket.number + '” status has been changed to "' + $scope.userReadable(status) + '"', true);
          });
          dropdowns[$scope.ticket.id]['status'] = false;
        };


      }]);

}());
