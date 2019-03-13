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
              sd='',
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
              if(scope.defaultDate instanceof String) {
                dd = new Date(scope.defaultDate);
              } else {
                dd = new Date(scope.minDate);
              }
              if(dd.getTime() <= md.getTime()) {
                options.defaultDate = $filter('date')(scope.minDate, 'dd MMM yyyy');
              } else {
                options.defaultDate = $filter('date')(scope.defaultDate, 'dd MMM yyyy');
              }

            }

            if (scope.startDate) {
              sd = $filter('date')(scope.startDate, 'dd MMM yyyy');
            }

            if (scope.period) {
              if(scope.period === 'Month') {
                enabledDates = [];
                enabledDates.push(scope.minDate);
              } else {
                enabledDates = getEnabledDates(scope.minDate, scope.period);

              }
              enabledDates.unshift(scope.minDate);
              lastDate = enabledDates[enabledDates.length - 1];
              options.enabledDates = enabledDates;

              element.bind('dp.update', function (e) {
                var data = dp.data("DateTimePicker"),
                  minDate = new Date(scope.minDate);
                //console.log(pickedDate);

                if (e.viewDate._d.getMonth() === minDate.getMonth() &&
                  e.viewDate._d.getFullYear() === minDate.getFullYear()) {
                  options.minDate = minDate;
                } else {
                  options.minDate = false;
                }

                dp = element.datetimepicker(options);

                if (scope.period === 'Year') {
                  lastDate = new Date(lastDate);
                  var nextYear = lastDate.getFullYear() + 1;
                  if (e.viewDate._d.getMonth() === minDate.getMonth() && e.viewDate._d.getFullYear() === nextYear) {
                    enabledDates.push(new Date(lastDate.setFullYear(nextYear)));
                    lastDate = enabledDates[enabledDates.length - 1];
                    data.enabledDates(enabledDates);
                  }
                } else if(scope.period === 'Month'){
                  var d = new Date(sd);
                  d = Utils.addNumberOfMonth(d, enabledDates.length);
                  d = Utils.minusDays(d, 1);
                  //enabledDates.push($filter('date')(d, 'd MMM yyyy'));
                  enabledDates = enabledDates.concat($filter('date')(d, 'd MMM yyyy'));
                  data.enabledDates(enabledDates);

                }else {
                  enabledDates = enabledDates.concat(getEnabledDates(lastDate, scope.period));
                  lastDate = enabledDates[enabledDates.length - 1];
                  data.enabledDates(enabledDates);
                }
              });
            }

            $timeout(function () {
              dp = element.datetimepicker(options);
            }, 0);

            element.bind('dp.change', function (e) {
              ctrl.$setViewValue(e.date._d);
              pickedDate = e.date._d;
              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
            });

            element.bind('dp.hide', function (e) {
              if (scope.period) {
                if(scope.period === 'Month') {
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
              element.parent().find('.datepicker').removeClass('datepicker');
            });

            function getEnabledDates(start, period) {
              var dates = [],
                date = new Date(start),
                startMonth = date.getMonth(),
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
