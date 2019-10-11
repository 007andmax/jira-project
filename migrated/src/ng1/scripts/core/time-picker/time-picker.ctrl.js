'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.time-picker.userListCtrl',
        ['$scope', '$rootScope', 'CompaniesService', function ($scope, $rootScope, CompaniesService) {
            $scope.hours = [];
            $scope.minutes = [];
            $scope.inDate = { hour: "12", minute: "00", type: "am" };
            $scope.outDate = { hour: "12", minute: "00", type: "am" };
            $scope.durations = [];
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
            function oninitHous() {
                $scope.hours.push({ value: 12, type: "am", text: "12", i: 0 });

                setHous("am", 0);
                $scope.hours.push({ value: 12, type: "pm", text: "12", i: 12 })

                setHous("pm", 12);

            }
            function setHous(type, index) {
                for (let i = 1; i <= 11; i++) {
                    $scope.hours.push({ value: i, type: type, text: (i < 10) ? "0" + i : i, i: index + i })

                }
            }
            oninitHous();
            function setTimePickerInterval() {
                var interval = CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval ?
                    CompaniesService.getCurrentCompany().serviceExpenseDurationPickerInterval : 'ONE_MINUTE';
                return $scope.intervalsVariant.find(function (item) {
                    return item.valueForBack === interval;
                });
            }


            for (var step = 0; step < (60 / $scope.timePickerInterval.value); step++) {
                var minute = step * $scope.timePickerInterval.value;
                $scope.minutes.push({ value: minute, text: (minute < 10) ? "0" + minute : minute, u: step });
            }
            calculateDurations();
            console.log('scope.durations', $scope.durations);

            $scope.selectTimeIn = function (hour, minute) {
                $scope.inDate = { hour: hour.text, minute: minute.text, type: hour.type };
                //   $scope.outDate.duration.hour =  ($scope.inDate.hour -  $scope.outDate.hour);
                //   $scope.outDate.duration.minute =  ($scope.inDate.minute -  $scope.outDate.minute);
                console.log(' $scope.inDate', $scope.inDate);
                calculateDurations();
                console.log('scope.durations', $scope.durations);
                $scope.$apply();
            }
            $scope.selectTimeOut = function (hour, minute) {
                 $scope.outDate = { hour: hour.text, minute: minute.text, type: hour.type };
               
            }
            function calculateDurations() {
                $scope.durations = [];
                for (var i = 0; i < $scope.hours.length; i++) {
                    for (var u = 0; u < $scope.minutes.length; u++) {

                        var newHours = Number($scope.inDate.hour);
                        if ($scope.inDate.type === 'pm' && Number($scope.inDate.hour) != 12) {
                            newHours = +Number($scope.inDate.hour) + 12
                        } else {
                            newHours = +Number($scope.inDate.hour);
                        }
                        if ($scope.inDate.type === 'am' && Number($scope.inDate.hour) == 12) {
                            newHours = 0;
                        }
                        var newMinutes = Number($scope.inDate.minute);
                        var newHoursEnd = $scope.hours[i].type === 'pm' && $scope.hours[i].value !== 12 ?
                            +$scope.hours[i].value + 12 : $scope.hours[i].value;
                        if ($scope.hours[i].type === 'am' && $scope.hours[i].value == 12) {
                            newHoursEnd = 0;
                        }
                        var newMinutesEnd = $scope.minutes[u].value;

                        var outHour = newHoursEnd - newHours;
                        outHour = (outHour < 0) ? outHour + 24 : outHour;
                        var outMinute = newMinutesEnd - newMinutes;
                        outMinute = (outMinute < 0) ? outMinute + 60 : outMinute;
                        $scope.durations.push({ hour: outHour, minute: outMinute });
                    }
                }
            }
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
