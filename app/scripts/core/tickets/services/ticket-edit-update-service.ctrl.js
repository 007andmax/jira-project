'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateServiceCtrl',
      ['$scope', 'TicketsService', 'ServicesService', 'quicktech.common.services.UserNotificationService', '$filter', '$rootScope',
        function ($scope, TicketsService, ServicesService, UserNotificationService, $filter, $rootScope) {

          $scope.maxServiceDate = new Date();

          $scope.editService = $scope.service.staticCopy();
          $scope.editService.quantity = ($scope.service.quantity * 60).toFixed(0);
          $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.editService.date = $filter('date')($scope.editService.date, 'd MMM yyyy');
          var editDateStart = new Date($scope.service.durationStart);
          var editDateEnd = new Date($scope.service.durationEnd);
          $scope.editService.durationStart = {
            hour: editDateStart.getHours() >= 13 ? editDateStart.getHours() - 13 : editDateStart.getHours(),
            minute: editDateStart.getMinutes(),
            time: editDateStart.getHours() >= 12 ? 'pm' : 'am'
          };
          $scope.editService.durationEnd = {
            hour: editDateEnd.getHours() >= 13 ? editDateEnd.getHours() - 13 : editDateEnd.getHours(),
            minute: editDateEnd.getMinutes(),
            time: editDateEnd.getHours() >= 12 ? 'pm' : 'am'
          };
          //TimePicker start
          $scope.showTimePicker = false;
          $scope.startDate = null;
          $scope.endDate = null;
          refreshTime();
          $scope.currentDate = new Date();
          $scope.attachment = 'inline';
          $scope.bindHtml = 'true';
          $scope.saveDateIsSet = false;

          $scope.serviceExpenseDurationPresentation = $rootScope.currentUser.serviceExpenseDurationPresentation;
          $rootScope.$watch('currentUser', function (val) {
            console.log(val, 'CurrentUser');
          });

          $scope.getMinutes = function () {
            var result = {};
            for (var i = 0; i < 60; i ++) {
              result[i] = i < 10 ? ('0' + i) : i;
            }
            return result;
          };

          $scope.$watch('startDate.hour', function (newValue, oldValue) {
            var now = parseInt(newValue);
            var then = parseInt(oldValue);
            if (now > 9 && then < 9 || now < 3 && then > 9) {
              $scope.startDate.time = $scope.startDate.time === "AM" ? "PM" : "AM";
            }
          });

          $scope.$watch('endDate.hour', function (newValue, oldValue) {
            var now = parseInt(newValue);
            var then = parseInt(oldValue);
            if (now > 9 && then < 9 || now < 3 && then > 9) {
              $scope.endDate.time = $scope.endDate.time === "AM" ? "PM" : "AM";
            }
          });

          $scope.saveTime = function () {
            $scope.saveStartDate = $scope.editService.durationStart;
            $scope.saveEndDate = $scope.editService.durationEnd;
            console.log($scope.saveStartDate, 'saveStartDate');
            $rootScope.saveStartDate =  $scope.saveStartDate;
            $rootScope.saveEndDate =  $scope.saveEndDate;
            $scope.showTimePicker = !$scope.showTimePicker;
            $scope.saveDateIsSet = true;
          };

          $scope.cancelTime = function () {
            refreshTime();
            $scope.showTimePicker = !$scope.showTimePicker;
          };

          $scope.showTimePickerBlock = function () {
            refreshTime();
            $scope.showTimePicker = !$scope.showTimePicker;
          };


          function refreshTime() {
            if (!$scope.saveDateIsSet) {
              $scope.currentDate = new Date();
              $scope.saveStartDate = {
                hour: $scope.editService.durationStart.hour >= 13 ? $scope.editService.durationStart.hour - 12 : $scope.editService.durationStart.hour,
                minute: $scope.editService.durationStart.minute,
                time:  $scope.editService.durationStart.time >= 12 ? 'pm' : 'am'
              };
              $scope.saveEndDate = {
                hour: $scope.editService.durationEnd.hour >= 13 ? $scope.editService.durationEnd.hour - 12 : $scope.editService.durationEnd.hour,
                minute: $scope.editService.durationEnd.minute,
                time:  $scope.editService.durationEnd.time >= 12 ? 'pm' : 'am'
              };
              $rootScope.saveStartDate =  $scope.saveStartDate;
              $rootScope.saveEndDate =  $scope.saveEndDate;

            }
          }

          //TimePicker end

          $scope.saveUpdateService = function (form) {
            console.log(form.$valid, 'form.$valid');
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

              var startDate = new Date();
              var endDate = new Date();
              startDate.setHours($scope.saveStartDate.hour);
              startDate.setMinutes($rootScope.saveStartDate.minute);
              endDate.setHours($rootScope.saveEndDate.hour);
              endDate.setMinutes($rootScope.saveEndDate.minute);
              if (
                ($scope.saveStartDate.time === 'PM' && $scope.saveEndDate.time === 'AM') ||
                ($scope.saveStartDate.time === 'AM' && $scope.saveEndDate.time === 'AM' && $scope.saveStartDate.hour > $scope.saveEndDate.hour) ||
                ($scope.saveStartDate.time === 'PM' && $scope.saveEndDate.time === 'PM' && $scope.saveStartDate.hour > $scope.saveEndDate.hour)
              ) {
                endDate.setDate(endDate.getDate() + 1);
              }

              console.log('123512351235');

              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                serviceExpense: {

                  id: $scope.editService.id,
                  item: { versionedId: { id: editVersionedId.id, version: editVersionedId.version } },
                  description: $scope.editService.description,
                  quantity: $scope.editService.quantity / 60,
                  date: new Date(serviceDate.getFullYear(), serviceDate.getMonth(), serviceDate.getDate()),
                  discountAmount: $scope.editService.discountAmount,
                  discountType: 'PERCENT',
                  durationStart: startDate.getTime(),
                  durationEnd: endDate.getTime()
                }
              }, function () {
                UserNotificationService.show('The ticket update containing a service has been modified', true);
                $scope.setEditExpenseId();
              })
              $scope.;
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
