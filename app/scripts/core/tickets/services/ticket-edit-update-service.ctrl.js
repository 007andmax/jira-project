'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateServiceCtrl',
      ['$scope', 'TicketsService', 'ServicesService', 'quicktech.common.services.UserNotificationService',
        function ($scope, TicketsService, ServicesService, UserNotificationService) {

          $scope.editService = $scope.service.staticCopy();
          $scope.editService.quantity = $scope.service.quantity * 60;
          $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.saveUpdateService = function (form) {

            if (form.$valid) {

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                serviceExpense: {

                  id: $scope.editService.id,
                  item: {versionedId: {id: $scope.editService.item.versionedId.id}},
                  description: $scope.editService.description,
                  quantity: $scope.editService.quantity / 60,
                  date: $scope.editService.date

                }
              }, function () {
                UserNotificationService.show('The ticket update containing a service has been modified', true);
                $scope.setEditExpenseId();
              })
            } else {
              $scope.triedToSaveService = true;
            }
          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && !form[fieldName].$valid;
          };


        }]);
  }()
);
