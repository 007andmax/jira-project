'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateCtrl',
      ['$scope', 'TicketsService', 'UsersService',
        function ($scope, TicketsService, UsersService) {

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
            TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id);
          }

        }]);
  }()
);
