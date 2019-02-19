'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.tickets.ticketAddUpdateServiceCtrl',
      ['$scope', 'ServicesService',
        function ($scope, ServicesService) {

          //TimePicker start
          $scope.showTimePicker = false;
          $scope.startDate = null;
          $scope.endDate = null;
          refreshTime();
          $scope.currentDate = new Date();
          $scope.attachment = 'inline';
          $scope.bindHtml = 'true';


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
            console.log(1,now, then, $scope.startDate);
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
            $scope.saveStartDate = $scope.startDate;
            $scope.saveEndDate = $scope.endDate;
            $scope.showTimePicker = !$scope.showTimePicker;
          };

          $scope.cancelTime = function () {
            refreshTime();
            $scope.showTimePicker = !$scope.showTimePicker;
          };

          $scope.showTimePickerBlock = function () {
            $scope.showTimePicker = !$scope.showTimePicker;
          }


          function refreshTime() {
            $scope.currentDate = new Date();
            $scope.startDate = {
              hour: $scope.currentDate.getHours(),
              minute: $scope.currentDate.getMinutes()
            };
            $scope.endDate = {
              hour: $scope.currentDate.getHours(),
              minute: $scope.currentDate.getMinutes()
            };
            $scope.saveStartDate = {
              hour: $scope.currentDate.getHours(),
              minute: $scope.currentDate.getMinutes()
            };
            $scope.saveEndDate = {
              hour: $scope.currentDate.getHours(),
              minute: $scope.currentDate.getMinutes()
            };
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
                return;
              }
              // else {
              //   if ($scope.serviceExpense.item && $scope.serviceExpense.item.versionedId) {
              //     $scope.serviceExpense.item.versionedId.id = undefined;
              //   }
              // }

            }
          });

        }]);
  }()
);
