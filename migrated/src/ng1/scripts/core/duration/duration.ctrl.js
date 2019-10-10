'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.duration.userListCtrl',
        ['$scope', '$rootScope', 'CompaniesService', function ($scope, $rootScope, CompaniesService) {
            $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            $scope.selectedHour = 0;

            $scope.hourText = "00";
            $scope.minuteText = "00";
            $scope.selectedMinute = 0;
          
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
            function setTimePickerInterval() {
                var interval = CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval ?
                    CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval : 'ONE_MINUTE';
                return $scope.intervalsVariant.find(function (item) {
                    return item.valueForBack === interval;
                });
            }
            $scope.minutes = [];
            console.log($scope.timePickerInterval, '$$scope.timePickerInterval');
            for (var step = 0; step < (60 / $scope.timePickerInterval.value); step++) {
                $scope.minutes.push(step * $scope.timePickerInterval.value);
            }
            console.log($scope.minutes, '$$scope.minutes');
            $scope.selectHour = function (hour) {
                $scope.selectedHour = hour;
            }
            $scope.selectMinute = function (minute) {
                $scope.selectedMinute = minute;
            }
            $scope.setDuration = function () {
                $scope.hourText = (($scope.selectedHour < 10) ? "0" + $scope.selectedHour : $scope.selectedHour);
                $scope.minuteText = (($scope.selectedMinute < 10) ? "0" + $scope.selectedMinute : $scope.selectedMinute);
              //  $scope.preview = (($scope.selectedHour < 10) ? "0" + $scope.selectedHour : $scope.selectedHour) + ":" + (($scope.selectedMinute < 10) ? "0" + $scope.selectedMinute : $scope.selectedMinute);
                $scope.quantity = $scope.selectedHour + (($scope.selectedMinute) ? ($scope.selectedMinute / 60) : 0);
                console.log('$$scope.quantity', $scope.quantity);
            }
            $scope.onChangeHours = function () {
                var hour = Number($scope.hourText);
                console.log('hour instanceof', typeof hour);
                console.log('hour', hour);
                if (typeof hour == "number" && hour === NaN) {
                    hour = 0;
                    console.log('rgrgrgrgrg');
                }
                console.log('hour', hour);
                $scope.selectedHour = angular.copy(hour);
                $scope.setDuration();
            }
            $scope.onChangeMinutes = function () {
                var minute = Number($scope.minuteText);
                console.log('minute instanceof', typeof minute);
                console.log('minute', minute);
                if (typeof hour == "number" && minute === NaN) {
                    minute = 0;
                    console.log('rgrgrgrgrg');
                }
                console.log('minute', minute);
                $scope.selectedMinute = angular.copy(minute);
                $scope.setDuration();
            }
            $scope.setDuration();
         

        }]);



}());
