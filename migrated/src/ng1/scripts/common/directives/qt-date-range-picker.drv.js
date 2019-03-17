'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtDateRangePicker', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        qtDateRangePicker: '=?',
        onHide: '=?',
        minDate: '@?',
        maxDate: '@?',
        dateFormat: '@?'
      },
      link: function (scope, element, attrs) {
        var datepicker = initDatepicker(scope, element, attrs);

        attrs.$observe('minDate', function(value) {
              initDatepicker(scope, element, attrs);
        });

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
    };

    function initDatepicker(scope, element, attrs){
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
            scope.qtDateRangePicker && scope.qtDateRangePicker(datepicker.selectedDates);
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

      return datepicker;
    }
  }]);
})();
