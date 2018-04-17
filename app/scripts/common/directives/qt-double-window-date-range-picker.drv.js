'use strict';

(function () {

  angular.module("quicktech.common.directives").directive('qtDoubleWindowDateRangePicker',
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

            element.daterangepicker()

          }
        }
      }]);
})();
