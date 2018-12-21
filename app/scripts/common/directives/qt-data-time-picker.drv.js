'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtDataTimePicker',
    ['$timeout', '$filter',
      function ($timeout, $filter) {
        return {
          restrict: 'A',
          require: 'ngModel',
          scope: {
            minDate: '=',
            maxDate: '=',
            defaultDate: '=',
            positionToLeft: '='
          },
          link: function (scope, element, attrs, ctrl) {

            var options = {
              keepOpen: true,
              format: 'DD MMM YYYY',
              defaultDate: $filter('date')(Date.now(), 'dd MMM yyyy'),
              ignoreReadonly: true,
              sideBySide: true,
              widgetPositioning: {
                horizontal: scope.positionToLeft ? 'left' : 'right',
                vertical: 'auto'
              }
            };



            if (scope.minDate) {
              options.minDate = $filter('date')(scope.minDate, 'dd MMM yyyy');
            }

            if (scope.maxDate) {
              options.maxDate = $filter('date')(scope.maxDate, 'dd MMM yyyy');
            }

            if (scope.defaultDate) {
              var defaultDate = new Date(scope.defaultDate);
              if (defaultDate.getTime() < Date.now()) {
                defaultDate = Date.now();
              }
              options.defaultDate = $filter('date')(defaultDate, 'dd MMM yyyy');
            }

            $timeout(function () {
              // element.data('DateTimePicker').OPTIONS(options)
              element.data('DateTimePicker') && element.data('DateTimePicker').OPTIONS(options)

              element.datetimepicker(options);
              ctrl.$setPristine();
            });


            element.bind('dp.show', function (e) {
              element.parent().find('.datepicker').removeClass('datepicker');
            });


            element.bind('dp.change', function (e) {
              var formattedDate = $filter('date')(e.date._d, 'dd MMM yyyy');
              ctrl.$setViewValue(formattedDate);
              element.data('DateTimePicker') && element.data('DateTimePicker').OPTIONS(options)

              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
            });

          }
        }
      }]);
})();
