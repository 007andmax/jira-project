'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('dateRangePicker', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        dateRangePicker: '=?',
        onHide: '=?',
        minDate: '@?',
        maxDate: '@?',
        dateFormat: '@?'
      },
      link: function (scope, element, attrs) {
        var hideTimeout;
        var datepicker = element.datepicker({
          range: typeof attrs.range === 'string',
          autoClose: true,
          frequency: 'DAILY',
          language: 'en',
          multipleDatesSeparator: ' - ',
          dateFormat: scope.dateFormat,
          position: attrs.position,
          minDate: scope.minDate ? new Date(+scope.minDate) : '',
          maxDate: scope.maxDate ? new Date(+scope.maxDate) : '',
          onSelect: function () {
            $timeout(function () {
              scope.dateRangePicker && scope.dateRangePicker(datepicker.selectedDates);
            });
          },
          onHide: function () {
            if (scope.onHide) {
              if (hideTimeout) {
                $timeout.cancel(hideTimeout);
              }
              hideTimeout = $timeout(function () {
                scope.onHide(datepicker.selectedDates);
                hideTimeout = undefined;
              }, 50);
            }
          }
        }).data('datepicker');

        // attrs.$observe('minDate', function(value) {
        //   datepicker.minDate = value ? new Date(+scope.minDate) : '';
        //   datepicker.minDate(value);
        // });

        if (scope.$parent.clearDateRange) {
          var savePreviousClearFunc = scope.$parent.clearDateRange;
          scope.$parent.clearDateRange = function () {
            savePreviousClearFunc();
            datepicker.clear();
          }
        } else {
          scope.$parent.clearDateRange = datepicker.clear.bind(datepicker);
        }
      }
    }
  }]);
})();
