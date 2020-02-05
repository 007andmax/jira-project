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
                console.log("dp.update");
                var data = dp.data("DateTimePicker"),
                  minDate = new Date(scope.minDate);
               

                if (e.viewDate._d.getMonth() === minDate.getMonth() &&
                  e.viewDate._d.getFullYear() === minDate.getFullYear()) {
                  options.minDate = minDate;
                  console.log('options 1', options);
                } else {
                  options.minDate = false;
                  console.log('options 2', options);
                }

                dp = element.datetimepicker(options);

                if (scope.period === 'Year') {
                  var listDates = [];
                  var d = new Date(sd);
                  for (var i=1;i<=10;i++) {
                   
                 var nextYear = angular.copy(d);
                 nextYear.setFullYear(d.getFullYear() + i);
                 nextYear = Utils.minusDays(nextYear, 1);
                  listDates.push($filter('date')(nextYear, 'd MMM yyyy'));
                  }
                  data.enabledDates(listDates);
                  console.log('listDates',listDates);
                 /* lastDate = new Date(lastDate);

                  var nextYear = lastDate.getFullYear() + 1;
                  if (e.viewDate._d.getMonth() === minDate.getMonth() && e.viewDate._d.getFullYear() === nextYear) {
                    enabledDates.push(new Date(lastDate.setFullYear(nextYear)));
                    lastDate = enabledDates[enabledDates.length - 1];
                    data.enabledDates(enabledDates);
                  }*/
                } else if(scope.period === 'Month'){
                  var listDates = [];
                /*  var d = new Date(sd);
                  d = Utils.addNumberOfMonth(d, 12);
                  console.log('d',angular.copy(d));
                  d = Utils.minusDays(d, 1);*/
                  
                  for (var i=1;i<=120;i++) {
                    var d = new Date(sd);
                  d = Utils.addNumberOfMonth(d, i);
                  console.log('d',angular.copy(d));
                  d = Utils.minusDays(d, 1);
                  listDates.push($filter('date')(d, 'd MMM yyyy'));
                  }
                  console.log('listDates',listDates);
                  //enabledDates.push($filter('date')(d, 'd MMM yyyy'));
                 // enabledDates = enabledDates.concat($filter('date')(listDates, 'd MMM yyyy'));
                  data.enabledDates(listDates);
                   

                }else {
                  console.log('scope.defaultDate',angular.copy(scope.defaultDate));
                  enabledDates = enabledDates.concat(getEnabledDates(scope.defaultDate, scope.period));

                  lastDate = enabledDates[enabledDates.length - 1];
                  data.enabledDates(enabledDates);
                  console.log('444444444444',enabledDates);
                }
                scope.$apply();
              });
            }

            $timeout(function () {
              dp = element.datetimepicker(options);
            }, 0);

            element.bind('dp.change', function (e) {
              console.log("dp.change");
              ctrl.$setViewValue(e.date._d);
              pickedDate = e.date._d;
              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
            });

            element.bind('dp.hide', function (e) {
              console.log("dp.hide");
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
              console.log("dp.hide");
              element.parent().find('.datepicker').removeClass('datepicker');
            });

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
              console.log('dates',angular.copy(dates));
              return dates;
            }
          }
        }
      }
    ]);
})();
