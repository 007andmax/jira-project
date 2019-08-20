'use strict';

(function () {

  angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketUpdateCtrl',
    ['$scope', 'TicketsService', 'UsersService', 'quicktech.common.services.UserConfirmationsService',
      'quicktech.common.services.UserNotificationService', '$sce', '$rootScope',
      function ($scope, TicketsService, UsersService, UserConfirmationsService, UserNotificationService, $sce, $rootScope) {

        $scope.user = UsersService.getOneById($scope.ticketUpdate.user.id);
        $scope.showModelUser = false;
        $scope.showModelDatePicker = false;
      // $scope.disabledFutureDatePicker = false;
        $scope.showModelEditUser = function () {
          $scope.showModelUser = true;
        }
        $scope.showModelEditDatePciker = function () {
          $scope.showModelDatePicker = true;
        }
        $scope.closedEditModel = function () {
          $scope.showModelUser = false;
          $scope.showModelDatePicker = false;
        }
        $scope.$on('userToAssignToTicket', function (evt, val) {
          console.log('userToAssignToTicket', val);
          if (val.type) {
            if (val.type == "product") {
              console.log('$scope', $scope.ticketUpdate.services);
              $scope.ticketUpdate.products.forEach(function (item) {
                if (item.id == val.id) {
                  item.user = val.data;
                  console.log('find');
                  $rootScope.$broadcast('onChangeProduct', { id: $scope.ticketUpdate.id, item: item });
                }
              })

            }
            if (val.type == "service") {
              console.log('$scope', $scope.ticketUpdate.services);
              $scope.ticketUpdate.services.forEach(function (item) {
                if (item.id == val.id) {
                  item.user = val.data;
                  console.log('find');
                  $rootScope.$broadcast('onChangeService', { id: $scope.ticketUpdate.id, item: item });
                }
              })

            }
          }

        })
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

        $scope.getUpdateNote = function () {
          return $sce.trustAsHtml($scope.ticketUpdate.note);
        };

        $scope.deleteUpdate = function () {


          switch ($scope.ticketUpdate.type) {

            case 'NOTE':
              var confirmMesage = 'The ticket update containing a note will become inaccessible. Continue with permanent deletion?',
                confirmButton = 'Delete',
                userPopUpMessage = 'The ticket update containing a note has been deleted';
              UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id, function () {
                  UserNotificationService.show(userPopUpMessage, true);

                  $rootScope.attachmentsToDelete = $scope.ticketUpdate.attachments;
                });
              });
              return;

            case 'SERVICE':
              var confirmMesage,
                userPopUpMessage,
                confirmButton = 'Delete';

              if ($scope.ticketUpdate.services.length === 1) {
                confirmMesage = 'The ticket update containing a service will become inaccessible. Continue with permanent deletion?';
                userPopUpMessage = 'The ticket update containing a service has been deleted';
              } else {
                confirmMesage = 'The ticket update containing ' + $scope.ticketUpdate.services.length + ' services will become inaccessible. Continue with permanent deletion?';
                userPopUpMessage = 'TThe ticket update containing ' + $scope.ticketUpdate.services.length + ' services has been deleted';
              }

              UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id, function () {
                  UserNotificationService.show(userPopUpMessage, true);
                });
              });
              return;

            case 'PRODUCT':
              var confirmMesage,
                userPopUpMessage,
                confirmButton = 'Delete';

              if ($scope.ticketUpdate.products.length === 1) {
                confirmMesage = 'The ticket update containing a product will become inaccessible. Continue with permanent deletion?';
                userPopUpMessage = 'The ticket update containing a product has been deleted';
              } else {
                confirmMesage = 'The ticket update containing ' + $scope.ticketUpdate.products.length + ' products will become inaccessible. Continue with permanent deletion?';
                userPopUpMessage = 'The ticket update containing ' + $scope.ticketUpdate.products.length + ' products has been deleted';
              }

              UserConfirmationsService.show(confirmMesage, confirmButton).then(function () {
                TicketsService.deleteTicketUpdate($scope.ticketDetails.id, $scope.ticketUpdate.id, function () {
                  UserNotificationService.show(userPopUpMessage, true);
                });
              });
              return;
          }
        };

      }]);
}()
);
