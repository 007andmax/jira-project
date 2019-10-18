'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.time-picker.userListCtrl',
        ['$scope', '$rootScope', 'CompaniesService', function ($scope, $rootScope, CompaniesService) {
            $scope.openInDate = false;
            $scope.openOutDate = false;
            $scope.hours = [];
            $scope.minutes = [];
            $scope.inDate = { hour: 12, minute: 00, type: "am" };
            $scope.outDate = { hour: 12, minute: 00, type: "am" };
            $scope.inDateText = "12:00 am";
            $scope.outDateText = "12:00 am";
            $scope.selectedIndexInDate = null;
            $scope.selectedIndexOutDate = null;
            $scope.serviceExpenseDurationPresentation = CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation ?
                CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation
                : 'DURATION_PICKER';
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
            $rootScope.$on('onChangeDuration', function () {
                console.log('onChangeDuration');
            
                setQuantity();
            });
            function onInitTimeIn() {
                var date = new Date();
                var hour = date.getHours();
                $scope.inDate.hour = (hour >= 13) ? hour - 12 : hour;
                $scope.inDate.minute = date.getMinutes();
                $scope.inDate.type = (hour >= 12) ? "pm" : "am";

                resetTextInDate();

            }
            function onInitTimeOut() {
                var date = new Date();
                var hour = date.getHours();
                $scope.outDate.hour = (hour >= 13) ? hour - 12 : hour;
                $scope.outDate.minute = date.getMinutes();
                $scope.outDate.type = (hour >= 12) ? "pm" : "am";

                resetTextOutDate();

            }
            onInitTimeIn();
            onInitTimeOut();
            $scope.toggleOutDateDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openOutDate = !$scope.openOutDate;
            }
            $scope.toggleInDateDropdown = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openInDate = !$scope.openInDate;
            }
            function parseEditQuantity() {
                console.log('editService', $scope.editService);
                /*     var timeInMinutes = $scope.editService.quantity * 60,
                     hours = Math.floor(timeInMinutes / 60),
                     minutes = Math.round(timeInMinutes - (hours * 60));
                     $scope.selectedHour = hours;
                     $scope.selectedMinute = minutes;*/
                var durationStart = $scope.editService.durationStart;
                var durationEnd = $scope.editService.durationEnd;
                $scope.inDate = { hour: durationStart.hour, minute: durationStart.minute, type: durationStart.time.toLowerCase() };
                $scope.outDate = { hour: durationEnd.hour, minute: durationEnd.minute, type: durationEnd.time.toLowerCase() };
                resetTextInDate();
                resetTextOutDate();

            }
            if ($scope.editService) parseEditQuantity();
            $scope.timePickerInterval = setTimePickerInterval();
            function setQuantity() {
                if ($scope.editService && $scope.editService.quantity && $scope.serviceExpenseDurationPresentation === 'DURATION_PICKER') {
                    // $scope.editService.quantity = $scope.quantity;
                    var quantityInTime = $scope.inDate.hour + (($scope.inDate.minute) ? ($scope.inDate.minute / 60) : 0);
                    quantityInTime += $scope.editService.quantity;

                    var timeInMinutes = quantityInTime * 60,
                        hours = Math.floor(timeInMinutes / 60),
                        minutes = Math.round(timeInMinutes - (hours * 60));
                    $scope.outDate = { hour: (hours >= 13) ? hours - 12 : hours, minute: minutes, type: (hours >= 12) ? "pm" : "am" };

                    resetTextOutDate();
                }
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
                var newHoursEnd = $scope.outDate.type === 'pm' && $scope.outDate.hour !== 12 ?
                    +$scope.outDate.hour + 12 : $scope.outDate.hour;
                if ($scope.outDate.type === 'am' && $scope.outDate.hour == 12) {
                    newHoursEnd = 0;
                }
                var newMinutesEnd = $scope.outDate.minute;

                var outHour = newHoursEnd - newHours;
                outHour = (outHour < 0) ? outHour + 24 : outHour;
                var outMinute = newMinutesEnd - newMinutes;
                outMinute = (outMinute < 0) ? outMinute + 60 : outMinute;

                $scope.quantity = outHour + ((outMinute) ? (outMinute / 60) : 0);
                if ($scope.editService && $scope.editService.quantity && $scope.serviceExpenseDurationPresentation !== 'DURATION_PICKER') $scope.editService.quantity = $scope.quantity;


                //   console.log('$scope.editService.quantity',$scope.editService.quantity);
                if ($scope.editService || $scope.serviceExpense) {
                    var newTimeStart = new Date();
                    newHours = newHours > 24 ? newHours - 24 : newHours;
                    newTimeStart.setHours(newHours);
                    newTimeStart.setMinutes(newMinutes);

                    var newTimeEnd = new Date();
                    newTimeEnd.setHours(newHoursEnd);
                    newTimeEnd.setMinutes(newMinutesEnd);
                    if ($scope.serviceExpense) {
                        $rootScope.saveStartDate = new Date(newTimeStart.getTime());
                        $rootScope.saveEndDate = new Date(newTimeEnd.getTime());
                    }
                    if ($scope.editService) {
                        $rootScope.saveForStartDate = new Date(newTimeStart.getTime());
                        $rootScope.saveForEndDate = new Date(newTimeEnd.getTime());
                        $scope.resetDurationWhenTimePicker();

                    }
                    /*  if ($scope.editService && $scope.serviceExpenseDurationPresentation === 'DURATION_PICKER')
                      {
                          newTimeEnd.setHours(newHoursEnd);
                          newTimeEnd.setMinutes(newMinutesEnd);
                          $rootScope.saveForStartDate = new Date(newTimeStart.getTime());
                          $rootScope.saveForEndDate = new Date(newTimeEnd.getTime());
                        //  $scope.resetDurationWhenTimePicker();
                         
                      }*/

                    console.log(' $rootScope.saveStartDate', $rootScope.saveStartDate);
                    console.log(' $rootScope.saveEndDate', $rootScope.saveEndDate);
                }
                /* if ($scope.serviceExpense) {
                     $scope.serviceExpense.quantity = $scope.quantity;
                     $rootScope.saveStartDate = new Date();
                     $rootScope.saveEndDate = new Date($rootScope.saveStartDate.getTime() + $scope.quantity*3600000)
                 } */
                console.log('$scope.quantity', $scope.quantity)
            }
            function setSelectedIndexInDate() {
                var indexHour = $scope.hours.findIndex(hour => hour.value === $scope.inDate.hour && hour.type === $scope.inDate.type);
                var indexMinute = $scope.minutes.findIndex(minute => minute.value === $scope.inDate.minute);
                $scope.selectedIndexInDate = (indexHour > -1 && indexMinute > -1) ? (indexMinute + $scope.minutes.length * indexHour) : null;
            }
            function setSelectedIndexOutDate() {
                var indexHour = $scope.hours.findIndex(hour => hour.value === $scope.outDate.hour && hour.type === $scope.outDate.type);
                var indexMinute = $scope.minutes.findIndex(minute => minute.value === $scope.outDate.minute);
                $scope.selectedIndexOutDate = (indexHour > -1 && indexMinute > -1) ? (indexMinute + $scope.minutes.length * indexHour) : null;
            }
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
            setSelectedIndexInDate();
            setSelectedIndexOutDate();
            console.log('scope.durations', $scope.durations);

            $scope.selectTimeIn = function (hour, minute) {
                $scope.inDate = { hour: hour.value, minute: minute.value, type: hour.type };
                //   $scope.outDate.duration.hour =  ($scope.inDate.hour -  $scope.outDate.hour);
                //   $scope.outDate.duration.minute =  ($scope.inDate.minute -  $scope.outDate.minute);
                console.log(' $scope.inDate', $scope.inDate);
                calculateDurations();
                console.log('scope.durations', $scope.durations);
                $scope.openInDate = !$scope.openInDate;
                resetTextInDate();
                setQuantity();
                setSelectedIndexInDate();
            }
            $scope.selectTimeOut = function (hour, minute) {
                $scope.outDate = { hour: hour.value, minute: minute.value, type: hour.type };
                $scope.openOutDate = !$scope.openOutDate;
                resetTextOutDate();
                setQuantity();
                setSelectedIndexOutDate();
            }
            function calculateDurations() {
                console.log('$scope.inDate', $scope.inDate);
                console.log('$scope.outDate', $scope.outDate);
                $scope.durations = [];
                for (var i = 0; i < $scope.hours.length; i++) {
                    for (var u = 0; u < $scope.minutes.length; u++) {
                        var newTimeStart = new Date();
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
                        newHours = newHours > 24 ? newHours - 24 : newHours;
                        newTimeStart.setHours(newHours);
                        newTimeStart.setMinutes(newMinutes);

                        var newTimeEnd = new Date();
                        var newHoursEnd = $scope.hours[i].type === 'pm' && $scope.hours[i].value !== 12 ?
                            +$scope.hours[i].value + 12 : $scope.hours[i].value;
                        if ($scope.hours[i].type === 'am' && $scope.hours[i].value == 12) {
                            newHoursEnd = 0;
                        }
                        var newMinutesEnd = $scope.minutes[u].value;
                        newTimeEnd.setHours(newHoursEnd);
                        newTimeEnd.setMinutes(newMinutesEnd);
                        var startMs = newTimeStart.getTime();
                        var endMs = newTimeEnd.getTime();
                        if (startMs - endMs > 0) endMs = endMs + 24 * 3600000;
                        var duration = (endMs - startMs) / 3600000 > 0 ? (endMs - startMs) / 3600000 : 0;
                        var timeInMinutes = duration * 60,
                            hours = Math.floor(timeInMinutes / 60),
                            minutes = Math.round(timeInMinutes - (hours * 60));
                        $scope.durations.push({ hour: hours, minute: minutes });


                    }
                }

            }
            /*  $scope.selectHour = function (hour) {
                  $scope.selectedHour = hour;
              }
              $scope.selectMinute = function (minute) {
                  $scope.selectedMinute = minute;
              }*/
            /*   $scope.setDuration = function () {
                   var hourText = (($scope.inDate.hour < 10) ? "0" + $scope.inDate.hour : $scope.inDate.hour);
                   var minuteText = (($scope.inDate.minute < 10) ? "0" + $scope.inDate.minute : $scope.inDate.minute);
                   $scope.dateText = hourText + ":" + minuteText;
   
                   $scope.quantity = $scope.inDate.hour + (($scope.inDate.minute) ? ($scope.inDate.minute / 60) : 0);
                   console.log('$$scope.quantity', $scope.quantity);
               }*/
            /*  $scope.onChangeHours = function () {
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
              }*/
            function resetTextInDate() {
                var hourText = (($scope.inDate.hour < 10) ? "0" + $scope.inDate.hour : $scope.inDate.hour);
                var minuteText = (($scope.inDate.minute < 10) ? "0" + $scope.inDate.minute : $scope.inDate.minute);
                $scope.inDateText = hourText + ":" + minuteText + " " + $scope.inDate.type;
            }
            $scope.onChangeInDateText = function () {
                if ($scope.inDateText.indexOf(":") === -1) {
                    resetTextInDate();
                    return;
                }
                var hour = parseInt($scope.inDateText.substring(0, $scope.inDateText.indexOf(":")));
                var minute = parseInt($scope.inDateText.substring($scope.inDateText.indexOf(":") + 1, $scope.inDateText.indexOf(":") + 3));
                if (isNaN(hour)) hour = 0;
                if (isNaN(minute)) minute = 0;
                $scope.inDate.hour = hour;
                $scope.inDate.minute = minute;
                calculateDurations();
                setQuantity();
            }
            function resetTextOutDate() {
                var hourText = (($scope.outDate.hour < 10) ? "0" + $scope.outDate.hour : $scope.outDate.hour);
                var minuteText = (($scope.outDate.minute < 10) ? "0" + $scope.outDate.minute : $scope.outDate.minute);
                $scope.outDateText = hourText + ":" + minuteText + " " + $scope.inDate.type;
            }
            $scope.onChangeOutDateText = function () {
                if ($scope.outDateText.indexOf(":") === -1) {
                    resetTextOutDate();
                    return;
                }
                var hour = parseInt($scope.outDateText.substring(0, $scope.outDateText.indexOf(":")));
                var minute = parseInt($scope.outDateText.substring($scope.outDateText.indexOf(":") + 1, $scope.outDateText.indexOf(":") + 3));
                if (isNaN(hour)) hour = 0;
                if (isNaN(minute)) minute = 0;
                $scope.outDate.hour = hour;
                $scope.outDate.minute = minute;
                setQuantity();
            }


        }]);



}());
