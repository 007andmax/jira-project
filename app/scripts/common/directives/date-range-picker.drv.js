'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('dateRangePicker', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        dateRangePicker: '=?',
        onHide: '=?'
      },
      link: function (scope, element, attrs) {
        var hideTimeout;
        var datepicker = element.datepicker({
          range: true,
          autoClose: true,
          frequency: 'DAILY',
          language: 'en',
          multipleDatesSeparator: ' - ',
          position: attrs.position,
          maxDate: new Date(),
          onSelect: function () {
            $timeout(function () {
              scope.dateRangePicker(datepicker.selectedDates);
            });
          },
          onHide: function () {
            if (hideTimeout) {
              $timeout.cancel(hideTimeout);
            }
            hideTimeout = $timeout(function () {
              scope.onHide(datepicker.selectedDates);
              hideTimeout = undefined;
            }, 50);
          }
        }).data('datepicker');

        scope.$parent.clearDateRange = datepicker.clear.bind(datepicker);
      }
    }
  }]);
})();
