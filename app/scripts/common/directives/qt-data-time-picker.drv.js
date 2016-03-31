'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtDataTimePicker',
    [
      '$timeout', '$filter',
      function ($timeout, $filter) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            minDate: '=',
            maxDate: '=',
            period: '=',
            defaultDate: '='
          },
          link: function (scope, element, attrs, ctrl) {

            var options = {
                keepOpen: true,
                format: 'DD MMM YYYY',
                defaultDate: 'now',
                ignoreReadonly: true
              }, dp,
              firstDate = '',
              lastDate = '',
              year = '';

            if (scope.minDate) {
              options.minDate = scope.minDate;
            }

            if (scope.maxDate) {
              options.maxDate = scope.maxDate;
            }

            if (scope.defaultDate) {
              options.defaultDate = scope.defaultDate;
            }

            if (scope.period) {
              options.enabledDates = getEnabledDates(scope.minDate, scope.period);
              year = new Date(scope.minDate).getFullYear();

              element.bind('dp.update', function (e) {
                var data = dp.data("DateTimePicker"),
                  minDate = new Date(scope.minDate);

                if (e.viewDate._d.getMonth() === minDate.getMonth() &&
                  e.viewDate._d.getFullYear() === minDate.getFullYear()) {
                  options.minDate = scope.minDate;
                } else {
                  options.minDate = false;
                }

                dp = element.datetimepicker(options);

                if (scope.period === 'Yearly') {
                  if (e.viewDate._d.getMonth() === minDate.getMonth()) {
                    if (e.viewDate._d.getFullYear() === year + 1) {
                      year++;
                      data.enabledDates(getEnabledDates(new Date(year, minDate.getMonth(), minDate.getDate()),
                        scope.period));
                    } else if (e.viewDate._d.getFullYear() === year - 1) {
                      data.enabledDates(getEnabledDates(new Date(year, minDate.getMonth(), minDate.getDate()),
                        scope.period, true));
                      year--;
                    }
                  }
                } else {
                  if (e.viewDate._d.getMonth() === new Date(lastDate).getMonth()) {
                    data.enabledDates(getEnabledDates(lastDate, scope.period));
                  } else {
                    data.enabledDates(getEnabledDates(firstDate, scope.period, true));
                  }
                }
              });
            }

            $timeout(function () {
              dp = element.datetimepicker(options);
            }, 0);

            //element.on('shown.bs.dropdown', function(){
            //  var dropdown = element.find('.dropdown-menu');
            //  dropdown.css({'left': '95px'})
            //});

            element.bind('dp.change', function (e) {
              ctrl.$setViewValue(e.date._d);
            });

            element.bind('dp.hide', function (e) {
              dp.data("DateTimePicker").enabledDates(getEnabledDates(scope.minDate, scope.period));
              year = new Date(scope.minDate).getFullYear();
            });

            function getEnabledDates(start, period, back) {
              var dates = [$filter('date')(start, 'd MMM yyyy')],
                date = new Date(start),
                startMonth = date.getMonth() + (back ? -1 : 0);

              if (startMonth < 0) startMonth = 11;

              if (back && angular.isNumber(period)) {
                period = -period;
              }

              if (period === 'Monthly') {
                date.setMonth(date.getMonth() + (back ? -1 : 1));
                dates.push($filter('date')(date, 'd MMM yyyy'));
              } else if (period === 'Yearly') {
                date.setFullYear(date.getFullYear() + (back ? -1 : 1));
                dates.push($filter('date')(date, 'd MMM yyyy'));
              } else {
                do {
                  date.setDate(date.getDate() + period);
                  dates.push($filter('date')(date, 'd MMM yyyy'));
                } while (startMonth === date.getMonth());
              }

              if (back) {
                dates.reverse();
              }

              firstDate = back ? dates[1] : dates[0];
              lastDate = dates.pop();
              return dates;
            }
          }
        }
      }
    ]);
})();
