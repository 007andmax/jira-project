'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('dateTimePickerWithPeriod',
    [
      '$timeout', '$filter', 'Utils',
      function ($timeout, $filter, Utils) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            minDate: '=',
            maxDate: '=',
            period: '=',
            defaultDate: '=',
            startDate: '='
          },
          link: function (scope, element, attrs, ctrl) {
           

            var options = {
              keepOpen: true,
              format: 'DD MMM YYYY',
              defaultDate: $filter('date')(Date.now(), 'dd MMM yyyy'),
              ignoreReadonly: true,
              widgetPositioning: {
                horizontal: 'right',
                vertical: 'top'
              }
            }, dp,
              enabledDates = [],
              lastDate = '',
              sd = '',
              pickedDate = '';

            if (scope.minDate) {
              options.minDate = $filter('date')(scope.minDate, 'dd MMM yyyy');
            }

            if (scope.maxDate) {
              options.maxDate = $filter('date')(scope.maxDate, 'dd MMM yyyy');
            }

            if (scope.defaultDate) {
              var md = new Date(scope.minDate);
              var dd;
              if (scope.defaultDate instanceof String) {
                dd = new Date(scope.defaultDate);
              } else {
                dd = new Date(scope.minDate);
              }
              if (dd.getTime() <= md.getTime()) {
                options.defaultDate = $filter('date')(scope.minDate, 'dd MMM yyyy');
              } else {
                options.defaultDate = $filter('date')(scope.defaultDate, 'dd MMM yyyy');
              }

            }

            if (scope.startDate) {
              sd = $filter('date')(scope.startDate, 'dd MMM yyyy');
            }

            if (scope.period) {
              if (scope.period === 'Month') {
                enabledDates = [];
                enabledDates.push(scope.minDate);

              } else if (scope.period === 7) {
               
                let listDates = [];
                enabledDates = [];
                let startDate = new Date(scope.defaultDate);
                //  startDate = new Date(defaultDate.getTime() - 86400000);

                for (var i = 1; i <= 120; i++) {
                  var d = new Date(startDate.getTime() + 86400000 * 7 * i);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                enabledDates = listDates;

              } else if (scope.period === 15) {
                let listDates = [];
                enabledDates = [];
                let startDate = new Date(scope.defaultDate);
              //  startDate = new Date(startDate.getTime() - 86400000);
                for (var i = 1; i <= 120; i++) {
                  var d = new Date(startDate.getTime() + 86400000 * 15 * i);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                enabledDates = listDates;
              } else if (scope.period === 30) {
                let listDates = [];
                enabledDates = [];
                let startDate = new Date(scope.defaultDate);
              //  startDate = new Date(startDate.getTime() - 86400000);
                for (var i = 1; i <= 120; i++) {
                  var d = new Date(startDate.getTime() + 86400000 * 30 * i);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                enabledDates = listDates;
              } else {
                enabledDates = getEnabledDates(scope.minDate, scope.period);

              }
              enabledDates.unshift(scope.minDate);
              lastDate = enabledDates[enabledDates.length - 1];
              options.enabledDates = enabledDates;

            
              element.bind('dp.update', function (e) {

                var data = dp.data("DateTimePicker"),
                  minDate = new Date(scope.minDate);


                if (e.viewDate._d.getMonth() === minDate.getMonth() &&
                  e.viewDate._d.getFullYear() === minDate.getFullYear()) {
                  options.minDate = minDate;

                } else {
                  options.minDate = false;

                }

                dp = element.datetimepicker(options);
               

                changeDatePicker();
              });
            }

            $timeout(function () {
              dp = element.datetimepicker(options);
            }, 0);

            element.bind('dp.change', function (e) {
            
              var value;
              if (e.oldDate == null) {
                value = $filter('date')(scope.defaultDate, 'dd MMM yyyy');
                e.oldDate = value;
              } else {
                value = e.date._d;
              }
              ctrl.$setViewValue(value);
              pickedDate = value;
              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
            });

            element.bind('dp.hide', function (e) {

              if (scope.period) {
                if (scope.period === 'Month') {
                  enabledDates = [];
                  enabledDates.push(scope.minDate);
                } else {
                  enabledDates = getEnabledDates(scope.minDate, scope.period);

                }
                enabledDates.unshift(scope.minDate);
                lastDate = enabledDates[enabledDates.length - 1];
                dp.data("DateTimePicker").enabledDates(enabledDates);
              }
            });

            element.bind('dp.show', function (e) {
              changeDatePicker();
              element.parent().find('.datepicker').removeClass('datepicker');
            });

            function changeDatePicker() {
              var data = dp.data("DateTimePicker");
              dp = element.datetimepicker(options);
              var listDates = [];
              if (scope.period === 'Year') {
                var d = new Date(sd);
                for (var i = 1; i <= 10; i++) {
                  var nextYear = angular.copy(d);
                  nextYear.setFullYear(d.getFullYear() + i);
                  nextYear = Utils.minusDays(nextYear, 1);
                  listDates.push($filter('date')(nextYear, 'd MMM yyyy'));
                }
                data.enabledDates(listDates);
              } else if (scope.period === 'Month') {

                for (var i = 1; i <= 120; i++) {
                  var d = new Date(sd);
                  d = Utils.addNumberOfMonth(d, i);
                  d = Utils.minusDays(d, 1);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                data.enabledDates(listDates);
              } else if (scope.period === 7) {
                let startDate = new Date(scope.startDate);
                startDate = new Date(startDate.getTime() - 86400000);
                for (var i = 1; i <= 120; i++) {
                  var d = new Date(startDate.getTime() + 86400000 * 7 * i);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                data.enabledDates(listDates);
              } else if (scope.period === 15) {
                let startDate = new Date(scope.startDate);
                startDate = new Date(startDate.getTime() - 86400000);
                for (var i = 1; i <= 120; i++) {
                  var d = new Date(startDate.getTime() + 86400000 * 15 * i);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                data.enabledDates(listDates);
              } else if (scope.period === 30) {
                let startDate = new Date(scope.startDate);
                startDate = new Date(startDate.getTime() - 86400000);
                for (var i = 1; i <= 120; i++) {
                  var d = new Date(startDate.getTime() + 86400000 * 30 * i);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                }
                data.enabledDates(listDates);
              }
              else {
                enabledDates = enabledDates.concat(getEnabledDates(scope.defaultDate, scope.period));
                lastDate = enabledDates[enabledDates.length - 1];
                data.enabledDates(enabledDates);
              }
              scope.$apply();
            }

            function getEnabledDates(start, period) {
              var dates = [],
                date = new Date(start),
                startMonth = date.getMonth(),
                startYear = date.getFullYear(),
                parsedPeriod = parseInt(period);

              if (parsedPeriod) {
                period = parsedPeriod;
              }

              if (period === 'Month') {
                // date.setMonth(date.getMonth() + 1);
                // dates.push($filter('date')(date, 'd MMM yyyy'));
              } else if (period === 'Year') {
                date.setFullYear(date.getFullYear() + 1);
                dates.push($filter('date')(date, 'd MMM yyyy'));
              } else {
                do {
                  date.setDate(date.getDate() + period);

                  dates.push($filter('date')(date, 'd MMM yyyy'));
                } while (startMonth === date.getMonth());
              }

              lastDate = dates[dates.length - 1];

              return dates;
            }
          }
        }
      }
    ]);
})();
