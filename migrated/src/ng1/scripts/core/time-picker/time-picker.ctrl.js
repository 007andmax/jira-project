'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.time-picker.userListCtrl',
        ['$scope', '$rootScope', 'CompaniesService','$document', function ($scope, $rootScope, CompaniesService,$document) {
            $scope.openInDate = false;
            $scope.openOutDate = false;
            $scope.hoursInDate = [];
            $scope.hoursOutDate = [];
            $scope.minutes = [];
            $scope.inDate = { hour: 12, minute: 00, type: "am" };
            $scope.outDate = { hour: 12, minute: 00, type: "am" };
            $scope.inDateText = "12:00am";
            $scope.outDateText = "12:00am";
            $scope.selectedIndexInDate = {hour: null, minute: null};
            $scope.selectedIndexOutDate = {hour: null, minute: null};
          
            $scope.serviceExpenseDurationPresentation = CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation ?
                CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation
                : 'DURATION_PICKER';

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
            var parentNode = null;
            $rootScope.$on('onChangeDuration', function () {
                setQuantity();
            });
            function onInitDefaultValues() {

                $rootScope.saveStartDate = new Date().getTime();
                $rootScope.saveEndDate = new Date().getTime();

            }
            if ($scope.serviceExpense || $scope.isMobileUpdateShown) onInitDefaultValues();
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
                parentNode = $($event.target).parents('.start-end-picker');
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openOutDate = !$scope.openOutDate;
            }
            $scope.onToggleDropdownInDate = function ($event) {
               
                if ($scope.openInDate && parentNode.find(".time-picker-hours .active")) {
                    var curent_offset = parentNode.find(".time-picker-hours").scrollTop();
                    var active = parentNode.find(".time-picker-hours .active");
                    console.log('if (active.position().top >= 240)',active.position().top);
                    if (active.position().top >= 240 || active.position().top < 0) parentNode.find(".time-picker-hours").scrollTop(curent_offset + active.position().top);
                }

            }
            $scope.toggleInDateDropdown = function ($event) {
                 
                parentNode = $($event.target).parents('.start-end-picker');
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openInDate = !$scope.openInDate;

            }
            function parseEditQuantity() {
                console.log(' $scope.editService', $scope.editService);
                var durationStart = $scope.editService.durationStart;
                var durationEnd = $scope.editService.durationEnd;
                $scope.inDate = { hour: durationStart.hour, minute: durationStart.minute, type: durationStart.time.toLowerCase() };
                $scope.outDate = { hour: durationEnd.hour, minute: durationEnd.minute, type: durationEnd.time.toLowerCase() };
                resetTextInDate();
                resetTextOutDate();

            }
            if ($scope.editService) parseEditQuantity();
            $scope.timePickerInterval = setTimePickerInterval();
            function setQuantity(type = null) {
                if ($scope.editService && $scope.serviceExpenseDurationPresentation === 'DURATION_PICKER' ||$scope.editService &&  type === 'CHANGE_TIME_IN') {
                    var newTimeStart = new Date();
                    newTimeStart.setHours(($scope.inDate.type === 'pm' && $scope.inDate.hour != 12) ? $scope.inDate.hour + 12 : $scope.inDate.hour);
                    newTimeStart.setMinutes($scope.inDate.minute);

                    var newTimeEnd = new Date(newTimeStart.getTime() + $scope.editService.quantity * 3600000);

                    $scope.outDate = { hour: (newTimeEnd.getHours() >= 13) ? newTimeEnd.getHours() - 12 : newTimeEnd.getHours(), minute: newTimeEnd.getMinutes(), type: (newTimeEnd.getHours() >= 12) ? "pm" : "am" };

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
                var newTimeStart = new Date();
                newHours = newHours > 24 ? newHours - 24 : newHours;
                newTimeStart.setHours(newHours);
                newTimeStart.setMinutes(newMinutes);

                var newTimeEnd = new Date();
                newTimeEnd.setHours(newHoursEnd);
                newTimeEnd.setMinutes(newMinutesEnd);
                var startMs = newTimeStart.getTime();
                var endMs = newTimeEnd.getTime();
                if (startMs - endMs > 0) endMs = endMs + 24 * 3600000;
                $scope.quantity = (endMs - startMs) / 3600000 > 0 ? (endMs - startMs) / 3600000 : 0;

                if ($scope.editService && $scope.serviceExpenseDurationPresentation !== 'DURATION_PICKER') $scope.editService.quantity = $scope.quantity;
                if ($scope.editService || $scope.serviceExpense || $scope.isMobileUpdateShown) {

                    if ($scope.serviceExpense || $scope.isMobileUpdateShown) {
                        $rootScope.saveStartDate = new Date(newTimeStart.getTime());
                        $rootScope.saveEndDate = new Date(endMs);
                        console.log('$rootScope.saveEndDate',$rootScope.saveEndDate);
                    }
                    if ($scope.editService) {
                        $rootScope.saveForStartDate = new Date(newTimeStart.getTime());
                        $rootScope.saveForEndDate = new Date(endMs);
                        $scope.resetDurationWhenTimePicker();
                        $rootScope.$broadcast('onResetDuration', $scope.quantity)
                    }
                }
            }
            function setSelectedIndexInDate() {
                var indexHour = $scope.hoursInDate.findIndex(hour => hour.value === $scope.inDate.hour && hour.type === $scope.inDate.type);
                var indexMinute = $scope.minutes.findIndex(minute => minute.value === $scope.inDate.minute);
                if (indexMinute === -1) indexMinute = getClosest($scope.minutes,$scope.inDate.minute).u;
                console.log('indexMinute',indexMinute);
                $scope.selectedIndexInDate = {hour: (indexHour > -1) ? $scope.hoursInDate[indexHour].value : null, minute: $scope.minutes[indexMinute].value};
            }
           
            function setSelectedIndexOutDate() {
                var indexHour = $scope.hoursOutDate.findIndex(hour => hour.value === $scope.outDate.hour && hour.type === $scope.outDate.type);
                var indexMinute = $scope.minutes.findIndex(minute => minute.value === $scope.outDate.minute);
                $scope.selectedIndexOutDate = (indexHour > -1 && indexMinute > -1) ? (indexMinute + $scope.minutes.length * indexHour) : null;
            }
            function oninitHousInDate() {
                $scope.hoursInDate.push({ value: 12, type: "am", text: "12", i: 0 });
                setHousInDate("am", 0, 1, 11);
                $scope.hoursInDate.push({ value: 12, type: "pm", text: "12", i: 12 })
                setHousInDate("pm", 12, 1, 11);
              

            }
            function getClosest(counts,goal) {
               return counts.reduce(function(prev, curr) {
                 
                    return (Math.abs(curr.value - goal) < Math.abs(prev.value - goal) ? curr : prev);
                  });
            }
            function setHousInDate(type, index, start, end) {
                let indexDuration = index;
                for (let i = start; i <= end; i++) {
                    $scope.hoursInDate.push({ value: i, type: type, text: (i < 10) ? "0" + i : i, i: indexDuration })
                    indexDuration++;

                }
            }
            function oninitHousOutDate() {
                if ($scope.inDate.hour === 12) {
                    $scope.hoursOutDate.push({ value: 12, type: $scope.inDate.type, text: "12", i: ($scope.inDate.type === "am") ? 0 : 12 });
                    setHousOutDate($scope.inDate.type, ($scope.inDate.type === "am") ? 0 : 12, 1, 11);
                    $scope.hoursOutDate.push({ value: 12, type: ($scope.inDate.type === "pm") ? "am" : "pm", text: "12", i: ($scope.inDate.type !== "am") ? 0 : 12 })
                    setHousOutDate(($scope.inDate.type === "pm") ? "am" : "pm", ($scope.inDate.type === "am") ? 0 : 12, 1, 11);
                } else {
                    setHousOutDate($scope.inDate.type, 0, $scope.inDate.hour, 11);
                    var type = ($scope.inDate.type === "pm") ? "am" : "pm";
                    $scope.hoursOutDate.push({ value: 12, type: type, text: "12", i: 12 - $scope.inDate.hour });
                    setHousOutDate(type, (type === "am") ? 0 : 12, 1, 11);
                    $scope.hoursOutDate.push({ value: 12, type: $scope.inDate.type, text: "12", i: ($scope.inDate.type === "am") ? 0 : 12 })
                    setHousOutDate($scope.inDate.type, ($scope.inDate.type === "am") ? 0 : 12, 1, $scope.inDate.hour);
                }

            }
            function setHousOutDate(type, index, start, end) {
                let indexDuration = index;
                for (let i = start; i <= end; i++) {
                    $scope.hoursOutDate.push({ value: i, type: type, text: (i < 10) ? "0" + i : i, i: indexDuration })
                    indexDuration++;

                }
            }
            oninitHousOutDate();
            oninitHousInDate();
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
            console.log('$scope.minutes', $scope.minutes);

            setSelectedIndexInDate();
            setSelectedIndexOutDate();

            $scope.selectTimeIn = function (hour, minute) {
                $scope.inDate = { hour: hour.value, minute: minute.value, type: hour.type };

                $scope.openInDate = !$scope.openInDate;
                $scope.hoursOutDate = [];
                oninitHousOutDate();
                resetTextInDate();
                setQuantity('CHANGE_TIME_IN');
                setSelectedIndexInDate();
            }
            $scope.selectTimeOut = function (hour, minute) {
                $scope.outDate = { hour: hour.value, minute: minute.value, type: hour.type };
                $scope.openOutDate = !$scope.openOutDate;
               
                resetTextOutDate();
                setQuantity();
                setSelectedIndexOutDate();
                console.log('$scope.outDate', $scope.outDate);
            }
            $scope.calculateDuration = function (hour, minute, type) {
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
                var newHoursEnd = type === 'pm' && hour !== 12 ?
                    +hour + 12 : hour;
                if (type === 'am' && hour == 12) {
                    newHoursEnd = 0;
                }

                var newMinutesEnd = minute;

                newTimeEnd.setHours(newHoursEnd);
                newTimeEnd.setMinutes(newMinutesEnd);


                var startMs = newTimeStart.getTime();
                var endMs = newTimeEnd.getTime();
                if (startMs - endMs > 0) endMs = endMs + 24 * 3600000;
                var duration = (endMs - startMs) / 3600000 > 0 ? (endMs - startMs) / 3600000 : 0;

                var timeInMinutes = duration * 60,
                    hours = Math.floor(timeInMinutes / 60),
                    minutes = Math.round(timeInMinutes - (hours * 60));
                return `${(hours < 10) ? "0" + hours : hours}h ${(minutes < 10) ? "0" + minutes : minutes}m`;
            }


            function resetTextInDate() {
                var hourText = (($scope.inDate.hour < 10) ? "0" + $scope.inDate.hour : $scope.inDate.hour);
                var minuteText = (($scope.inDate.minute < 10) ? "0" + $scope.inDate.minute : $scope.inDate.minute);
                $scope.inDateText = hourText + ":" + minuteText + "" + $scope.inDate.type;
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

                setQuantity('CHANGE_TIME_IN');
            }
            function resetTextOutDate() {
                var hourText = (($scope.outDate.hour < 10) ? "0" + $scope.outDate.hour : $scope.outDate.hour);
                var minuteText = (($scope.outDate.minute < 10) ? "0" + $scope.outDate.minute : $scope.outDate.minute);
                $scope.outDateText = hourText + ":" + minuteText + "" + $scope.outDate.type;
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
