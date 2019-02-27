'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketEditUpdateServiceCtrl',
      ['$scope', 'TicketsService', 'ServicesService', 'quicktech.common.services.UserNotificationService', '$filter', '$rootScope',
        function ($scope, TicketsService, ServicesService, UserNotificationService, $filter, $rootScope) {

          $scope.maxServiceDate = new Date();

          $scope.editService = $scope.service.staticCopy();
          $scope.c = {
            hour: ($scope.service.quantity).toFixed(0),
            minute: $scope.service.quantity%($scope.service.quantity).toFixed(0)
          };
          $scope.companyServices = ServicesService.getAllByCompany($scope, $scope.company.id);

          $scope.editService.date = $filter('date')($scope.editService.date, 'd MMM yyyy');
          console.log($scope.service, '$scope.service');
          var editDateStart = new Date($scope.service.durationStart);
          var editDateEnd = new Date($scope.service.durationEnd );
          $scope.editService.durationStart = {
            hour: editDateStart.getHours() >= 13 ? editDateStart.getHours() - 12 : editDateStart.getHours(),
            minute: editDateStart.getMinutes() > 9 ? editDateStart.getMinutes() : '0' + editDateStart.getMinutes(),
            time: editDateStart.getHours() >= 13 ? 'PM' : 'AM'
          };

          $scope.saveStartDate =  $scope.editService.durationStart;
          $scope.editService.durationEnd = {
            hour: editDateEnd.getHours() >= 13 ? editDateEnd.getHours() - 12 : editDateEnd.getHours(),
            minute: editDateEnd.getMinutes() > 9 ? editDateEnd.getMinutes() : '0' + editDateEnd.getMinutes(),
            time: editDateEnd.getHours() >= 13 ? 'PM' : 'AM'
          };
          $scope.saveEndDate =  $scope.editService.durationEnd;
          console.log($scope.editService.durationStart, '------');
          console.log($scope.saveEndDate, '------');
          //TimePicker start
          $scope.showTimePicker = false;
          $scope.startDate = null;
          $scope.endDate = null;
          refreshTime();
          $scope.currentDate = new Date();
          $scope.attachment = 'inline';
          $scope.bindHtml = 'true';
          $scope.saveDateIsSet = false;
          $scope.disableQuantityWatcher = false;

          $scope.serviceExpenseDurationPresentation = $rootScope.currentUser.serviceExpenseDurationPresentation ?
            $rootScope.currentUser.serviceExpenseDurationPresentation
            : 'DURATION_PICKER';

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

          $scope.getDecimalMinutes = function(value){
            return Math.round(value) > 10 ? Math.round(value) : '0' + Math.round(value)
          }

          $scope.$on('changeQuantity', function (event, newValue) {
            console.log(1, '1111');
            console.log(newValue);
            $rootScope.quantityEditTime = {};
            $scope.quantity = newValue;
            $rootScope.quantityEditTime.hour = Math.floor(newValue);
            $rootScope.quantityEditTime.minute = (newValue - Math.floor(newValue))*60;
              if ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour < 0) {
                $scope.editService.durationStart.time = $scope.editService.durationEnd.time === 'AM' ? 'PM' : 'AM' ;
              } else {
                $scope.editService.durationStart.time = $scope.editService.durationEnd.time;
              }

              if ($scope.editService.durationEnd.minute - $rootScope.quantityEditTime.minute <= 0) {
                alert(1);
                $scope.editService.durationStart.hour = ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour -1) > 0 ?
                  ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour -1)
                  : ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour -1) + 12;
                $scope.editService.durationStart.minute = 60 + ($scope.editService.durationEnd.minute - $rootScope.quantityEditTime.minute);
              } else if($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour < 24 &&  $scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour > 12 ) {
                alert(2);
                $scope.editService.durationStart.hour = (24 + $scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour);
                $scope.editService.durationStart.minute = $scope.editService.durationEnd.minute - $rootScope.quantityEditTime.minute;
              } else {
                alert(3);
                $scope.editService.durationStart.hour = ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour) > 0 ?
                  ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour)
                  : ($scope.editService.durationEnd.hour - $rootScope.quantityEditTime.hour) + 12;
                $scope.editService.durationStart.minute = $scope.editService.durationEnd.minute - $rootScope.quantityEditTime.minute;
              }

              $scope.saveStartDate = {
                hour: $scope.editService.durationStart.hour,
                minute: $scope.editService.durationStart.minute,
                time: $scope.editService.durationStart.time
              };

              $rootScope.saveStartDate = $scope.saveStartDate;
              $scope.editService.quantity = $scope.quantity.toFixed(2);

            $scope.disableQuantityWatcher = false;
          });

          $scope.saveTime = function () {
            $scope.saveStartDate = $scope.editService.durationStart;
            $scope.saveEndDate = $scope.editService.durationEnd;
            console.log($scope.editService.durationStart, '$scope.editService.durationStart;');
            $rootScope.saveStartDate =  $scope.saveStartDate;
            $rootScope.saveEndDate =  $scope.saveEndDate;
            $scope.showTimePicker = !$scope.showTimePicker;
            $scope.saveDateIsSet = true;

            console.log($scope.editService.durationStart, $scope.editService.durationEnd);

            var newTimeStart = new Date();
            var newHours = $scope.editService.durationStart.time === 'PM' ?
              +$scope.editService.durationStart.hour + 12 : $scope.editService.durationStart.hour;
            var newMinutes = $scope.editService.durationStart.minute;
            newHours = newHours > 24 ? newHours - 24 : newHours;
            newTimeStart.setHours(newHours);
            newTimeStart.setMinutes(newMinutes);

            var newTimeEnd = new Date();
            var newHoursEnd = $scope.editService.durationEnd.time === 'PM' ?
              +$scope.editService.durationEnd.hour + 12 : $scope.editService.durationEnd.hour;
            var newMinutesEnd = $scope.editService.durationEnd.minute;
            newTimeEnd.setHours(newHoursEnd);
            newTimeEnd.setMinutes(newMinutesEnd);
            console.log(newTimeEnd, newTimeStart);
            console.log(newHoursEnd);

            if (newHours == 12 &&  $scope.serviceExpenseDurationPresentation !== 'TIME_PICKER') {
              alert(1);
              $scope.editService.quantity = 12 - +(newTimeStart.getTime() - newTimeEnd.getTime())/3600000
            }else if (newHoursEnd > newHours) {
              alert(2);
              $scope.disableQuantityWatcher = true;
              $scope.editService.quantity = (newTimeEnd.getTime() - newTimeStart.getTime())/3600000
            } else {
              alert(3);
              $scope.disableQuantityWatcher = true;
              $scope.editService.quantity = (24*3600000 - (newTimeStart.getTime() - newTimeEnd.getTime()))/3600000
            }

            $scope.$broadcast('changeEditService', $scope.editService.quantity);

            $rootScope.quantityEditTime = $rootScope.quantityEditTime ? $rootScope.quantityEditTime : {};
            $rootScope.quantityEditTime.hour = Math.floor($scope.editService.quantity);
            $rootScope.quantityEditTime.minute = ($scope.editService.quantity - Math.floor($scope.editService.quantity)) *60;

            return $scope.editService.quantity;
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
                time:  $scope.editService.durationStart.time
              };
              $scope.saveEndDate = {
                hour: $scope.editService.durationEnd.hour >= 13 ? $scope.editService.durationEnd.hour - 12 : $scope.editService.durationEnd.hour,
                minute: $scope.editService.durationEnd.minute,
                time:  $scope.editService.durationEnd.time
              };
              $rootScope.saveStartDate =  $scope.saveStartDate;
              $rootScope.saveEndDate =  $scope.saveEndDate;
            }
            console.log($scope.saveStartDate , '$scope.saveStartDate');
          }

          //TimePicker end

          $scope.saveUpdateService = function (form) {
            $scope.disableQuantityWatcher = true;
            if (form.$valid) {
              console.log('111111');
              var editVersionedId = $scope.editService.item.versionedId;
              var isServiceItemChange = $scope.service.item.versionedId.id != editVersionedId.id;
              var isDescriptionChange = $scope.service.description != $scope.editService.description;
              var isQuantityChange = ($scope.service.quantity * 60) != $scope.editService.quantity;
              var isDateChange = checkDateOnDifferent(new Date($scope.service.date), new Date($scope.editService.date));
              var isDescountAmountChange = $scope.service.discountAmount != $scope.editService.discountAmount;
              var isDiscountTypeChange = $scope.service.discountType != $scope.editService.discountType;
              var isStartTimeChange = $scope.service.durationStart != $scope.editService.durationStart;
              var isEndTimeChange = $scope.service.isEndTimeChange != $scope.editService.isEndTimeChange;

              if (!(isServiceItemChange || isDescriptionChange || isQuantityChange || isDateChange || isDescountAmountChange || isDiscountTypeChange || isStartTimeChange || isEndTimeChange)) {
                console.log('22222');
                $scope.setEditExpenseId();
                return;
              }

              $scope.disabledSave = true;

              var serviceDate = new Date($scope.editService.date);

              var startDate = new Date();
              var endDate = new Date();
              console.log(startDate, 'startDate');
              console.log(endDate, 'startDate');
              // alert(startDate);
              // alert($rootScope.saveEndDate.hour);
              if ($scope.saveStartDate.time === 'PM')  {
                startDate.setHours(+($rootScope.saveStartDate.hour) +12)
              } else {
                startDate.setHours($rootScope.saveStartDate.hour)
              }
              // alert(startDate);
              // startDate.setHours($rootScope.saveStartDate.hour);
              startDate.setMinutes($rootScope.saveStartDate.minute);
              endDate.setHours($rootScope.saveEndDate.hour);

              if ($rootScope.saveEndDate.time === 'PM')  {
                endDate.setUTCHours($rootScope.saveEndDate.hour +12)
              } else {
                endDate.setHours($rootScope.saveEndDate.hour)
              }
              endDate.setMinutes($rootScope.saveEndDate.minute);
              // alert(startDate);
              // if (
              //   ($scope.saveStartDate.time === 'PM' && $scope.saveEndDate.time === 'AM') ||
              //   ($scope.saveStartDate.time === 'AM' && $scope.saveEndDate.time === 'AM' && $scope.saveStartDate.hour > $scope.saveEndDate.hour) ||
              //   ($scope.saveStartDate.time === 'PM' && $scope.saveEndDate.time === 'PM' && $scope.saveStartDate.hour > $scope.saveEndDate.hour)
              // ) {
              //   endDate.setDate(endDate.getDate() + 1);
              // }

              console.log($scope.quantity, '$scope.quantity');
              console.log(startDate, '$scope.quantity');
              console.log(endDate, '$scope.quantity');
              // $scope.editService.quantity = $scope.quantity;
              TicketsService.updateExpenseInTicketUpdate({

                ticketUpdateId: $scope.ticketUpdate.id,
                serviceExpense: {

                  id: $scope.editService.id,
                  item: { versionedId: { id: editVersionedId.id, version: editVersionedId.version } },
                  description: $scope.editService.description,
                  quantity: getQuantity(startDate, endDate),
                  date: new Date(serviceDate.getFullYear(), serviceDate.getMonth(), serviceDate.getDate()),
                  discountAmount: $scope.editService.discountAmount,
                  discountType: 'PERCENT',
                  durationStart: startDate.getTime(),
                  durationEnd: endDate.getTime()
                }
              }, function () {
                UserNotificationService.show('The ticket update containing a service has been modified', true);
                $scope.setEditExpenseId();
              });
              console.log(endDate, 'test');
              $scope.$emit('time', {
                id: $scope.editService.id,
                durationStart: startDate.getTime(),
                durationEnd: endDate.getTime(),
                quantity: (endDate.getTime() - startDate.getTime())/ 3600000
              })
            } else {
              $scope.triedToSaveService = true;
            }
          };


          function getQuantity(startDate, endDate) {
            if (startDate.getHours() == 12 && $scope.serviceExpenseDurationPresentation !== 'TIME_PICKER') {
              return (12 - +(+startDate.getTime() - +endDate.getTime())/3600000);
            } else if (+endDate.getTime() - +startDate.getTime() > 0) {
              return ((+endDate.getTime() - +startDate.getTime())/3600000);
            } else {
              return (24 - (+startDate.getTime() - +endDate.getTime())/3600000);
            }
          }

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
