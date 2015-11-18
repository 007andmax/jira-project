'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateServiceCtrl',
      ['$scope', 'TicketsService', 'ServicesService', 'quicktech.common.services.UserNotificationService', '$filter',
        function ($scope, TicketsService, ServicesService, UserNotificationService, $filter) {

          $scope.editService = $scope.service.staticCopy();
          $scope.editService.quantity = $scope.service.quantity * 60;
          $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.editService.date = $filter('date')($scope.editService.date, 'd MMM yyyy');

          $scope.saveUpdateService = function (form) {

            if (form.$valid) {

              $scope.serviceIsSaving = true;

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                serviceExpense: {

                  id: $scope.editService.id,
                  item: {versionedId: {id: $scope.editService.item.versionedId.id}},
                  description: $scope.editService.description,
                  quantity: $scope.editService.quantity / 60,
                  date: new Date($scope.editService.date)

                }
              }, function () {
                UserNotificationService.show('The ticket update containing a service has been modified', true);
                $scope.setEditExpenseId();
                $scope.serviceIsSaving = false;
              })
            } else {
              $scope.triedToSaveService = true;
            }
          };

          $scope.isShowingErrors = function (form, fieldName) {
            return form[fieldName] && ($scope.triedToSaveService || form[fieldName].$dirty) && !form[fieldName].$valid;
          };

          $scope.setNewService = function (service) {
            $scope.editService.item = service.staticCopy()
          };

          $scope.validationMessage = function () {

            if (!$scope.editService.item.versionedId.id) {
              return 'Choose Service from dropdown or type full name'
            }

            if ($scope.updateTicketService.$valid) {
              return;
            }

            for (var errorKey in $scope.updateTicketService.$error) {
              if (errorKey === 'required') {
                return requiredMessage($scope.updateTicketService.$error[errorKey][0].$name);
              } else if (errorKey === 'minlength') {
                return minlengthMessage($scope.updateTicketService.$error[errorKey][0].$name);
              } else if (errorKey === 'maxlength') {
                return maxlengthMessage($scope.updateTicketService.$error[errorKey][0].$name);
              }
            }
          };

          function requiredMessage(fildName) {
            if (fildName === 'serviceTime') {
              return 'Service time is required.'
            } else if (fildName === 'serviceDescription') {
              return 'Service Description is required.'
            } else if (fildName === 'serviceData') {
              return 'Date is required.'
            }
          }

          function maxlengthMessage(fildName) {
            if (fildName === 'serviceTime') {
              return 'Service time is too large.'
            } else if (fildName === 'serviceDescription') {
              return 'Service Description is too large.'
            }
          }

          function minlengthMessage(fildName) {
            if (fildName === 'serviceDescription') {
              return 'Service Description is too short.'
            }
          }

          $scope.$watch('editService.item.name', function () {
            for (var i = 0; i < $scope.companyServices.length; i++) {
              if ($scope.editService.item.name.toLowerCase() === $scope.companyServices[i].name.toLowerCase()) {
                $scope.editService.item = $scope.companyServices[i].staticCopy();
                return;
              } else {
                $scope.editService.item.versionedId.id = undefined;
              }
            }
          })

        }]);
  }()
);
