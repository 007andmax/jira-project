'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServiceCtrl',
      ['$scope', 'ServicesService', '$rootScope',
        function ($scope, ServicesService, $rootScope) {

          //TimePicker start
          $scope.showTimePicker = false;
          $scope.startDate = null;
          $scope.endDate = null;
          refreshTime();
          $scope.currentDate = new Date();
          $scope.attachment = 'inline';
          $scope.bindHtml = 'true';
          $scope.saveDateIsSet = false;

          $scope.serviceExpenseDurationPresentation = $rootScope.currentUser.serviceExpenseDurationPresentation ?
            $rootScope.currentUser.serviceExpenseDurationPresentation
            :'DURATION_PICKER';

          $scope.$on('hideTimepicker', function(event, data) {
            if (data) { $scope.showTimePicker = false };
          });
          $scope.$watch(function () {
            if ($scope.serviceExpense && $scope.serviceExpense.date != undefined) return $scope.serviceExpense.date;
          }, function (value) {
            if ($scope.serviceExpense && $scope.serviceExpense.date) {
         
              var date = new Date(value);
              var currentDate = new Date();
              if (date.getFullYear() <= currentDate.getFullYear() && date.getMonth() <= currentDate.getMonth() && date.getDate() <= currentDate.getDate())  {
           
              $rootScope.$broadcast('setBlockUpdateAndClosed', false);
              } else {
           
                $rootScope.$broadcast('setBlockUpdateAndClosed', true);
           
              }
            }
       
          });

          $scope.getMinutes = function () {
            var result = {};
            for (var i = 0; i < 60; i ++) {
              result[i] = i < 10 ? ('0' + i) : i;
            }
            return result;
          };

          // $scope.$watch('startDate.hour', function (newValue, oldValue) {
          //   var now = parseInt(newValue);
          //   var then = parseInt(oldValue);
          //   if (now > 9 && then < 9 || now < 3 && then > 9) {
          //     $scope.startDate.time = $scope.startDate.time === "AM" ? "PM" : "AM";
          //   }
          // });
          //
          // $scope.$watch('endDate.hour', function (newValue, oldValue) {
          //   var now = parseInt(newValue);
          //   var then = parseInt(oldValue);
          //   if (now > 9 && then < 9 || now < 3 && then > 9) {
          //     $scope.endDate.time = $scope.endDate.time === "AM" ? "PM" : "AM";
          //   }
          // });

          $scope.saveTime = function () {
            $scope.saveStartDate = $scope.startDate;
            $scope.saveEndDate = $scope.endDate;
            $rootScope.saveStartDate =  $scope.saveStartDate;
            $rootScope.saveEndDate =  $scope.saveEndDate;
            $scope.showTimePicker = !$scope.showTimePicker;
            $scope.saveDateIsSet = true;

            var newTimeStart = new Date();
            var newHours = $scope.saveStartDate;

            if ($scope.saveStartDate.time.toLowerCase() === 'pm' && $scope.saveStartDate.hour != 12) {
              newHours = +$scope.saveStartDate.hour + 12
            } else {
              newHours = +$scope.saveStartDate.hour;
            }
            if ($scope.saveStartDate.time.toLowerCase() === 'am' &&  $scope.saveStartDate.hour == 12) {
              newHours = 0;
            }
            var newMinutes = $rootScope.saveStartDate.minute;
            newHours = newHours > 24 ? newHours - 24 : newHours;
            newTimeStart.setHours(newHours);
            newTimeStart.setMinutes(newMinutes);



            var newTimeEnd = new Date();
            var newHoursEnd = $rootScope.saveEndDate.time.toLowerCase() === 'pm' && $rootScope.saveEndDate.hour !== 12?
              +$rootScope.saveEndDate.hour + 12 : $rootScope.saveEndDate.hour;
            if ($rootScope.saveEndDate.time.toLowerCase() === 'am' &&  $rootScope.saveEndDate.hour == 12) {
              newHoursEnd = 0;
            }
            var newMinutesEnd = $rootScope.saveEndDate.minute;
            newTimeEnd.setHours(newHoursEnd);
            newTimeEnd.setMinutes(newMinutesEnd);
            $rootScope.saveStartDate = new Date(newTimeStart.getTime());
            $rootScope.saveEndDate = new Date(newTimeEnd.getTime());

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
              $scope.startDate = {
                hour: $scope.currentDate.getHours() >= 13 ? $scope.currentDate.getHours() - 12 : $scope.currentDate.getHours(),
                minute: $scope.currentDate.getMinutes(),
                time:  $scope.currentDate.getHours() > 12 ? 'PM' : 'AM'
              };
              $scope.endDate = {
                hour: $scope.currentDate.getHours() >= 13 ? $scope.currentDate.getHours() - 12 : $scope.currentDate.getHours(),
                minute: $scope.currentDate.getMinutes(),
                time:  $scope.currentDate.getHours() >= 12 ? 'PM' : 'AM'
              };
              $scope.saveStartDate = {
                hour: $scope.currentDate.getHours() >= 13 ? $scope.currentDate.getHours() - 12 : $scope.currentDate.getHours(),
                minute: $scope.currentDate.getMinutes(),
                time:  $scope.currentDate.getHours() >= 12 ? 'PM' : 'AM'
              };
              $scope.saveEndDate = {
                hour: $scope.currentDate.getHours() >= 13 ? $scope.currentDate.getHours() - 12 : $scope.currentDate.getHours(),
                minute: $scope.currentDate.getMinutes(),
                time:  $scope.currentDate.getHours() >= 12 ? 'PM' : 'AM'
              };

              var newTimeStart = new Date();
              var newHours = $scope.saveStartDate;

              if ($scope.saveStartDate.time.toLowerCase() === 'pm' && $scope.saveStartDate.hour != 12) {
                newHours = +$scope.saveStartDate.hour + 12
              } else {
                newHours = +$scope.saveStartDate.hour;
              }
              if ($scope.saveStartDate.time.toLowerCase() === 'am' &&  $scope.saveStartDate.hour == 12) {
                newHours = 0;
              }
              var newMinutes = $scope.saveStartDate.minute;
              newHours = newHours > 24 ? newHours - 24 : newHours;
              newTimeStart.setHours(newHours);
              newTimeStart.setMinutes(newMinutes);



              var newTimeEnd = new Date();
              var newHoursEnd = $scope.saveEndDate.time.toLowerCase() === 'pm' && $scope.saveEndDate.hour !== 12?
                +$scope.saveEndDate.hour + 12 : $scope.saveEndDate.hour;
              if ($scope.saveEndDate.time.toLowerCase() === 'am' &&  $scope.saveEndDate.hour == 12) {
                newHoursEnd = 0;
              }
              var newMinutesEnd = $scope.saveEndDate.minute;
              newTimeEnd.setHours(newHoursEnd);
              newTimeEnd.setMinutes(newMinutesEnd);
              $rootScope.saveStartDate = new Date(newTimeStart.getTime());
              $rootScope.saveEndDate = new Date(newTimeEnd.getTime());
            }
          }

          //TimePicker end

          $scope.discountAmountMsxLength;
          $scope.maxServiceDate = new Date();

          if (window.innerWidth > 414 && $scope.serviceExpense) {
            $scope.serviceExpense.item = undefined;
          }

          $scope.setNewService = function (service) {
            $scope.serviceExpense.item = service.staticCopy()
          };

          $scope.removeService = function () {
            $scope.ticketUpdate.services.splice($scope.$index, 1);
            if($scope.ticketUpdate.services.length === 0) {
              $scope.addService();
            }
          };

          $scope.$watch('serviceExpense.item.name', function () {
            if(!$scope.serviceExpense || !$scope.serviceExpense.item || !$scope.serviceExpense.item.name){
              return;
            }
            for (var i = 0; i < $scope.serviceList.length; i++) {

              if(!$scope.serviceList[i].name){
                return;
              }

              if ($scope.serviceExpense.item.name.toLowerCase() === $scope.serviceList[i].name.toLowerCase()) {
                $scope.serviceExpense.item = angular.copy($scope.serviceList[i]);
                $scope.$emit('serviceExpenseItem', true);
                return;
              }
            }
          });

        }]);
  }()
);
