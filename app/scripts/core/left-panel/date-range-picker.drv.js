'use strict';

(function () {

  angular.module("quicktech.core.leftPanel").directive('dateRangePicker', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        dateRangePicker: '=?'
      },
      link: function (scope, element, attrs) {
          var datepicker = element.datepicker({
            range: true,
            frequency: 'DAILY',
            language: 'en',
            multipleDatesSeparator: ' - ',
            position: 'right bottom',
            maxDate: new Date(),
            onSelect: function () {
              $timeout(function () {
                scope.dateRangePicker('dateRange', datepicker.selectedDates);
              });
            }
          }).data('datepicker');

        scope.$parent.clearDateRange =  datepicker.clear.bind(datepicker);
      }
    }
  }]);
})();
