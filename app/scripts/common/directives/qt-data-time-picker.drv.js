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
            defaultDate: '='
          },
          link: function (scope, element, attrs, ctrl) {

            var options = {
              keepOpen: true,
              format: 'DD MMM YYYY',
              defaultDate: $filter('date')(Date.now(), 'dd MMM yyyy'),
              ignoreReadonly: true
            };

            if (scope.minDate) {
              options.minDate = $filter('date')(scope.minDate, 'dd MMM yyyy');
            }

            if (scope.maxDate) {
              options.maxDate = $filter('date')(scope.maxDate, 'dd MMM yyyy');
            }

            if (scope.defaultDate) {
              options.defaultDate = $filter('date')(scope.defaultDate, 'dd MMM yyyy');
            }

            $timeout(function () {
              element.datetimepicker(options);
            }, 0);

            //element.on('shown.bs.dropdown', function(){
            //  var dropdown = element.find('.dropdown-menu');
            //  dropdown.css({'left': '95px'})
            //});

            element.bind('dp.show', function (e) {
              element.parent().find('.datepicker').removeClass('datepicker');
            });


            element.bind('dp.change', function (e) {
              ctrl.$setViewValue(e.date._d);
              element.data('DateTimePicker') && element.data('DateTimePicker').hide();
            });

          }
        }
      }]);
})();
