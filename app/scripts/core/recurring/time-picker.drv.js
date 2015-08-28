'use strict';

(function () {

  angular.module("quicktech.core.recurring").directive("timePicker", function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ctrl) {

        var today = new Date();

        element.datetimepicker({
          viewMode: 'years',
          keepOpen: false,
          format: 'DD MMM YYYY',
          minDate: today
        }).on('dp.change', function (event) {
          ctrl.$setViewValue(event.date._d);
        });
      }

    };
  });
})();
