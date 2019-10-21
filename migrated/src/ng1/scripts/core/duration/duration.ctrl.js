'use strict';

(function () {

    angular.module('quicktech.core.tickets').controller('quicktech.core.duration.userListCtrl',
        ['$scope', '$rootScope', 'CompaniesService', function ($scope, $rootScope, CompaniesService) {

            $scope.serviceExpenseDurationPresentation = CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation ?
                CompaniesService.getCurrentCompany().serviceExpenseDurationPresentation
                : 'DURATION_PICKER';
            $scope.hours = [];
            $scope.minutes = [];
            $scope.interval = "";
            $scope.dateText = "00 : 00";
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
            $rootScope.$on('onResetDuration', function (event, quantity) {

                if ($scope.selectedHour === 0 && $scope.selectedMinute === 0 && $scope.editService) {
                    $scope.editService.quantity = quantity;
                    parseEditQuantity();
                }
            });
            function onInitDefaultValues() {
                $rootScope.saveStartDate = new Date().getTime();
                $rootScope.saveEndDate = new Date().getTime();
            }
            if ($scope.serviceExpense) onInitDefaultValues();
            $scope.timePickerInterval = setTimePickerInterval();
            function setHous() {
                for (let i = 1; i <= 24; i++) {
                    $scope.hours.push({ value: i, selected: false });
                }
            }
            function parseEditQuantity() {
                var timeInMinutes = $scope.editService.quantity * 60,
                    hours = Math.floor(timeInMinutes / 60),
                    minutes = Math.round(timeInMinutes - (hours * 60));
                $scope.selectedHour = hours;
                $scope.selectedMinute = minutes;
                setDateText();
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
            $scope.selectHour = function (hour, index) {
                $scope.hours.forEach((element, i) => {
                    if (i == index) {
                        element.selected = true;
                    } else {
                        element.selected = false;
                    }

                });
              
            }
            $scope.selectMinute = function (minute, index) {
                $scope.minutes.forEach((element, i) => {
                    if (i == index) {
                        element.selected = true;
                    } else {
                        element.selected = false;
                    }

                });
            
            }
            function setDateText() {
                var hourText = (($scope.selectedHour < 10) ? "0" + $scope.selectedHour : $scope.selectedHour);
                var minuteText = (($scope.selectedMinute < 10) ? "0" + $scope.selectedMinute : $scope.selectedMinute);
                $scope.dateText = hourText + ":" + minuteText;

            }
            $scope.setDuration = function () {
                setDateText();
                $scope.quantity = $scope.selectedHour + (($scope.selectedMinute) ? ($scope.selectedMinute / 60) : 0);
                if ($scope.editService) {
                    $scope.editService.quantity = $scope.quantity;
                    if ($scope.serviceExpenseDurationPresentation === 'DURATION_PICKER') $rootScope.$broadcast('onChangeDuration', null);
                }
                if ($scope.serviceExpense) {
                    $scope.serviceExpense.quantity = $scope.quantity;
                    $rootScope.saveStartDate = new Date();
                    $rootScope.saveEndDate = new Date($rootScope.saveStartDate.getTime() + $scope.quantity * 3600000)
                }
            }
            function resetSelectedTime () {
                $scope.minutes.forEach(element =>  element.selected = false);
                $scope.hours.forEach(element =>  element.selected = false);
            }
            $scope.onToggleDropdown = function (open) {
                console.log('onToggleDropdown',open);
                if (!$scope.status.isopen && $scope.selectedHour === 0 && $scope.selectedMinute === 0) resetSelectedTime();
            }
            $scope.toggleDropdown = function ($event) {
               
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };
            $scope.onScrollHours = function ($event,top) {
                var container  = $($event.target).parent('.duration-container-values').find('.duration-container-values-hours');
               var scrollTop = container.scrollTop();
              if (top) {
                scrollTop -= 15;
              } else {
                scrollTop += 15;
              }
                container.scrollTop(scrollTop);
            }
            $scope.onScrollMinutes = function ($event,top) {
                var container  = $($event.target).parent('.duration-container-values').find('.duration-container-values-minutes');
               var scrollTop = container.scrollTop();
              if (top) {
                scrollTop -= 15;
              } else {
                scrollTop += 15;
              }
                container.scrollTop(scrollTop);
            }
            $scope.onInitSetDuration = function ($event) {
              var indexHour =   $scope.hours.findIndex(element => element.selected === true);
              $scope.selectedHour = 0;
              if (indexHour > -1) $scope.selectedHour = $scope.hours[indexHour].value;
              var indexMinute =   $scope.minutes.findIndex(element => element.selected === true);
              $scope.selectedMinute = 0;
              if (indexMinute > -1) $scope.selectedMinute = $scope.minutes[indexMinute].value;
                 
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
                if (isNaN(hour)) hour = 0;
                if (isNaN(minute)) minute = 0;
                $scope.selectedHour = hour;
                $scope.selectedMinute = minute;
                $scope.setDuration();
            }
            $scope.setDuration();
        }]);
}());
