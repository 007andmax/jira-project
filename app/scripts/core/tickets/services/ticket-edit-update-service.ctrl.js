'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateServiceCtrl',
      ['$scope', 'TicketsService', 'ServicesService', 'quicktech.common.services.UserNotificationService', '$filter',
        function ($scope, TicketsService, ServicesService, UserNotificationService, $filter) {

          $scope.maxServiceDate = new Date();

          $scope.editService = $scope.service.staticCopy();
          $scope.editService.quantity = ($scope.service.quantity * 60).toFixed(0);
          $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.editService.date = $filter('date')($scope.editService.date, 'd MMM yyyy');

          $scope.saveUpdateService = function (form) {

            if (form.$valid) {
              var editVersionedId = $scope.editService.item.versionedId;
              var isServiceItemChange = $scope.service.item.versionedId.id != editVersionedId.id;
              var isDescriptionChange = $scope.service.description != $scope.editService.description;
              var isQuantityChange = ($scope.service.quantity * 60) != $scope.editService.quantity;
              var isDateChange = checkDateOnDifferent(new Date($scope.service.date), new Date($scope.editService.date));
              var isDescountAmountChange = $scope.service.discountAmount != $scope.editService.discountAmount;
              var isDiscountTypeChange = $scope.service.discountType != $scope.editService.discountType;

              if (!(isServiceItemChange || isDescriptionChange || isQuantityChange || isDateChange || isDescountAmountChange || isDiscountTypeChange)) {
                $scope.setEditExpenseId();
                return;
              }

              $scope.disabledSave = true;

              var serviceDate = new Date($scope.editService.date);

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                serviceExpense: {

                  id: $scope.editService.id,
                  item: { versionedId: { id: editVersionedId.id, version: editVersionedId.version } },
                  description: $scope.editService.description,
                  quantity: $scope.editService.quantity / 60,
                  date: new Date(serviceDate.getFullYear(), serviceDate.getMonth(), serviceDate.getDate()),
                  discountAmount: $scope.editService.discountAmount,
                  discountType: "PERCENT"

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

          $scope.setNewService = function (service) {
            $scope.editService.item = service.staticCopy()
          };

          $scope.validationMessage = function () {
            if (!$scope.editService.item.versionedId.id) {
              $scope.disabledSave = true;
              return 'Choose Service from dropdown or type full name'
            } else {
              $scope.disabledSave = false;
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
              } else if (errorKey === 'maxLengthWord') {
                return 'Words in description should not be more than 100 characters';
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

          function checkDateOnDifferent(date1, date2) {

            var fixDate1 = (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())).getTime();
            var fixDate2 = (new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())).getTime();

            return (fixDate1 != fixDate2);
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
