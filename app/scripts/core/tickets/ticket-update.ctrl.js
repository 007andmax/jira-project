'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateCtrl',
      ['$scope', 'TicketsService', 'UsersService', 'quicktech.common.services.UserConfirmationsService',
        function ($scope, TicketsService, UsersService, UserConfirmationsService) {

          $scope.user = UsersService.getOneById($scope.ticketUpdate.user.id);

          $scope.updateType = function () {

            switch ($scope.ticketUpdate.type) {

              case 'NOTE':
                return 'Note';

              case 'SERVICE':
                if ($scope.ticketUpdate.services.length > 1) {
                  return $scope.ticketUpdate.services.length + ' Services';
                } else {
                  return 'Service';
                }

              case 'PRODUCT':
                if ($scope.ticketUpdate.products.length > 1) {
                  return $scope.ticketUpdate.products.length + ' Products';
                } else {
                  return 'Product';
                }
            }
          };

          $scope.deleteUpdate = function () {


            switch ($scope.ticketUpdate.type) {

              case 'NOTE':
                var confirmMesage = 'The ticket update containing a note will become inaccessible. Continue with permanent deletion?',
                  confirmButton = 'Delete';
                UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                  TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id);
                });
                return;

              case 'SERVICE':
                var confirmMesage,
                  confirmButton = 'Delete';

                if ($scope.ticketUpdate.services.length === 1) {
                  confirmMesage = 'The ticket update containing a service will become inaccessible. Continue with permanent deletion?';
                } else {
                  confirmMesage = 'The ticket update containing ' + $scope.ticketUpdate.services.length + ' services will become inaccessible. Continue with permanent deletion?';
                }

                UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                  TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id);
                });
                return;

              case 'PRODUCT':
                var confirmMesage,
                  confirmButton = 'Delete';

                if ($scope.ticketUpdate.products.length === 1) {
                  confirmMesage = 'The ticket update containing a product will become inaccessible. Continue with permanent deletion?';
                } else {
                  confirmMesage = 'The ticket update containing ' + $scope.ticketUpdate.products.length + ' products will become inaccessible. Continue with permanent deletion?';
                }

                UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                  TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id);
                });
                return;
            }
          }

        }]);
  }()
);
