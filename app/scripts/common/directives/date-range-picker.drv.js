'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('dateRangePicker', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        dateRangePicker: '=?',
        onHide: '=?',
        minDate: '=?',
        dateFormat: '@?'
      },
      link: function (scope, element, attrs) {
        var hideTimeout;
        var datepicker = element.datepicker({
          range: attrs.isRange ? scope.$eval(attrs.isRange) : true,
          autoClose: true,
          frequency: 'DAILY',
          language: 'en',
          multipleDatesSeparator: ' - ',
          dateFormat: scope.dateFormat,
          position: attrs.position,
          minDate: scope.minDate ? new Date(+scope.minDate) : '',
          maxDate: scope.$eval(attrs.disableMaxDate) ? '' : new Date(),
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

        scope.$parent.clearDateRange = datepicker.clear.bind(datepicker);
      }
    }
  }]);
})();
