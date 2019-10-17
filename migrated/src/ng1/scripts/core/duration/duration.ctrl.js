'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.duration.userListCtrl',
        ['$scope', '$rootScope', 'CompaniesService', function ($scope, $rootScope, CompaniesService) {
         console.log('serviceExpense',$scope.serviceExpense);
           
            $scope.hours = [];
            $scope.minutes = [];
            $scope.interval = "";
            $scope.dateText = "00 : 00";
            //   $scope.hourText = "00";
            //   $scope.minuteText = "00";
            $scope.selectedHour = 0;
            $scope.selectedMinute = 0;
            $scope.status = {
                isopen: false
            };
            $scope.intervalsVariant = [
                {
                    name: 'Every 1 min',
                    value: 1,
                    valueForBack: 'ONE_MINUTE'
                },
                {
                    name: 'Every 5 mins',
                    value: 5,
                    valueForBack: 'FIVE_MINUTES'
                },
                {
                    name: 'Every 10 mins',
                    value: 10,
                    valueForBack: 'TEN_MINUTES'
                },
                {
                    name: 'Every 15 mins',
                    value: 15,
                    valueForBack: 'FIFTEEN_MINUTES'
                }
            ];
            $scope.timePickerInterval = setTimePickerInterval();
            function setHous() {
                for (let i = 1; i <= 24; i++) {
                    $scope.hours.push({value: i, selected: false});
                }
            }
            function parseEditQuantity () {
              
                var timeInMinutes = $scope.editService.quantity * 60,
                hours = Math.floor(timeInMinutes / 60),
                minutes = Math.round(timeInMinutes - (hours * 60));
                $scope.selectedHour = hours;
                $scope.selectedMinute = minutes;
               
            }
            if ($scope.editService && $scope.editService.quantity) parseEditQuantity();
            setHous();
            function setTimePickerInterval() {
                $scope.interval = CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval ?
                    CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval : 'ONE_MINUTE';
               
                return $scope.intervalsVariant.find(function (item) {
                    return item.valueForBack === $scope.interval;
                });

            }
          
         
            for (var step = 0; step < (60 / $scope.timePickerInterval.value); step++) {
                $scope.minutes.push({ value: step * $scope.timePickerInterval.value, selected: false });
            }
           
            $scope.selectHour = function (hour,index) {
                $scope.hours.forEach((element, i) => {
                    if (i == index) {
                        element.selected = true;
                    } else {
                        element.selected = false;
                    }

                });
                $scope.selectedHour = hour.value;
            }
            $scope.selectMinute = function (minute, index) {
                $scope.minutes.forEach((element, i) => {
                    if (i == index) {
                        element.selected = true;
                    } else {
                        element.selected = false;
                    }

                });
                $scope.selectedMinute = minute.value;
            }
            $scope.setDuration = function () {
                var hourText = (($scope.selectedHour < 10) ? "0" + $scope.selectedHour : $scope.selectedHour);
                var minuteText = (($scope.selectedMinute < 10) ? "0" + $scope.selectedMinute : $scope.selectedMinute);
                $scope.dateText = hourText + ":" + minuteText;
                //  $scope.preview = (($scope.selectedHour < 10) ? "0" + $scope.selectedHour : $scope.selectedHour) + ":" + (($scope.selectedMinute < 10) ? "0" + $scope.selectedMinute : $scope.selectedMinute);
                $scope.quantity = $scope.selectedHour + (($scope.selectedMinute) ? ($scope.selectedMinute / 60) : 0);
               
                if ($scope.editService && $scope.editService.quantity) $scope.editService.quantity = $scope.quantity;
              
                if ($scope.serviceExpense) {
                    $scope.serviceExpense.quantity = $scope.quantity;
                    $rootScope.saveStartDate = new Date();
                    $rootScope.saveEndDate = new Date($rootScope.saveStartDate.getTime() + $scope.quantity*3600000)
                } 
              //  console.log('editService.quantity',$scope.editService.quantity);
            }
            $scope.toggleDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };
            $scope.onInitSetDuration = function ($event) {
                $scope.toggleDropdown($event);
                $scope.setDuration();
              
            };
            $scope.onChangeText = function () {
                if ($scope.dateText.indexOf(":") === -1) {
                    $scope.setDuration();
                    return;
                }
                var hour = parseInt($scope.dateText.substring(0, $scope.dateText.indexOf(":")));
                var minute = parseInt($scope.dateText.substring($scope.dateText.indexOf(":") + 1, $scope.dateText.length));
                if (isNaN(hour))  hour = 0;
                if (isNaN(minute)) minute = 0;
              
                $scope.selectedHour = hour;
                $scope.selectedMinute = minute;
                //   $scope.quantity = $scope.selectedHour + (($scope.selectedMinute) ? ($scope.selectedMinute / 60) : 0);
                $scope.setDuration();
              
            }
            $scope.setDuration();


        }]);



}());
